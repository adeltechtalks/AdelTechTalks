-- =============================================================================
-- v3.1 · 03 · public achievement verification  (turns `shares` into a view)
-- ROLLBACK: drop view public.shares;
--           create table public.shares as select id, user_id,
--             regexp_replace(subject_id,'^playground-','') as track_slug,
--             title as display_name, earned_at
--             from public.achievement_verifications where subject_type='badge';
--           (re-apply the v2.x policies, then drop achievement_verifications)
-- =============================================================================
-- REVISED IN v3.1. The v3 draft of this file carried a security defect and it is
-- corrected here. The defect, stated plainly so it is not reintroduced:
--
--     v3 granted `authenticated` a direct INSERT on this table, checked only
--     with `auth.uid() = user_id`. That check proves the row is about you. It
--     proves NOTHING about whether you earned the thing the row claims. Any
--     signed-in person could insert a row naming any badge in the catalogue and
--     immediately hold a public, crawlable, OG-carded page asserting they earned
--     it. A verification anyone can self-issue is not a verification.
--
-- v3.1: this table has NO insert, update or delete policy for any client role.
-- Every write is made by the service role from `POST /api/achievements/publish`
-- and `POST /api/achievements/unpublish`, which prove ownership against
-- `user_badges` / `enrollments` / `challenge_attempts` before writing anything.
-- See V3_API_SURFACE.md §2 and V3_SECURITY_MODEL.md §5.1.
--
-- Also revised in v3.1: the row is generalised from "a badge" to "an
-- achievement", so Challenge, Course and (Phase 4) Build achievements share one
-- verification and sharing infrastructure instead of growing three of them.
--
-- READ THE MIGRATION SEQUENCE CAREFULLY. `/badge/[id]` is server-rendered and
-- those links are posted on LinkedIn. They cannot 404, and they cannot start
-- rendering a different person's name.
--
-- SEQUENCE (do not reorder):
--   1. create the new table
--   2. copy every row
--   3. verify the counts match          ← stop here if they do not
--   4. drop the table and create the view, in ONE transaction
--   5. verify /badge/<a known live id> still renders in production

create table if not exists public.achievement_verifications (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users (id) on delete cascade,

  -- WHAT was achieved. One infrastructure, three kinds at foundation.
  --   'badge'     → subject_id is a badges.key; ownership proven by user_badges
  --   'course'    → subject_id is a course git slug; proven by enrollments
  --   'challenge' → subject_id is a challenge git slug; proven by a
  --                 challenge_attempts row carrying a SERVER-COMPUTED score
  -- Build achievements (Phase 4) are badges with user_badges.source_type='build'
  -- awarded on a verified build submission. They are deliberately NOT a fourth
  -- subject_type: a fourth kind with no table behind it is a kind whose
  -- ownership check would have to be invented at the call site.
  subject_type text        not null
                 check (subject_type in ('badge','course','challenge')),
  subject_id   text        not null,

  -- Kept as a real FK for badge achievements so a verification can never name a
  -- badge the catalogue does not define. NULL for course and challenge kinds.
  badge_key    text        references public.badges (key),

  -- ---- the public snapshot ------------------------------------------------
  -- Every field below is derived SERVER-SIDE at publish time from the record
  -- that proves ownership. None of it is ever accepted from a request body.
  -- Frozen so a later rename, a content edit or a rubric change cannot rewrite
  -- what an already-posted link claims.
  display_name text        not null,
  title        text        not null,   -- badge name, course title, challenge title
  earned_at    timestamptz not null,   -- from the proving record, not from `now()`
  score        integer     check (score is null or score between 0 and 100),
  level_key    text,
  total_xp     integer,
  lang         text        not null default 'en',

  -- What the user consented to show. The publish endpoint writes this; the page
  -- and the share card render only what is true here.
  --   { "score": true, "level": false, "xp": false }
  visibility   jsonb       not null default '{}'::jsonb,

  published_at  timestamptz not null default now(),
  revoked_at    timestamptz,
  revoked_reason text,
  created_at    timestamptz not null default now(),

  -- One verification per achievement per person. Un-publishing SOFT-revokes
  -- rather than deleting, so re-publishing restores the SAME id and every link
  -- already posted comes back alive instead of 404ing forever.
  unique (user_id, subject_type, subject_id),

  -- A score belongs to a challenge and nothing else.
  constraint score_only_on_challenges
    check (score is null or subject_type = 'challenge'),
  -- A badge_key belongs to a badge achievement and nothing else.
  constraint badge_key_matches_subject
    check ((subject_type = 'badge') = (badge_key is not null))
);

