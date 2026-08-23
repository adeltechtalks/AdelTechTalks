# V3_SECURITY_MODEL

**Status:** proposal. **Revised in v3.1** — §5 and the new §5.1 correct a defect
in the v3 draft. See `V3.1_ARCHITECTURE_PATCH.md` §1.
**Governing rule:** v3 must not weaken the production security posture. Today that posture is genuinely good *because the attack surface is small* — nothing is gated, no money moves, and the only writes are a person's own progress. v3 adds gated content, money and server endpoints, so the posture has to grow with it.

---

## 1 · The honest starting assessment

**What v2.x gets right and v3 keeps**

- RLS is enabled on all four live tables, with owner-only policies.
- The Supabase anon key is public **by design**, and the schema comments say so explicitly — RLS is what protects the data, not key secrecy. That is the correct mental model and it is already written down.
- `shares` is a deliberate, minimal public projection: badge, display name, date. No email, no progress, no answers. Public exposure was a design decision with a documented trade-off, not an accident.
- Newsletter capture is insert-only for `anon` with a honeypot and client-side validation, and the unique index on `lower(email)` makes duplicate handling a 23505 rather than a leak.
- No secrets in the client bundle. No service-role key anywhere in the repo.

**What v2.x does not have, and v3 cannot ship without**

1. **No server-side session verification.** Auth is entirely client-side: `localStorage` is read to decide whether to show "Sign in" or "Your profile". That is fine when nothing is gated and it is *completely inadequate* the moment a page holds paid content. Anyone can set a `localStorage` key.
2. **No server endpoints at all** beyond one prerender-off page. Everything v3 needs — scoring, XP, entitlements, downloads, webhooks — must be built as a new, hardened surface rather than extended from an existing one.
3. **No rate limiting anywhere.** The newsletter endpoint can be posted to in a loop today. It has not mattered; with challenge scoring and checkout it will.

None of this is a defect in v2.x. It is the correct amount of security for what v2.x does. It is the wrong amount for v3.

---

## 2 · Defense in depth

Four layers. **Every one of them assumes the layer above it has already failed.**

| layer | protects against |
|---|---|
| 1 · Network / edge | volumetric abuse, bots |
| 2 · Application (server routes) | unauthenticated and unauthorised requests |
| 3 · Database (RLS) | a compromised client, a leaked anon key, an application bug |
| 4 · Storage (private buckets + signed URLs) | link sharing, direct object access |

The test for the whole design: **if the anon key and the entire client bundle were published tomorrow, what could an attacker read or change?** Answer, and it must stay this answer: only their own rows, plus the deliberately public projections — `badges` (catalogue), `achievement_verifications` (non-revoked), `workshops`.

---

## 3 · Server-side sessions

Every privileged operation verifies the session on the server, using the Supabase server client and the request's auth cookie:

```ts
// server-only. Never import into a client island.
requireUser(request): Promise<User>     // throws 401
optionalUser(request): Promise<User|null>
```

Rules:
- **`user_id` is never accepted from a request body or query string.** It is derived from the verified session, always. This is the single most important line in this document: a `user_id` parameter is an authorisation bypass with a friendly name.
- Gated pages are `prerender = false` and call `requireUser` before rendering anything, redirecting to `/login?next=<path>` when it throws.
- The client-side `localStorage` read stays — but only ever to decide *which navigation label to show*. It never gates content, and the comment in `AuthNav.astro` must say so.

### Redirect safety

`?next=` is a classic open-redirect. The rule: **allow only same-origin absolute paths.**

```
accept  /account/, /courses/x/lesson-2/
reject  //evil.com, https://evil.com, /\evil.com, javascript:, anything with a scheme or authority
```

Validated by parsing against the site origin and requiring `pathname` to start with a single `/`, not by a blocklist. Applied to the OAuth `redirectTo` as well; Supabase's allowed-redirect list is configured to the production origin and nothing else.

### Session handling

Supabase-managed JWT with refresh. Cookies `HttpOnly`, `Secure`, `SameSite=Lax` — Lax rather than Strict so an achievement link from LinkedIn lands a signed-in user signed in. Sign-out clears server and client state. Account deletion cascades everywhere via `on delete cascade` and removes storage objects.

---

## 4 · Secrets

| secret | lives | may reach the browser |
|---|---|---|
| `SUPABASE_URL`, `SUPABASE_ANON_KEY` | public config | **yes, by design** |
| `SUPABASE_SERVICE_ROLE_KEY` | Cloudflare secret binding | **never** |
| `STRIPE_SECRET_KEY` | Cloudflare secret binding | **never** |
| `STRIPE_WEBHOOK_SECRET` | Cloudflare secret binding | **never** |
| `STRIPE_PUBLISHABLE_KEY` | public config | yes |

