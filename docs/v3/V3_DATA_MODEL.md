# V3_DATA_MODEL

> **Scope mapping.** GitHub **PR #8** delivers **Implementation Master Plan PR 5**
> scope — the v3 database foundation and migrations. Earlier in the sequence a
> numbering drift crept in (this work was called "PR 3" for several turns).
> Historical numbering is **not** repaired. From here on, implementation is
> tracked **by scope first and GitHub PR number second**; where the two disagree,
> the scope name is authoritative.

**Status:** proposal. **Revised in v3.1** — §2.2, §2.3, §2.5, §3 and the new §5.
No migration in this document has been applied. SQL drafts live in `supabase/v3/`.

**Two stores, one boundary, unchanged from v2.x:**
- **Editorial content is files in git** — Astro content collections. Courses, lessons, prompts, projects, resources, challenges and What's New items are authored as Markdown, versioned, reviewable in a PR, and free to serve from the CDN.
- **Supabase Postgres holds user data only** — who someone is, what they did, what they earned, what they bought.

Anything that is the same for every visitor belongs in git. Anything that differs per person belongs in Postgres. The one deliberate exception is `challenges`, discussed in §4.

---

## 1 · What exists today

| table | shape | RLS |
|---|---|---|
| `progress` | `(user_id, track_slug, step_index, created_at)` PK on the triple | own rows, `for all to authenticated` |
| `badges` | `(user_id, track_slug, earned_at)` PK on the pair | own rows |
| `shares` | `(id uuid PK, user_id, track_slug, display_name, earned_at)` unique `(user_id, track_slug)` | **public select**, owner insert/delete |
| `subscribers` | `(id, email, lang, source, platform, campaign, guide, placement, landing_path, consented_at, unsubscribed_at, created_at)` unique on `lower(email)` | anon insert only |

All four are live and hold real rows. **None of them is dropped.**

### The one genuine collision

v3 needs a `badges` table meaning *"the catalogue of badges that exist"*. The name is taken by a table meaning *"badges this user earned"*.

Resolved by renaming rather than by working around it:

```
badges          →  playground_track_badges     (existing rows preserved, RLS re-applied)
(new) badges    →  badge catalogue, public read
(new) user_badges  →  awards, own rows
```

`playground_track_badges` is then backfilled into `user_badges` and becomes read-only legacy. Doing this at the *start* of v3 costs one migration; doing it later costs a rename under live traffic.

**v3.1 adds the part the v3 draft left out: when the legacy table stops being
writable, and when it stops existing in `public`.** "Becomes read-only legacy" was
a description of intent with no migration behind it, and the table it described
was still `for all to authenticated`. Migration 07 gives it a three-stage,
verifiable schedule with a terminal state. §5 below.

### `shares` → `achievement_verifications`

`shares` is already the right design — a deliberately public projection carrying only what belongs on a public page, beside a private table it never exposes. v3 generalises it: any achievement, not only a Playground track.

`shares` is **kept as a view** over the new table so `/badge/[id]` keeps resolving. Those links are on LinkedIn; they cannot 404.

**v3.1 also stops generalising the wrong half of it.** `shares` in v2.x was
client-written, and the v3 draft carried that across. It was acceptable in v2.x
because a Playground track badge asserted almost nothing; it is not acceptable
once a badge means "scored ≥90 on a server-graded challenge". The projection
shape is generalised; the write path is not. See §2.5 and `V3_SECURITY_MODEL.md`
§5.1.

---

## 2 · Proposed schema

Conventions: `uuid` primary keys with `gen_random_uuid()`; `timestamptz` everywhere; `text` over `varchar`; content is referenced by its **git slug**, never by a foreign key into a table that does not exist; every table carries `created_at`; every user-owned table carries `user_id uuid references auth.users(id) on delete cascade`.

### 2.1 Identity

```sql
profiles
  user_id uuid PK → auth.users(id) on delete cascade
  display_name text            -- shown on public achievement pages
  handle citext unique         -- optional, reserved for future public profiles
  avatar_url text
  lang text not null default 'en'
  bio text
  is_public boolean not null default false
  created_at, updated_at timestamptz
```