create index if not exists achievement_verifications_user_idx
  on public.achievement_verifications (user_id);

alter table public.achievement_verifications enable row level security;

-- ---- the ONLY policy on this table ------------------------------------------
-- ANYONE may read a non-revoked verification. This is the entire point of the
-- table: the link has to work for a stranger and for LinkedIn's crawler. The row
-- holds an achievement, a name and a date — no email, no progress, no attempts.
--
-- The `revoked_at is null` scope lives HERE, in the policy, and not in
-- application code, so un-publishing works even if a page forgets to filter.
drop policy if exists "verifications are public" on public.achievement_verifications;
create policy "verifications are public" on public.achievement_verifications
  for select to anon, authenticated using (revoked_at is null);

-- ---- policies deliberately ABSENT -------------------------------------------
-- No insert. No update. No delete. Not for `anon`, not for `authenticated`,
-- not for the owner.
--
-- These two policies existed in the v3 draft and are dropped here so that
-- re-running the migration set over a database that already applied the draft
-- removes them rather than leaving them behind:
drop policy if exists "own verification insert" on public.achievement_verifications;
drop policy if exists "own verification delete" on public.achievement_verifications;
drop policy if exists "own verification update" on public.achievement_verifications;

-- Belt and braces: even if a future migration adds a policy by accident, the
-- table grants say no.
revoke insert, update, delete on public.achievement_verifications from anon, authenticated;

-- The read grant is stated EXPLICITLY rather than inherited.
--
-- Supabase's default privileges grant every role full access to new tables in
-- `public`, which is why RLS is the protection here and why the revoke above is
-- needed at all. That default would also supply the SELECT this table needs —
-- but relying on it would make a public, server-rendered page that LinkedIn
-- crawls depend on a platform default nobody states. If those defaults are ever
-- tightened, /badge/<id> goes blank and nothing in this file explains why.
--
-- The policy above decides WHICH rows are visible (revoked_at is null). This
-- grant decides that the roles may read the table at all. Both are required:
-- with `security_invoker = true`, the `shares` compatibility view created in
-- step 4 executes as the caller, so `anon` needs this grant on the BASE table,
-- not merely on the view.
grant select on public.achievement_verifications to anon, authenticated;

-- ---- step 2: carry every existing share across, id and all ------------------
-- The id is preserved so every posted /badge/<id> URL resolves to the same row.
-- Runs as the migration author (service role), which is why it is unaffected by
-- the absence of an insert policy.
insert into public.achievement_verifications
  (id, user_id, subject_type, subject_id, badge_key,
   display_name, title, earned_at, lang, visibility, published_at, created_at)
select s.id,
       s.user_id,
       'badge',
       'playground-' || s.track_slug,
       'playground-' || s.track_slug,
       s.display_name,
       b.name,
       s.earned_at,
       'en',
       '{}'::jsonb,
       s.earned_at,
       s.earned_at
from public.shares s
join public.badges b on b.key = 'playground-' || s.track_slug
on conflict (id) do nothing;

-- ---- step 3: verify before step 4 -------------------------------------------
-- Run this by hand. It must return 0. If it does not, STOP: a share exists whose
-- track has no catalogue entry, and migration 02's backfill missed it.
--
--   select count(*) from public.shares s
--   where not exists (select 1 from public.achievement_verifications v
--                     where v.id = s.id);

-- ---- step 4: the swap, in one transaction -----------------------------------
-- Uncomment and run only after step 3 returns 0.
--
-- begin;
--   drop table public.shares;
--   create view public.shares
--     with (security_invoker = true)
--     as select v.id,
--               v.user_id,
--               -- reverse the 'playground-' prefix so the column reads exactly
--               -- as the live page expects
--               regexp_replace(v.subject_id, '^playground-', '') as track_slug,
--               v.display_name,
--               v.earned_at
--        from public.achievement_verifications v
--        where v.subject_type = 'badge'
--          and v.subject_id like 'playground-%'
--          and v.revoked_at is null;
--   grant select on public.shares to anon, authenticated;
--   -- The v2.x client wrote to `shares` directly. A view is not writable and
--   -- must not be made writable: publishing goes through the API from here on.
--   revoke insert, update, delete on public.shares from anon, authenticated;
-- commit;
