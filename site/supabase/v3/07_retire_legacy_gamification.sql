-- =============================================================================
-- v3.1 · 07 · retire the client-writable legacy gamification path
-- ROLLBACK (stage 1 only): re-create the "own track badges" / "own progress"
--           `for all` policies. Stages 2 and 3 are not rolled back; they are
--           only run once their preconditions have been verified.
-- =============================================================================
-- NEW IN v3.1. The v3 set renamed the live `badges` table to
-- `playground_track_badges`, re-applied its own-row `for all` policy, backfilled
-- it into `user_badges`, and then said nothing further about it. That leaves an
-- indefinite client-writable legacy gamification path, and it is not a cosmetic
-- untidiness — it is a privilege-escalation route into the verified achievement
-- system:
--
--     playground_track_badges  is writable by any authenticated client
--        → migration 02 backfills it into  user_badges
--        → user_badges is what  POST /api/achievements/publish  accepts as
--          proof of ownership
--        → therefore a self-inserted legacy row could become a public,
--          crawlable, verified achievement.
--
-- The escalation only closes when the legacy table stops being client-writable
-- AND stops feeding user_badges. This migration does both, on a dated schedule
-- with a defined terminal state. There is no "we will get to it" step.
--
-- The same reasoning applies to `progress`, which is also `for all to
-- authenticated` today. It confers no badge, so it is a smaller problem, but a
-- client-writable table that the Playground reads back is still a table where a
-- client decides what it completed.

-- =============================================================================
-- STAGE 1 — Phase 0, same deploy as migrations 01–06.
-- Writes move from the client to the server. Behaviour is identical.
-- =============================================================================
-- PRECONDITION, and it is a real one: this stage BREAKS the live v2.x Playground
-- unless the server-mediated write path ships in the SAME deploy. The v2.x
-- Playground client writes `progress` and `badges` directly through the browser
-- Supabase client (`src/lib/playground.ts`). Stage 1 must land together with
-- `POST /api/playground/progress` and `POST /api/playground/complete`, which
-- perform exactly the same two writes with the same effects, from the server,
-- with the user derived from the verified session.
--
-- This amends the v3 plan's claim that Phase 0 ships "nothing user-visible".
-- Phase 0 now ships one behaviour-identical change: the Playground's writes go
-- through the server. Nothing moves on screen; the authority moves.

alter table public.playground_track_badges enable row level security;
drop policy if exists "own badges"          on public.playground_track_badges;
drop policy if exists "own track badges"    on public.playground_track_badges;
create policy "own track badges read" on public.playground_track_badges
  for select to authenticated using (auth.uid() = user_id);
revoke insert, update, delete on public.playground_track_badges from anon, authenticated;

alter table public.progress enable row level security;
drop policy if exists "own progress" on public.progress;
create policy "own progress read" on public.progress
  for select to authenticated using (auth.uid() = user_id);
revoke insert, update, delete on public.progress from anon, authenticated;

-- Sever the escalation route at the same moment. Migration 02's backfill is a
-- one-time operation; this marker makes that a fact the database enforces rather
-- than a fact the runbook asserts. `user_badges` is never again populated from
-- the legacy table, so a legacy row — however it got there — cannot become a
-- publishable achievement.
create table if not exists public.schema_state (
  key         text        primary key,
  value       jsonb       not null default '{}'::jsonb,
  recorded_at timestamptz not null default now()
);
alter table public.schema_state enable row level security;
-- No policy at all: service role only. Nothing client-side reads this.

insert into public.schema_state (key, value)
values ('legacy_playground_backfill',
        jsonb_build_object('completed', true, 'migration', '02_badges_rename.sql'))
on conflict (key) do nothing;

-- Re-running migration 02 after this point is a no-op for the backfill: its
-- insert statements are guarded on this marker being absent. See 02.

-- =============================================================================
-- STAGE 2 — Phase 2, with the Playground rebuild.
-- The legacy tables stop being written at all, by anyone.
-- =============================================================================
-- The rebuilt Playground writes `challenge_attempts`, `xp_events` and
-- `user_badges` through the server, and reads nothing from the legacy pair. At
-- that point `POST /api/playground/progress` and `/complete` are deleted and the
-- legacy tables become pure history.
--
-- Run this only once the rebuilt Playground is live and the two shim endpoints
-- have been removed from the codebase:
--
--   revoke all on public.playground_track_badges from anon, authenticated;
--   revoke all on public.progress                from anon, authenticated;
--   drop policy if exists "own track badges read" on public.playground_track_badges;
--   drop policy if exists "own progress read"     on public.progress;
--   comment on table public.playground_track_badges is
--     'LEGACY, read-only history. Provenance for user_badges rows with
--      source_type=''playground''. Not written since the Phase 2 cutover.';
--   comment on table public.progress is
--     'LEGACY, read-only history. Superseded by lesson_progress and
--      challenge_attempts. Not written since the Phase 2 cutover.';
--   insert into public.schema_state (key, value)
--     values ('legacy_playground_frozen', jsonb_build_object('phase','2'))
--     on conflict (key) do update set value = excluded.value, recorded_at = now();

-- =============================================================================
-- STAGE 3 — Phase 4, and not earlier than 90 days after the Stage 2 cutover.
-- The terminal state. This is what "not indefinite" means.
-- =============================================================================
-- Three preconditions, each verifiable rather than asserted:
--
--   1. Zero rows written since the Stage 2 cutover:
--        select count(*) from public.playground_track_badges
--        where earned_at > (select recorded_at from public.schema_state
--                           where key = 'legacy_playground_frozen');
--        -- must be 0
--
--   2. Zero code references. `grep -rn "playground_track_badges\|from('progress')" site/src`
--      returns nothing.
--
--   3. Every legacy row is represented in user_badges:
--        select count(*) from public.playground_track_badges b
--        where not exists (select 1 from public.user_badges u
--                          where u.user_id = b.user_id
--                            and u.badge_key = 'playground-' || b.track_slug);
--        -- must be 0
--
-- Then, and only then, move them out of the public schema. They are ARCHIVED,
-- not dropped: they are the provenance of every backfilled `user_badges` row,
-- and a verified achievement whose origin has been deleted is a verified
-- achievement nobody can audit.
--
--   create schema if not exists archive;
--   revoke all on schema archive from anon, authenticated;
--   alter table public.playground_track_badges set schema archive;
--   alter table public.progress                set schema archive;
--   insert into public.schema_state (key, value)
--     values ('legacy_playground_archived', jsonb_build_object('phase','4'))
--     on conflict (key) do update set value = excluded.value, recorded_at = now();
--
-- A DROP is deliberately not scheduled here. It becomes reasonable only after
-- the archive schema has been included in a retained database dump, and that is
-- a separate, dated decision — recorded in the archive comment when it is made.