One row per account, created by a trigger on `auth.users` insert. `display_name` is the **only** field that can reach a public page, and it is copied onto the verification row at share time so a later rename cannot silently alter an already-posted link — the rule `shares` established in v2.x.

`subscribers` stays exactly as it is, **unlinked**. Newsletter consent is not account state. A person may be one, the other, or both; joining them by `user_id` would make "delete my account" ambiguous about the mailing list.

### 2.2 Content-adjacent user state

```sql
saved_prompts     user_id, prompt_slug, note text, created_at   PK (user_id, prompt_slug)
resource_grants   -- see entitlements; not a separate table
lesson_progress   user_id, course_slug, lesson_slug,
                  status enum('started','completed'), progress_pct int,
                  last_position int, started_at, completed_at, updated_at
                  PK (user_id, course_slug, lesson_slug)
enrollments       user_id, course_slug, source enum('free','purchase','grant'),
                  enrolled_at, completed_at, PK (user_id, course_slug)
```

**v3.1: `lesson_progress` and `enrollments` are read-only to the client.** Both
were `for all` in the v3 draft. Lesson completion drives `enrollments.completed_at`,
which the publish endpoint accepts as proof of a course achievement — so a
client-writable `lesson_progress` is a route to a public "completed this course"
page for a course nobody took. `saved_prompts` stays client-writable because a
bookmark confers nothing.

`*_slug` columns reference git content. No foreign key, by design: content moves, is renamed, and is deleted by editorial action, and a database constraint must not be able to block a content edit. Integrity is enforced at **build time** instead — a QA check fails the build if a slug referenced by live user rows no longer exists in the collections. That is the correct place for it, because it is a content problem, not a data-integrity problem.

### 2.3 Playground and challenges

```sql
challenge_attempts
  id uuid PK
  user_id uuid null                     -- NULL = anonymous attempt
  anon_key text null                    -- opaque client key, no PII
  challenge_slug text not null
  experience_slug text not null
  format enum('choose','repair','create')
  score int not null                    -- 0..100
  dimensions jsonb not null default '{}' -- {clarity:18, context:20, ...}
  payload jsonb                         -- the submission, for Create
  rubric_version text
  scored_by enum('deterministic','self_assessed','model_assisted')  -- v3.1
  duration_ms int
  is_best boolean not null default false
  created_at timestamptz

  index (user_id, challenge_slug)
  index (challenge_slug, created_at desc)
```

Anonymous attempts are allowed and scored — that is the homepage conversion mechanic. They carry no `user_id` and no PII. On sign-up, attempts matching the browser's `anon_key` within a short window are claimed. `anon_key` is deleted at claim time.

**`scored_by` is new in v3.1 and it is load-bearing.** Choose and Repair are
graded by the server from the challenge definition. Create, at foundation, is
*self-assessed* against a worked model answer — genuinely valuable to do, and not
evidence of anything. Without this column the two are indistinguishable in the
table, and "score ≥90 on a Create challenge" becomes a badge you award yourself.
The publish endpoint and the badge evaluator both refuse `self_assessed` scores.

`dimensions` is `jsonb` rather than five columns because the scoring dimensions differ per track: prompting scores clarity/context/constraints/specificity/structure/usefulness; a Vibe Coding challenge will not. A rigid column set here would have to be migrated for every new track.

### 2.4 XP — event-sourced

The requirement is explicit and correct: **XP must be auditable; do not store only mutable totals with no history.**

```sql
xp_events                              -- append-only. The ledger.
  id uuid PK
  user_id uuid not null
  amount int not null                  -- may be negative (revocation)
  reason text not null                 -- 'lesson.completed', 'challenge.perfect'
  skill text null                      -- 'prompting' | 'coding' | ... | NULL = general
  subject_type text                    -- 'lesson' | 'challenge' | 'course' | 'project'
  subject_id text                      -- the git slug
  idempotency_key text not null        -- unique per user
  metadata jsonb not null default '{}'
  created_at timestamptz

  unique (user_id, idempotency_key)
  index (user_id, created_at desc)

xp_balances                            -- derived. Rebuildable from xp_events.
  user_id uuid PK
  total_xp int not null default 0
  level_key text not null default 'explorer'
  updated_at timestamptz

skill_progress                         -- derived, per track.
  user_id, skill text, xp int not null default 0, updated_at
  PK (user_id, skill)
```

