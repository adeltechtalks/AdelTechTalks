-- =============================================================================
-- v3.1 · 02 · badge catalogue + awards  (renames the live `badges` table)
-- ROLLBACK: drop table public.user_badges;
--           drop table public.badges;
--           alter table public.playground_track_badges rename to badges;
--           (then re-apply the v2.x RLS policy "own badges")
-- RUNS WITH: 07_retire_legacy_gamification.sql, same deploy, immediately after.
-- =============================================================================
-- THE COLLISION, AND WHY IT IS RESOLVED BY RENAMING.
--
-- The live `badges` table means "badges this user earned", keyed
-- (user_id, track_slug). v3 needs `badges` to mean "the catalogue of badges that
-- exist". Working around the clash — `badge_defs`, `badge_catalogue` — leaves a
-- permanently confusing pair of names in a schema people will read for years.
--
-- So the live table is renamed to what it always meant, its rows are preserved
-- and re-policied, and it is backfilled into the new awards table. Doing this
-- now costs one migration. Doing it after Playground grows costs a rename under
-- live traffic.

alter table if exists public.badges rename to playground_track_badges;

-- The rename carries the policy but not its name's meaning; restate it.
--
-- TRANSITIONAL, and it does not survive this deploy. The live v2.x Playground
-- client is still writing this table at the moment the rename runs, so the write
-- policy is restated here and then REMOVED BY MIGRATION 07 in the same Phase 0
-- deploy, once the server-mediated write path is in place. Do not run 02 without
-- 07. A client-writable table that feeds `user_badges` is a route to a
-- self-issued public achievement — see 07 for the full chain.
alter table public.playground_track_badges enable row level security;
drop policy if exists "own badges" on public.playground_track_badges;
drop policy if exists "own track badges" on public.playground_track_badges;
create policy "own track badges" on public.playground_track_badges
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---- the catalogue ---------------------------------------------------------
-- Public read: a badge's existence, name and requirement are not secret, and
-- the public achievement page has to render them for an anonymous visitor.
create table if not exists public.badges (
  key         text        primary key,   -- 'prompt-architect' — stable, never reused
  name        text        not null,
  description text        not null,
  icon        text        not null,
  skill       text,                      -- null = general
  requirement jsonb       not null default '{}'::jsonb,
  tier        text        not null default 'bronze'
                check (tier in ('bronze','silver','gold')),
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now()
);

alter table public.badges enable row level security;
drop policy if exists "badges are public" on public.badges;
create policy "badges are public" on public.badges
  for select to anon, authenticated using (true);
-- No insert/update/delete policy: the catalogue is seeded server-side only.

-- ---- awards ----------------------------------------------------------------
create table if not exists public.user_badges (
  user_id     uuid        not null references auth.users (id) on delete cascade,
  badge_key   text        not null references public.badges (key),
  earned_at   timestamptz not null default now(),
  source_type text,                      -- 'challenge' | 'course' | 'xp' | 'grant'
  source_id   text,
  primary key (user_id, badge_key)
);

alter table public.user_badges enable row level security;
drop policy if exists "own badges read" on public.user_badges;
create policy "own badges read" on public.user_badges
  for select to authenticated using (auth.uid() = user_id);
-- Awards are written server-side only. A client that can insert here can award
-- itself any badge in the catalogue.

create index if not exists user_badges_user_idx on public.user_badges (user_id);

-- ---- backfill the legacy Playground track badges ---------------------------
-- One catalogue entry per track slug that anyone has actually earned, then the
-- awards themselves. Idempotent.
--
-- ONE-TIME, AND THE DATABASE ENFORCES THAT. After migration 07 records the
-- `legacy_playground_backfill` marker, both statements below become no-ops. This
-- is what severs the escalation route: from that point on, a row appearing in
-- `playground_track_badges` — however it got there — can never become a
-- `user_badges` award, and therefore can never become a publishable achievement.
create table if not exists public.schema_state (
  key         text        primary key,
  value       jsonb       not null default '{}'::jsonb,
  recorded_at timestamptz not null default now()
);
alter table public.schema_state enable row level security;
-- No policy at all: service role only.

insert into public.badges (key, name, description, icon, skill, requirement, tier)
select distinct
  'playground-' || b.track_slug,
  initcap(replace(b.track_slug, '-', ' ')),
  'Earned in the AdelTechTalks Playground.',
  'award',
  null,
  jsonb_build_object('type', 'playground_track', 'track', b.track_slug),
  'bronze'
from public.playground_track_badges b
where not exists (select 1 from public.schema_state
                  where key = 'legacy_playground_backfill')
on conflict (key) do nothing;

insert into public.user_badges (user_id, badge_key, earned_at, source_type, source_id)
select b.user_id, 'playground-' || b.track_slug, b.earned_at, 'playground', b.track_slug
from public.playground_track_badges b
where not exists (select 1 from public.schema_state
                  where key = 'legacy_playground_backfill')
on conflict (user_id, badge_key) do nothing;