Enforcement, not intention:
- Server-only modules live under `src/server/` and a build check fails if anything under `src/components/` or a client island imports from it.
- A CI grep fails the build on `service_role`, `sk_live`, `sk_test` or `whsec_` appearing anywhere in `dist/`.
- The service-role client is constructed in exactly one file, which exports functions rather than the client itself.

---

## 5 · RLS policy design

Applied per table, in the migration that creates it, never retrofitted.

| table | anon | authenticated (self) | authenticated (others) | notes |
|---|---|---|---|---|
| `profiles` | — | select, update | — | insert via definer trigger only |
| `enrollments` | — | select | — | written server-side; `completed_at` set by the server |
| `challenge_attempts` | — | select | — | **written server-side: scoring is server-side or a client posts itself a 100**. `scored_by` records whether the score is evidence |
| `lesson_progress` | — | select | — | **v3.1: was `all`.** Completion is evidence for a course achievement |
| `saved_prompts` | — | all | — | the one client-writable table: a bookmark, awards nothing |
| `xp_events` | — | select | — | write = award yourself any level |
| `xp_balances`, `skill_progress` | — | select | — | derived |
| `badges` (catalogue) | **select** | select | select | public, non-sensitive |
| `user_badges` | — | select | — | write = award yourself any badge |
| `achievement_verifications` | **select** where not revoked | **select only** | select | **v3.1: no client write of any kind.** See §5.1 |
| `playground_track_badges` (legacy) | — | select | — | **v3.1: was `all`.** Retirement schedule in migration 07 |
| `progress` (legacy) | — | select | — | **v3.1: was `all`.** Same schedule |
| `schema_state` | — | — | — | no policy at all; service role only |
| `entitlements`, `purchases`, `subscriptions` | — | select | — | webhook writes only |
| `stripe_events` | — | — | — | **no policy at all**; service role only |
| `subscribers` | **insert** | insert | — | unchanged from v2.x |
| `workshops` | select | select | select | public |

Two design notes worth stating because they are easy to get wrong:

- **Read-only-to-self plus server-side writes** is the shape for anything that confers value. If a client can write it, a client can grant itself the thing.
- The public `select` on `achievement_verifications` is scoped `where revoked_at is null` **in the policy**, not in application code. Un-publishing has to work even if a page forgets to filter.

### The v3.1 policy test

The v3 draft's rule was *"own rows only"*. That rule is not sufficient, and this
document said so in the abstract while the migration set broke it in the
concrete. The rule is now:

> **A client may write a table only if writing it confers nothing.**

A row that is *about you* can still be a row that *claims something untrue about
you*. The question each policy must answer is not "whose row is this?" but **"if
a client wrote this row itself, what could it then obtain?"** If the answer is
XP, a level, a badge, a completion, an entitlement or a public verification, the
table is server-written and there is no owner-write policy on it.

Applying that test cost four policy changes: `achievement_verifications`,
`lesson_progress`, `playground_track_badges` and `progress`.

---

## 5.1 · Public achievement verification — the defect and the fix

**This section exists because the v3 draft got it wrong, and the shape of the
mistake is worth keeping on the record.**

`site/supabase/v3/03_achievements.sql` granted `authenticated` a direct insert:

```sql
create policy "own verification insert" on public.achievement_verifications
  for insert to authenticated with check (auth.uid() = user_id);
```

That check proves the row is *about* the caller. It proves nothing about whether
the caller earned the thing the row claims. Any signed-in person could insert a
row naming any badge in the public catalogue and immediately hold a public,
crawlable, OG-carded page asserting they had earned it — with the site's own
branding on the share card vouching for it.

It passed review three times because every individual statement around it was
true: the table is a deliberate public projection; the row holds nothing
sensitive; sharing is the user's own choice; `shares` worked this way in v2.x.
The last one is where it came from and it is where the reasoning broke. In v2.x,
`shares` was written by a client that had *already* written its own `badges` row
client-side — the whole loop was self-asserted, and that was acceptable because a
Playground track badge asserted nothing beyond "I clicked through a quiz". v3
makes badges mean something: earned against server-scored challenges, tied to
course completion, tied to XP thresholds. **The moment a badge means something,
the ability to self-issue one stops being harmless.** The v2.x precedent was
carried across without re-asking whether its premise still held.

