# V3_API_SURFACE

**Status:** proposal. **New in v3.1.**

The v3 set described endpoints in four different documents and never in one
place. The review that produced v3.1 found a security defect precisely in the gap
between them — an RLS policy in a migration and a "sharing is opt-in" sentence in
the gamification document, with nothing in between saying who was allowed to
assert that an achievement had been earned. This document is that missing layer:
every server endpoint, what it accepts, what it refuses to accept, and what it
proves before it writes.

---

## 0 · The four rules every endpoint follows

1. **`user_id` is never accepted.** Not in a body, not in a query string, not in
   a header. It is derived from the verified session. A `user_id` parameter is an
   authorisation bypass with a friendly name.
2. **Nothing that confers value is accepted from the client.** Not XP, not a
   score, not a level, not a badge key's ownership, not a completion state, not a
   price, not an entitlement, not a verification id. The client says *what it
   wants to do*; the server decides *whether that is true*.
3. **Every write proves its own precondition.** The endpoint reads the record
   that makes the write legitimate — in the same request, from the database, as
   the service role — and refuses if it is absent. It never trusts a prior
   endpoint to have checked.
4. **Fail closed.** An unknown state, a missing record, an unparseable body and
   an unavailable dependency all deny. There is no default-allow branch anywhere
   in this surface.

Shared helpers, server-only, in `src/server/`:

```ts
requireUser(request): Promise<User>            // throws 401
optionalUser(request): Promise<User | null>
rateLimit(key, limit, window): Promise<void>   // throws 429
serviceDb(): SupabaseClient                    // service role, this file only
```

---

## 1 · The surface

| endpoint | auth | writes | ships |
|---|---|---|---|
| `POST /api/newsletter` | anon | `subscribers` | exists (v2.x) |
| `POST /api/playground/progress` | session | `progress` | Phase 0 (shim) |
| `POST /api/playground/complete` | session | `playground_track_badges` | Phase 0 (shim) |
| `POST /api/challenge/score` | session or anon | `challenge_attempts`, `xp_events`, `user_badges` | Phase 2 |
| `POST /api/challenge/claim` | session | `challenge_attempts`, `xp_events` | Phase 2 |
| `POST /api/achievements/publish` | session | `achievement_verifications` | Phase 2 |
| `POST /api/achievements/unpublish` | session | `achievement_verifications` | Phase 2 |
| `GET /api/achievements/card/[id].png` | anon | — | Phase 2 |
| `POST /api/learning/progress` | session | `lesson_progress`, `enrollments`, `xp_events` | Phase 3 |
| `POST /api/checkout` | session | `stripe_customers` | Phase 3 |
| `POST /api/stripe/webhook` | signature | commerce tables, `entitlements` | Phase 3 |
| `GET /api/entitlements/status` | session | — | Phase 3 |
| `GET /api/download/[slug]` | session | issuance log | Phase 3 |
| `POST /api/account/profile` | session | `profiles` | Phase 2 |
| `POST /api/account/delete` | session | cascade | Phase 2 |

The two Phase 0 shims exist only to move the live v2.x Playground's writes from
the browser to the server without changing anything a visitor sees. They are
**deleted** when the rebuilt Playground ships in Phase 2. See migration 07.

---

## 2 · `POST /api/achievements/publish` — the endpoint v3.1 exists for

### What it accepts

```jsonc
{
  "subject_type": "badge" | "course" | "challenge",
  "subject_id":   "prompt-builder",       // badge key, course slug, challenge slug
  "show":         { "score": true, "level": false, "xp": false }
}
```

### What it refuses to accept, explicitly

`user_id` · `display_name` · `earned_at` · `title` · `score` · `level_key` ·
`total_xp` · `verification_id` · `verified` · `badge_name` · `tier` · anything
resembling a completion or ownership assertion.

These are not ignored — a request carrying any of them is rejected `400` rather
than silently stripped. A client sending `score: 100` has told you something
useful about itself, and the request should not half-succeed.

### What it does