Two rules make this trustworthy:

1. **`xp_balances` and `skill_progress` are caches, never sources.** A single SQL statement rebuilds both from `xp_events`. That statement is committed as `supabase/v3/rebuild_xp.sql` and is run in CI against a restored snapshot, so "the ledger and the cache agree" is a test, not a hope.
2. **`idempotency_key` is what makes XP correct.** Every award passes a deterministic key — `lesson:build-a-site/02:completed`. Finishing the same lesson twice awards once. A retried webhook awards once. A double-clicked button awards once. Without this, event sourcing just produces an auditable record of the wrong number.

Levels are **not** hard-coded. `xp_balances.level_key` holds a key; thresholds and display names live in config (`V3_GAMIFICATION.md` §2). Renaming "Maker" is a config edit, not a migration.

### 2.5 Badges and public achievements

```sql
badges                                  -- catalogue. Public read.
  key text PK                           -- 'prompt-architect' — stable, never reused
  name text not null
  description text not null
  icon text not null
  skill text null
  requirement jsonb not null            -- machine-readable rule
  tier enum('bronze','silver','gold') default 'bronze'
  is_active boolean not null default true
  created_at

user_badges                             -- awards. Own rows.
  user_id, badge_key, earned_at, source_type, source_id
  PK (user_id, badge_key)

achievement_verifications               -- the public projection. REVISED in v3.1.
  id uuid PK default gen_random_uuid()  -- the verification id in the URL
  user_id uuid not null

  subject_type enum('badge','course','challenge')   -- v3.1
  subject_id   text not null            -- badge key | course slug | challenge slug
  badge_key    text null → badges(key)  -- badge kind only; a real FK

  display_name text not null            -- snapshot, sanitised server-side
  title        text not null            -- snapshot: badge name / course / challenge
  earned_at    timestamptz not null     -- from the proving record, not now()
  score        int null                 -- challenge kind only, never self-assessed
  level_key    text null                -- snapshot, only if consented
  total_xp     int null                 -- snapshot, only if consented
  lang         text not null default 'en'
  visibility   jsonb not null default '{}'   -- { score, level, xp }

  published_at   timestamptz not null
  revoked_at     timestamptz null
  revoked_reason text null
  created_at     timestamptz
  unique (user_id, subject_type, subject_id)
```

**Two changes in v3.1, and the first is a security fix.**

**1 · No client may write this table.** The v3 draft gave `authenticated` an
insert policy checked only with `auth.uid() = user_id`. That proves the row is
about you; it proves nothing about whether you earned what it claims. Anyone
signed in could mint a public, crawlable, branded page asserting any badge in the
catalogue. There is now no insert, update or delete policy for any client role,
and the grants are revoked too. Writes come from `POST /api/achievements/publish`,
which proves ownership against `user_badges`, `enrollments` or
`challenge_attempts` first. Full contract in `V3_API_SURFACE.md` §2; the reasoning
about how it got past review in `V3_SECURITY_MODEL.md` §5.1.

**2 · One infrastructure, three kinds.** The row was keyed to a badge. Course
completions and challenge scores are equally worth sharing and equally in need of
verification, and giving each its own table would give each its own page, its own
card generator and its own chance to get the ownership check wrong. `subject_type`
generalises the row; the public page is one route with a per-kind renderer. Build
achievements (Phase 4) are deliberately *not* a fourth kind — they are badges with
`user_badges.source_type = 'build'`, so they inherit an ownership check that
already exists instead of inventing one at the call site.

Everything else about the row is unchanged in spirit: public-select, containing
**only** what belongs on a public page — an achievement, a display name, a date,
and snapshots the user explicitly consented to. No email, no progress detail, no
attempt payloads, nothing about anyone else.

