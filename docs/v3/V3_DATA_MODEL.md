# V3_DATA_MODEL

**Status:** proposal. No migration in this document has been applied. SQL drafts live in `supabase/v3/`.

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

### `shares` → `achievement_verifications`

`shares` is already the right design — a deliberately public projection carrying only what belongs on a public page, beside a private table it never exposes. v3 generalises it: any achievement, not only a Playground track.

`shares` is **kept as a view** over the new table so `/badge/[id]` keeps resolving. Those links are on LinkedIn; they cannot 404.

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
  duration_ms int
  is_best boolean not null default false
  created_at timestamptz

  index (user_id, challenge_slug)
  index (challenge_slug, created_at desc)
```

Anonymous attempts are allowed and scored — that is the homepage conversion mechanic. They carry no `user_id` and no PII. On sign-up, attempts matching the browser's `anon_key` within a short window are claimed. `anon_key` is deleted at claim time.

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

achievement_verifications               -- the public projection.
  id uuid PK default gen_random_uuid()  -- the verification id in the URL
  user_id uuid not null
  badge_key text not null → badges(key)
  display_name text not null            -- frozen at share time
  earned_at timestamptz not null
  level_key text null                   -- snapshot, if shown
  total_xp int null                     -- snapshot, if shown
  revoked_at timestamptz null
  created_at timestamptz
  unique (user_id, badge_key)
```

`achievement_verifications` is public-select and contains **only** what belongs on a public page: a badge, a display name, a date, and optional snapshots. No email, no progress detail, no attempt payloads. A row exists only when the user chose to share; deleting it un-publishes the page while `user_badges` keeps the earned badge. This is `shares`, generalised — including its reasoning.

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

Six migrations. Every one is additive or a rename with a compatibility view. **No migration drops a table or a column that holds live rows.** Each has a stated rollback and each is safe to run twice.

| # | file | does | rollback |
|---|---|---|---|
| 1 | `01_profiles.sql` | `profiles` + trigger on `auth.users`; backfill existing users | drop table + trigger |
| 2 | `02_badges_rename.sql` | `badges` → `playground_track_badges`, RLS re-applied; new `badges` catalogue; `user_badges`; backfill legacy rows | reverse rename |
| 3 | `03_achievements.sql` | `achievement_verifications`; copy `shares` rows; **`shares` becomes a view** over it | restore `shares` as a table from the view |
| 4 | `04_xp.sql` | `xp_events`, `xp_balances`, `skill_progress`; rebuild function | drop all three |
| 5 | `05_learning.sql` | `saved_prompts`, `enrollments`, `lesson_progress`, `challenge_attempts` | drop |
| 6 | `06_commerce.sql` | `stripe_customers`, `purchases`, `subscriptions`, `stripe_events`, `entitlements`, `workshops`, `workshop_registrations` | drop |

Migrations 1–5 ship with the v3 foundation. Migration 6 ships with Phase 3 and is written now only so the entitlement resolver has a stable shape to compile against.

**The `shares` → view step is the one to review hardest.** `/badge/[id]` is server-rendered and live on LinkedIn. Sequence: create the new table → copy rows → verify counts match → drop the table and create the view in one transaction → verify `/badge/[id]` still resolves for a known id in production. If the view cannot reproduce the exact column set the current page reads, the migration does not proceed.

---

## 4 · Two decisions worth challenging

**Challenge definitions live in git, attempts live in Postgres.** A challenge is authored content — question, options, scoring rubric — and belongs with the rest of the editorial content. Storing challenges in Postgres would mean editing them through an admin UI that does not exist, with no review and no version history. The cost is that changing a rubric changes the meaning of past scores; mitigated by versioning the rubric in front matter and stamping `rubric_version` onto each attempt.

**Anonymous attempts are stored at all.** They could be kept purely client-side. They are stored because "you scored 84 — sign up to keep it" is the conversion moment, and it cannot work if the score evaporates on navigation. The privacy cost is one opaque random key per browser, no PII, deleted at claim, and expired by a scheduled job after 30 days.
