-- =============================================================================
-- AdelTechTalks Playground — shareable badges
--
-- RUN THIS AFTER schema.sql:
--   Supabase → SQL Editor → New query → paste → Run
--
-- WHAT THIS DOES, AND THE TRADE-OFF YOU ARE ACCEPTING:
--
-- Your progress and badges are private — only you can read your own rows.
-- A badge that can be posted to LinkedIn cannot be private: the whole point is
-- that strangers, and LinkedIn's own crawler, can open the link and see it.
--
-- So earned badges get a SECOND, deliberately public record in `shares`, holding
-- only what belongs on a public page:
--
--     the badge earned · a display name · the date
--
-- It does NOT contain email addresses, progress detail, quiz answers, or
-- anything else. `progress` and `badges` stay private and untouched.
--
-- A share row is only ever created when someone chooses to share.
-- Deleting the row un-publishes the badge; the earned badge itself remains.
-- =============================================================================

create table if not exists public.shares (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users (id) on delete cascade,
  track_slug   text        not null,
  -- Captured at share time so a later profile change cannot silently alter
  -- what a already-posted link shows.
  display_name text        not null,
  earned_at    timestamptz not null default now(),
  unique (user_id, track_slug)
);

alter table public.shares enable row level security;

-- ANYONE, signed in or not, may read a share. This is intentional — it is what
-- makes the link work when posted. Rows contain nothing private.
drop policy if exists "shares are public" on public.shares;
create policy "shares are public"
  on public.shares
  for select
  to anon, authenticated
  using (true);

-- Only the owner may publish, and only under their own user id.
drop policy if exists "own shares insert" on public.shares;
create policy "own shares insert"
  on public.shares
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Only the owner may un-publish.
drop policy if exists "own shares delete" on public.shares;
create policy "own shares delete"
  on public.shares
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Nobody may edit a share after the fact — a posted link must not be able to
-- change what it says. To change it, delete and re-share.

create index if not exists shares_track_idx on public.shares (track_slug);
create index if not exists shares_user_idx  on public.shares (user_id);
