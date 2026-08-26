# Security checks

Three guardrails, added in PR 2, before any of the v3 auth, migration or member
work begins. They exist to catch a specific set of mistakes — not to produce a
dashboard.

| check | needs credentials? | needs network? | where it runs |
|---|---|---|---|
| `security:secrets` | no | no | local + CI |
| `security:dist` | no | no | local + CI (after a build) |
| `security:policy` | no | no | local + CI |
| `security:rls` | no* | **yes** | local + CI |

\* it uses the Supabase **anon** key already committed in `site.config.ts`.
Two optional test accounts unlock one extra assertion.

---

## What is checked

### 1 · Secret scan — `npm run security:secrets`

Scans every **git-tracked** file in the repository.

| rule | fails on |
|---|---|
| `privileged-jwt` | a JWT whose decoded `role` claim is anything other than `anon` |
| `stripe-live-secret` · `stripe-test-secret` | `sk_live_…` / `sk_test_…` |
| `stripe-webhook-secret` | `whsec_…` |
| `private-key` | a `-----BEGIN … PRIVATE KEY-----` block |
| `github-token` | `ghp_…` |
| `committed-env-secret` | `SUPABASE_SERVICE_ROLE_KEY` / `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` assigned a literal value |

**The rule that makes this usable:** this repository commits the Supabase anon
key on purpose — it is designed to be public, and RLS is what protects the data.
So the scanner **decodes the token and reads its `role` claim** instead of
matching on shape. `role: "anon"` passes; `role: "service_role"` fails. A scanner
that flagged every JWT would fail on day one, get silenced, and then catch
nothing.

`npm run security:dist` additionally scans **built client output** and adds one
rule: the literal string `service_role` may not appear in anything a browser
downloads. `dist/_worker.js` is excluded — it is server code, it legitimately
reads secret bindings *by name*, and a check that failed on the name would just
teach people to rename the binding.

**Self-test.** `security:secrets` runs a self-test first: every rule is fired
against a synthetic sample, and the anon key is asserted *not* to fire. A scanner
nobody has seen catch anything is a scanner nobody should trust.

### 2 · Policy audit — `npm run security:policy`

Parses every `.sql` under `supabase/` and asserts:

| rule | severity | meaning |
|---|---|---|
| `rls-disabled` | FAIL | a table created in `public` with no `enable row level security` |
| `anon-write-unchecked` | FAIL | a write policy granted to `anon` with no `WITH CHECK` |
| `broad-for-all` | REVIEW | one `FOR ALL` policy covering read and every write |
| `public-select-exposes-identifier` | REVIEW | `SELECT to anon USING (true)` on a table holding `user_id`, `email` or `anon_key` |
| `rls-no-policy` | REVIEW | RLS on with no policy — correct for service-role-only tables, a mistake anywhere else |

It also prints the list of **client-writable tables**, which is the single number
worth watching as v3 lands.

### 3 · RLS check — `npm run security:rls`

Asks the live database what the **public anon key** can actually reach, because
a policy in a file and a policy that is applied are different things.

```
subscribers   asserted NOT readable
progress      asserted NOT readable
badges        asserted NOT readable
shares        asserted READABLE      ← deliberate; /badge/[id] needs it
```

The fourth assertion is the important one. A suite that only checks that things
are locked passes happily on a database where everything is broken, including
the parts that are supposed to work.

With `RLS_TEST_EMAIL_A/B` and `RLS_TEST_PASSWORD_A/B` set, it adds a real
cross-user isolation assertion: sign in as A, read `progress` and `badges`,
assert no row belongs to anyone else.

---

## What is intentionally NOT checked

Listing these matters as much as listing the checks — an unstated gap reads as
coverage.

- **Dependency CVEs.** `npm audit` is noisy on transitive dev dependencies and
  its findings are mostly unactionable here. Worth adding as a scheduled,
  non-blocking job later; it is not a PR gate.
- **Whether a private table is empty or merely denied.** With only the anon key,
  "no rows" and "denied by RLS" are indistinguishable. The check catches the
  failure that matters — rows becoming visible — but it cannot prove a table has
  rows to hide. Cross-user assertions with real accounts close this.
- **Secrets in git history.** Only the current tree is scanned. If a secret is
  ever found, rotating it matters more than scrubbing the log.
- **Untracked local files.** A developer's scratch file is their own business.
- **Runtime behaviour of server endpoints.** There are none yet — exactly one
  route opts out of prerendering. The hostile-client suite for
  `/api/achievements/publish` arrives with the endpoint, in a later PR.
- **Stripe, storage, entitlements.** None exist yet. Their checks ship with them.
- **Static analysis of application logic.** No linter is added here. `astro
  build` performs type resolution and that is the current bar.

---

## False positives, and how to handle one

**Never silence a `privileged-jwt` finding.** If that rule fires, a key that
bypasses every RLS policy is in the repository: rotate it first, then remove it.

For the literal-pattern rules, add a trailing comment on the offending line
naming the reason:

```js
const example = 'sk_test_abc…'; // security-scan-allow: fixture in a doc example
```

The marker requires a reason, so the next reader can judge it rather than trust
it. It does not apply to `privileged-jwt`.

For a **policy** finding, the escape hatch is `accepted-findings.json`. An entry
names the rule, the table and a reason. Anything not listed fails the build — so
accepting a finding is a reviewable diff rather than a silent tolerance, and
*removing* an entry is how a question gets re-opened.

Three findings are accepted today, each with a reason and a stated revisit point:
`shares` exposing `user_id` publicly, and the `FOR ALL` policies on `progress`
and `badges`.

---

## Local developer workflow

```bash
cd site
npm run security                          # secrets (self-test first) → policy → live RLS
npm run build && npm run security:dist    # what the browser actually downloads
```

`npm run security` needs no setup. `security:rls` needs outbound access to
Supabase; without it, it **skips and says so**, and never reports a skip as a
pass.

Before touching anything under `supabase/`, run `npm run security:policy` — it is
instant, and it is the check most likely to catch a mistake early.

## CI behaviour

`.github/workflows/ci.yml`, on every pull request and every push to `main`. Two
jobs:

- **Build + QA** — `npm run build`, `npm run qa`, then the built-output secret scan.
- **Security guardrails** — the self-test, the source secret scan, the policy
  audit, and the live RLS check.

Deployment is deliberately **not** here. Cloudflare deploys from its own Git
integration on push to `main`; putting a deploy step in Actions would give the
site two deployers.

## Failure conditions

| condition | result |
|---|---|
| a privileged JWT, provider secret or private key is committed | **CI fails** |
| `service_role` appears in built client output | **CI fails** |
| a `public` table has no RLS | **CI fails** |
| an `anon` write policy has no `WITH CHECK` | **CI fails** |
| a REVIEW finding is not in `accepted-findings.json` | **CI fails** |
| the anon key reads `subscribers`, `progress` or `badges` | **CI fails** |
| `shares` becomes unreadable | **CI fails** — this breaks `/badge/[id]` for crawlers |
| a secret-scan rule stops firing | **CI fails** (self-test) |
| Supabase is unreachable | **skips, loudly.** Never a pass |
