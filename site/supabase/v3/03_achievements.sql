-- =============================================================================
-- v3 · 03 · public achievement verification  (turns `shares` into a view)
-- ROLLBACK: drop view public.shares;
--           create table public.shares as select id, user_id, track_slug,
--             display_name, earned_at from public.achievement_verifications ...;
--           (re-apply the v2.x policies, then drop achievement_verifications)
-- =============================================================================
-- READ THIS ONE CAREFULLY. `/badge/[id]` is server-rendered and those links are
-- posted on LinkedIn. They cannot 404, and they cannot start rendering a
-- different person's name.
--
-- `shares` was already the right design: a deliberately public projection
-- carrying only what belongs on a public page, sitting beside a private table it
-- never exposes. v3 generalises it from "a Playground track" to "any
-- achievement" — and keeps `shares` as a view so the existing page keeps
-- resolving with no code change on the day of the migration.
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
  badge_key    text        not null references public.badges (key),
  -- Frozen at share time. A later profile rename must not rewrite a posted link.
  display_name text        not null,
  earned_at    timestamptz not null default now(),
  -- Optional snapshots, also frozen.
  level_key    text,
  total_xp     integer,
  revoked_at   timestamptz,
  created_at   timestamptz not null default now(),
  unique (user_id, badge_key)
);

alter table public.achievement_verifications enable row level security;

-- ANYONE may read a non-revoked verification. This is the entire point of the
-- table: the link has to work for a stranger and for LinkedIn's crawler. The
-- row holds a badge, a name and a date — no email, no progress, no attempts.
drop policy if exists "verifications are public" on public.achievement_verifications;
create policy "verifications are public" on public.achievement_verifications
  for select to anon, authenticated using (revoked_at is null);

-- Only the owner may publish or un-publish their own.
drop policy if exists "own verification insert" on public.achievement_verifications;
create policy "own verification insert" on public.achievement_verifications
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "own verification delete" on public.achievement_verifications;
create policy "own verification delete" on public.achievement_verifications
  for delete to authenticated using (auth.uid() = user_id);

-- ---- step 2: carry every existing share across, id and all ------------------
-- The id is preserved so every posted /badge/<id> URL resolves to the same row.
insert into public.achievement_verifications
  (id, user_id, badge_key, display_name, earned_at, created_at)
select s.id, s.user_id, 'playground-' || s.track_slug, s.display_name, s.earned_at, s.earned_at
from public.shares s
where exists (select 1 from public.badges b where b.key = 'playground-' || s.track_slug)
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
--               regexp_replace(v.badge_key, '^playground-', '') as track_slug,
--               v.display_name,
--               v.earned_at
--        from public.achievement_verifications v
--        where v.revoked_at is null;
--   grant select on public.shares to anon, authenticated;
-- commit;