**Un-publishing is a soft revoke, not a delete** (v3.1). The v3 draft deleted the
row, which meant re-sharing minted a new id and permanently orphaned every link
already posted. `revoked_at` keeps the id; the public `select` policy is scoped
`revoked_at is null`, so the page 404s immediately and comes back at the same URL
if the person publishes again. `user_badges` is untouched either way: the badge
stays earned.

`requirement` as `jsonb` keeps the rule with the badge instead of scattering it through application code:
```json
{ "type": "challenge_score", "challenge": "prompt-repair-01", "min": 90 }
{ "type": "xp_threshold", "skill": "prompting", "min": 500 }
{ "type": "course_completed", "course": "launch-a-website-with-ai" }
```

### 2.6 Commerce

```sql
stripe_customers   user_id PK, stripe_customer_id text unique, created_at
purchases          id, user_id, stripe_checkout_session_id unique,
                   stripe_payment_intent_id, product_key, kind enum('course','workshop','pack'),
                   amount_cents, currency, status enum('pending','paid','refunded','failed'),
                   purchased_at, refunded_at, raw jsonb
subscriptions      id, user_id, stripe_subscription_id unique, price_id,
                   status, current_period_end, cancel_at_period_end, raw jsonb
stripe_events      id text PK (Stripe event id), type, received_at, processed_at, payload jsonb
```

`stripe_events` is the webhook idempotency ledger: every event is inserted before it is acted on, and a duplicate delivery is a primary-key conflict rather than a second entitlement. Details in `V3_COMMERCE_AND_ENTITLEMENTS.md`.

### 2.7 Entitlements — one table, one resolver

```sql
entitlements
  id uuid PK
  user_id uuid not null
  subject_type text not null   -- 'course'|'lesson'|'resource'|'prompt_pack'
                               -- |'download'|'workshop'|'playground'|'tool'
  subject_id text not null     -- git slug, or '*' for a whole class
  source enum('free','membership','purchase','subscription','workshop','grant')
  source_ref text null         -- purchase id, subscription id, admin note
  granted_at timestamptz not null default now()
  expires_at timestamptz null
  revoked_at timestamptz null

  unique (user_id, subject_type, subject_id, source)
  index (user_id, subject_type)
```

Every access route — free, membership, purchase, subscription, workshop, admin grant — writes a row here. **Nothing else in the codebase asks "did this person buy X?"** It asks the resolver. That is the entire point: purchase logic embedded in components is how a paywall develops holes.

### 2.8 Workshops

```sql
workshops               slug PK, title, starts_at, duration_min, capacity,
                        price_cents, recording_asset text null, status
workshop_registrations  id, user_id, workshop_slug, purchase_id null,
                        registered_at, attended_at null
                        unique (user_id, workshop_slug)
```

---

## 3 · Migration plan

Seven migrations (v3.1 adds 07). Every one is additive or a rename with a compatibility view. **No migration drops a table or a column that holds live rows.** Each has a stated rollback and each is safe to run twice.

| # | file | does | rollback |
|---|---|---|---|
| 1 | `01_profiles.sql` | `profiles` + trigger on `auth.users`; backfill existing users | drop table + trigger |
| 2 | `02_badges_rename.sql` | `badges` → `playground_track_badges`, RLS re-applied; new `badges` catalogue; `user_badges`; **one-time** backfill of legacy rows | reverse rename |
| 3 | `03_achievements.sql` | `achievement_verifications` (**no client writes**, three subject kinds); copy `shares` rows; **`shares` becomes a view** over it | restore `shares` as a table from the view |
| 4 | `04_xp.sql` | `xp_events`, `xp_balances`, `skill_progress`; rebuild function | drop all three |
| 5 | `05_learning.sql` | `saved_prompts`, `enrollments`, `lesson_progress`, `challenge_attempts` (+ `scored_by`) | drop |
| 6 | `06_commerce.sql` | `stripe_customers`, `purchases`, `subscriptions`, `stripe_events`, `entitlements`, `workshops`, `workshop_registrations` | drop |
| **7** | **`07_retire_legacy_gamification.sql`** | **revokes client writes on `playground_track_badges` and `progress`; seals the 02 backfill; schedules stages 2 and 3** | re-create the two `for all` policies (stage 1 only) |