### The fix

1. **No insert, update or delete policy on `achievement_verifications`, for any
   role.** The grants are revoked as well, so a future policy added by accident
   still cannot write. The only policy on the table is the public `select`,
   scoped `revoked_at is null`.
2. **All writes go through `POST /api/achievements/publish`**, which proves
   ownership against `user_badges`, `enrollments` or `challenge_attempts` before
   writing, derives every public field server-side, and generates the
   verification id itself. Full contract: `V3_API_SURFACE.md` §2.
3. **Un-publishing is a soft revoke** scoped to the session's `user_id`, not a
   client delete. The id survives, so re-publishing restores the same URL rather
   than orphaning every link already posted.
4. **A self-assessed score is not evidence.** `challenge_attempts.scored_by`
   records how a score was produced, and the publish endpoint refuses
   `self_assessed`. Otherwise "score ≥90 on a Create challenge" would have been
   self-issued through a longer path.
5. **The legacy client-writable path is retired on a dated schedule**
   (migration 07), because `playground_track_badges` fed `user_badges`, and
   `user_badges` is what the publish endpoint accepts as proof.

### What the fix is tested by

The hostile-client table in `V3_API_SURFACE.md` §2.4 is a CI test file, not
prose. Every row in it must pass before Phase 2 ships.

---

## 6 · Rate limiting and abuse

Cloudflare is the first layer; the application is the second.

| endpoint | limit | on exceed |
|---|---|---|
| `/api/newsletter` | 5 / hour / IP | 429, generic message |
| `/api/challenge/score` | 30 / hour / user; 10 / hour / anon IP | 429 |
| `/api/checkout` | 10 / hour / user | 429 |
| `/api/download/*` | 20 / hour / user | 429 |
| `/api/achievements/publish` | 10 / hour / user | 429 |
| `/api/learning/progress` | 120 / hour / user | 429 |
| `/api/stripe/webhook` | not limited | signature is the gate |
| `/login` OAuth start | 20 / hour / IP | 429 |

Additional protections: the newsletter honeypot stays; challenge scoring is server-side with a minimum plausible duration to catch scripted submission; XP idempotency keys make replay worthless; and anonymous `anon_key` rows are capped per IP and expired after 30 days.

**Rate-limit responses never reveal whether an account or resource exists.**

---

## 7 · Content security

- Response headers: `Content-Security-Policy` (no `unsafe-eval`; inline styles allowed only via Astro's hashed output), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` denying camera/microphone/geolocation.
- **User-supplied text is never rendered as HTML.** Display names and Create-format challenge submissions are escaped by Astro's interpolation. `set:html` is used only for build-time trusted content (the Lucide inline SVG) and every use is grepped in review.
- Display names are length-capped, stripped of control characters, and rejected if they contain a URL — a public achievement page is a link surface and it is not going to be an open one.
- Prompt and challenge submissions are size-capped before they reach storage.

---

## 8 · Privacy

- Store the minimum. No IP logging beyond Cloudflare's own, no analytics fingerprinting, no third-party trackers.
- Anonymous challenge play stores one opaque random key and no PII; it is deleted at claim and expired after 30 days.
- Account deletion is a real delete, cascading to every user table and removing storage objects, not a soft flag.
- Public achievement pages expose only what the user chose to publish, and un-publishing works from the account page.
- Newsletter consent stays separate from account state, in both directions.

---

## 9 · Review gates before any v3 code ships

1. Threat-model review of every new `/api/*` route: who can call it, what happens when they lie. `V3_API_SURFACE.md` is the register; a route absent from it does not ship.
2. RLS verified **empirically** — a test that authenticates as user A and asserts it cannot read user B's rows, per table. Policies are asserted, not assumed.
3. `dist/` grepped for secret patterns in CI.
4. Redirect validation unit-tested against the full hostile list.
5. Stripe webhook tested with an invalid signature (must 400) and a duplicated event (must be a no-op).
6. `/api/download/*` tested without entitlement (must fail closed) and with an expired signed URL.
7. The existing 113-check browser QA extended, not replaced.
8. **The publish-endpoint hostile-client suite** (`V3_API_SURFACE.md` §2.4) passes in full — including the direct-insert-with-anon-key case, asserted against RLS *and* against the grant, separately.
9. **A policy audit**, run as a query rather than read as a diff: every table in `public` with an `insert`, `update` or `delete` policy for `anon` or `authenticated` is listed, and each one is justified in writing against the §5 test. After v3.1 the expected list is exactly `saved_prompts` and `subscribers`.