```
1.  user = requireUser(request)                        → 401
2.  rateLimit(`publish:${user.id}`, 10, '1h')          → 429
3.  validate the body shape and subject_type           → 400
4.  PROVE OWNERSHIP, per kind, as the service role:

    badge      select 1 from user_badges
                 where user_id = user.id and badge_key = subject_id
               and the catalogue row exists and is_active
    course     select completed_at from enrollments
                 where user_id = user.id and course_slug = subject_id
                 and completed_at is not null
    challenge  select score, format, rubric_version, scored_by, created_at
                 from challenge_attempts
                 where user_id = user.id and challenge_slug = subject_id
                   and is_best
                   and scored_by <> 'self_assessed'     ← v3.1
               → not found = 403. Not 404: the caller is asking about
                 something real that is not theirs, and it should read
                 as a refusal, not as a typo.

5.  DERIVE THE SNAPSHOT server-side. Every field, from the proving record and
    the catalogue / git content. Nothing from the request:
      display_name  profiles.display_name, sanitised (§2.1)
      title         badge catalogue name / course title / challenge title
      earned_at     the proving record's timestamp
      score         the attempt's score — challenge only, and only if
                    scored_by <> 'self_assessed'
      level_key     xp_balances.level_key   — only if show.level
      total_xp      xp_balances.total_xp    — only if show.xp
      lang          profiles.lang
      visibility    the validated `show` object, intersected with what is
                    actually available (asking to show a score on a course
                    achievement sets it false, it does not error)
6.  id = gen_random_uuid()  — server-side, always
7.  insert into achievement_verifications ...
      on conflict (user_id, subject_type, subject_id) do update
        set revoked_at = null, revoked_reason = null,
            published_at = now(),
            display_name = excluded.display_name,
            title = excluded.title, score = excluded.score,
            level_key = excluded.level_key, total_xp = excluded.total_xp,
            visibility = excluded.visibility
      -- The id is NOT updated on conflict. Re-publishing restores the same
      -- URL, so a link posted before an un-publish comes back alive.
8.  return { id, url: `/achievements/${id}` }
```

**On the re-publish snapshot refresh.** The rule elsewhere is that the snapshot is
frozen so a later rename cannot rewrite a posted link. Re-publishing refreshes it
anyway, and that is deliberate: un-publishing and publishing again is a *new act
of consent*, made now, with the name the person has now. What the rule protects
against is a snapshot changing *without the user doing anything*, and this is the
opposite of that.

### 2.1 Display-name sanitisation

A public achievement page is a link surface, so it does not carry an open one.

- Unicode-normalised, control characters and bidi-override characters stripped.
- Trimmed, collapsed whitespace, capped at 48 characters.
- Rejected if it contains a URL, an `@`, or a bare domain-looking token.
- Rejected if it is empty after normalisation.
- **Never falls back to the email local part.** An account with no display name
  cannot publish; the endpoint returns `409` with `reason: "display_name_required"`
  and the UI sends the person to `/account/profile/`. Deriving a public name from
  an email address is a privacy leak that looks like a convenience.

### 2.2 `POST /api/achievements/unpublish`

```jsonc
{ "subject_type": "badge", "subject_id": "prompt-builder" }
```

```
1. user = requireUser(request)
2. update achievement_verifications
     set revoked_at = now(), revoked_reason = 'user'
     where user_id = user.id                      ← the session's id, always
       and subject_type = $1 and subject_id = $2
3. 200 whether or not a row matched. Whether a stranger has published a given
   achievement is not something this endpoint reveals.
```

Soft revoke, not delete. The public page 404s immediately — the `select` policy is
scoped `revoked_at is null` in the database, so it stops resolving even if a page
forgets to filter. `user_badges` is untouched: the badge stays earned.

### 2.3 Administrative revoke

Abuse happens: a display name that got through, a badge awarded by a bug. A
server-side script sets `revoked_at` and a `revoked_reason` other than `'user'`.
A verification revoked administratively **cannot be re-published by the user** —
the publish endpoint refuses when `revoked_reason is not null and revoked_reason
<> 'user'`. There is no UI for this and there will not be one.

### 2.4 What a hostile client can achieve

Stated as a test, and asserted in CI:

| attempt | result |
|---|---|
| insert directly into `achievement_verifications` with the anon key | denied — no insert policy, and the grant is revoked |
| publish a badge they do not hold | 403 at step 4 |
| publish a course they did not complete | 403 at step 4 |
| publish a Create challenge they self-scored 100 | 403 — `scored_by = 'self_assessed'` |
| publish with `display_name: "Adel Mohamed"` | 400 — the field is refused; the snapshot comes from their own profile |
| publish with `score: 100` on a real badge they hold | 400 — the field is refused |
| publish someone else's badge by passing their `user_id` | 400 — the field is refused; the session is the only source |
| guess a verification id | it is a v4 UUID and reveals only what is already public |
| un-publish someone else's achievement | no-op — the update is scoped to the session's `user_id` |
| re-publish after an administrative revoke | 403 |