Migrations 1–5 and 7 ship with the v3 foundation. Migration 6 ships with Phase 3 and is written now only so the entitlement resolver has a stable shape to compile against.

**02 and 07 ship in the same deploy, in that order, and 07 is not optional.** 02
restates a write policy on the renamed legacy table because the live v2.x
Playground is still writing it at that moment; 07 removes it once the
server-mediated write path is in place. Running 02 alone leaves the escalation
route described in §5 wide open.

**The `shares` → view step is still the one to review hardest.** `/badge/[id]` is server-rendered and live on LinkedIn. Sequence: create the new table → copy rows → verify counts match → drop the table and create the view in one transaction → verify `/badge/[id]` still resolves for a known id in production. If the view cannot reproduce the exact column set the current page reads, the migration does not proceed.

---

## 4 · Two decisions worth challenging

**Challenge definitions live in git, attempts live in Postgres.** A challenge is authored content — question, options, scoring rubric — and belongs with the rest of the editorial content. Storing challenges in Postgres would mean editing them through an admin UI that does not exist, with no review and no version history. The cost is that changing a rubric changes the meaning of past scores; mitigated by versioning the rubric in front matter and stamping `rubric_version` onto each attempt.

**Anonymous attempts are stored at all.** They could be kept purely client-side. They are stored because "you scored 84 — sign up to keep it" is the conversion moment, and it cannot work if the score evaporates on navigation. The privacy cost is one opaque random key per browser, no PII, deleted at claim, and expired by a scheduled job after 30 days.

---

## 5 · Retiring the legacy gamification path *(new in v3.1)*

The v3 draft said `playground_track_badges` "becomes read-only legacy" and left
it `for all to authenticated`. That is not a retirement, it is a hope, and the
table it applied to sits on a live chain:

```
playground_track_badges   ← any authenticated client can insert
        │  migration 02 backfill
        ▼
   user_badges            ← what the publish endpoint accepts as proof
        │  POST /api/achievements/publish
        ▼
achievement_verifications ← public, crawlable, branded, "verified"
```

Every link in that chain was in the v3 set. Nothing in the v3 set broke it.

### The schedule

| stage | when | what changes | how it is verified |
|---|---|---|---|
| **1** | Phase 0, with migration 02 | `playground_track_badges` and `progress` become `select`-only; grants revoked; the 02 backfill is sealed by a `schema_state` marker so it can never re-run | the policy audit in `V3_SECURITY_MODEL.md` §9 lists neither table |
| **2** | Phase 2, with the Playground rebuild | the two Phase 0 shim endpoints are deleted; the tables stop being written by anything; comments mark them legacy history | `grep` finds no code reference; `schema_state.legacy_playground_frozen` is stamped |
| **3** | Phase 4, ≥90 days after stage 2 | both tables move to an `archive` schema, out of `public` | three queries, in migration 07, that must each return 0 before the move |

### The precondition that costs something

Stage 1 breaks the live v2.x Playground unless the server-mediated write path
ships in the same deploy. So Phase 0 is no longer "nothing user-visible ships":
it ships two shim endpoints, `POST /api/playground/progress` and
`/api/playground/complete`, which perform exactly the writes the browser client
performs today, from the server, with the user derived from the verified session.
Nothing moves on screen. The authority moves. That is a real, if small, amendment
to the v3 phase plan and it is recorded in `V3_IMPLEMENTATION_PLAN.md` §4.

### Why archived, not dropped

`playground_track_badges` is the provenance of every backfilled `user_badges`
row, and those rows can become public verified achievements. A verified
achievement whose origin has been deleted is a verified achievement nobody can
audit. It moves out of `public`; it does not disappear. A drop becomes reasonable
only after the archive schema is in a retained dump, and that is a separate dated
decision.
