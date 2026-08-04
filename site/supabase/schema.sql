-- =============================================================================
-- AdelTechTalks Playground — database setup
--
-- WHAT TO DO WITH THIS FILE:
-- 1. Go to your Supabase project → SQL Editor → New query
-- 2. Paste this whole file in
-- 3. Press Run
--
-- You only ever need to do this once.
-- =============================================================================

-- Which steps a person has ticked off.
create table if not exists public.progress (
  user_id     uuid        not null references auth.users (id) on delete cascade,
  track_slug  text        not null,
  step_index  integer     not null,
  created_at  timestamptz not null default now(),
  primary key (user_id, track_slug, step_index)
);

-- Which badges a person has earned.
create table if not exists public.badges (
  user_id     uuid        not null references auth.users (id) on delete cascade,
  track_slug  text        not null,
  earned_at   timestamptz not null default now(),
  primary key (user_id, track_slug)
);

-- -----------------------------------------------------------------------------
-- Row Level Security — this is the important part.
--
-- The key in your website's code is public and anyone can read it out of the
-- page. These rules are what actually protect the data: they make every row
-- readable and writable ONLY by the signed-in person who owns it. Nobody can
-- read, change or delete anyone else's progress, even with the key in hand.
-- -----------------------------------------------------------------------------
alter table public.progress enable row level security;
alter table public.badges   enable row level security;

drop policy if exists "own progress" on public.progress;
create policy "own progress"
  on public.progress
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own badges" on public.badges;
create policy "own badges"
  on public.badges
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Speeds up "show me everything for this person"
create index if not exists progress_user_idx on public.progress (user_id);
create index if not exists badges_user_idx   on public.badges   (user_id);