---

## 3 · `POST /api/challenge/score`

The other endpoint that mints value.

```jsonc
{ "challenge_slug": "prompt-repair-01", "answer": <format-specific>, "anon_key": "..."? }
```

Refuses: `score`, `dimensions`, `xp`, `user_id`, `is_best`, `rubric_version`,
`duration_ms` supplied by the client (duration is measured server-side between an
issued challenge token and the submission).

```
1. user = optionalUser(request)         — anonymous play is allowed and scored
2. rateLimit — 30/h/user, 10/h/anon IP
3. load the challenge from the content collections (git) — 404 if absent
4. score it:
     choose | repair  → deterministic, from the challenge definition.
                        scored_by = 'deterministic'
     create           → NOT scored. The response returns the worked model answer
                        and the rubric; the learner self-assesses. The stored
                        score is their own figure and scored_by =
                        'self_assessed'. It earns completion XP and it is not
                        evidence of anything.
5. insert challenge_attempts (user_id or anon_key, never both meaningful)
6. recompute is_best for that (user, challenge)
7. if signed in: awardXP({ idempotencyKey: `challenge:${slug}:${outcome}` })
   then run the badge evaluator for the affected requirement types
8. return { score, dimensions, scored_by, xp_awarded, badges_unlocked, next }
```

**A minimum plausible duration** rejects scripted submission: a challenge token is
issued when the challenge is rendered and a submission arriving implausibly fast
against it is refused. This is a rate-limit measure, not a scoring one.

`POST /api/challenge/claim` moves anonymous attempts to the new account after
sign-up: it matches on `anon_key` within a short window, sets `user_id`, **clears
`anon_key`**, and awards the XP that was withheld. Idempotency keys make a
double-claim a no-op.

---

## 4 · Commerce endpoints — the v3.1 hardening

The v3 commerce design was already webhook-authoritative and that does not
change. Three things are stated explicitly here because "we all know that" is how
they get lost:

**`POST /api/checkout` accepts a `product_key` and nothing else about money.** No
amount, no currency, no `price_id`, no coupon amount, no quantity above 1. The
`stripe_price_id` is resolved server-side from the product's front matter. A
client-supplied price is a discount the customer wrote themselves.

**No endpoint reads `session_id` from a redirect to grant anything.** The success
page polls `GET /api/entitlements/status?subject_type=course&subject_id=<slug>`,
which resolves from the `entitlements` table. Until the webhook has been
received, verified and processed, the honest answer is "setting up your access",
and that is what the page says.

**The Stripe secret and webhook secret are Cloudflare secret bindings.** Not
`vars` in `wrangler.jsonc`, not `PUBLIC_`-prefixed, not present in any module
reachable from a client island. The CI check greps built client output for secret
*value* patterns (`sk_live`, `sk_test`, `whsec_`, service-role JWT shape) — it
does not grep for binding *names*, which legitimately appear in `_worker.js`.

---

## 5 · Error contract

| code | meaning | body |
|---|---|---|
| 400 | malformed, or carried a field the endpoint refuses | `{ error, refused_fields? }` |
| 401 | no valid session | `{ error }` |
| 403 | authenticated, and not entitled to assert this | `{ error }` |
| 404 | the subject does not exist | `{ error }` |
| 409 | a precondition the user can fix | `{ error, reason }` |
| 429 | rate limited | `{ error, retry_after }` |
| 500 | server fault; nothing was written | `{ error }` |

**No error message distinguishes "does not exist" from "not yours"** except where
the subject is already public. `403` on an achievement the caller does not own is
deliberate and safe: badge keys and course slugs are public information.

---

## 6 · Review gates for this surface

Each is a test, not a checklist item:

1. For every endpoint, a request carrying `user_id` is rejected `400`.
2. For every endpoint that mints value, a request carrying the value it mints
   (`score`, `xp`, `level_key`, `earned_at`, `verified`) is rejected `400`.
3. `achievement_verifications` insert with the anon key is denied by the database
   with RLS *and* by the grant, asserted separately.
4. Every row in §2.4 is a passing test before Phase 2 ships.
5. Publishing a self-assessed Create score returns 403.
6. Publishing with no display name returns 409, never a derived name.
7. The badge evaluator, given a `self_assessed` attempt at 100, awards no
   score-gated badge.
