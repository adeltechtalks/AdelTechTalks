-- =============================================================================
-- v3 · 01 · profiles
-- ROLLBACK: drop trigger on_auth_user_created on auth.users;
--           drop function public.handle_new_user();
--           drop table public.profiles;
-- =============================================================================
-- One row per account. `display_name` is the ONLY column here that can reach a
-- public page, and even then it is COPIED onto the verification row at share
-- time rather than read live — so renaming yourself cannot silently rewrite a
-- link somebody already posted. That rule comes from `shares` in v2.x and it is
-- kept deliberately.
--
-- `subscribers` is NOT joined to this table. Newsletter consent is not account
-- state: a person may be one, the other or both, and linking them would make
-- "delete my account" ambiguous about the mailing list.

create extension if not exists citext;

create table if not exists public.profiles (
  user_id      uuid        primary key references auth.users (id) on delete cascade,
  display_name text,
  handle       citext      unique,
  avatar_url   text,
  lang         text        not null default 'en',
  bio          text,
  is_public    boolean     not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A profile is readable by its owner. Public profiles are a later phase; the
-- flag exists so that turning them on is a policy change, not a schema change.
drop policy if exists "own profile read" on public.profiles;
create policy "own profile read" on public.profiles
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "own profile write" on public.profiles;
create policy "own profile write" on public.profiles
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Insert is done by the trigger below, running as definer. Clients never insert.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill everyone who signed up before this migration.
insert into public.profiles (user_id, display_name)
select u.id, coalesce(u.raw_user_meta_data ->> 'full_name', split_part(u.email, '@', 1))
from auth.users u
on conflict (user_id) do nothing;
