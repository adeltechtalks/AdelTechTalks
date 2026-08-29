create extension if not exists pgcrypto;
create schema if not exists auth;
create table auth.users (
  id uuid primary key default gen_random_uuid(), email text unique,
  raw_user_meta_data jsonb default '{}'::jsonb, created_at timestamptz not null default now());
create or replace function auth.uid() returns uuid language sql stable as $$ select current_setting('request.jwt.claim.sub', true)::uuid $$;
do $$ begin create role anon;          exception when duplicate_object then null; end $$;
do $$ begin create role authenticated; exception when duplicate_object then null; end $$;
do $$ begin create role service_role;  exception when duplicate_object then null; end $$;
-- Supabase grants service_role BYPASSRLS (verified against the live project:
-- pg_roles.rolbypassrls is true for service_role and postgres, false for anon
-- and authenticated). Without this the fixture is STRICTER than production and
-- server-side writes fail here for a reason they never would in reality.
alter role service_role bypassrls;
grant usage on schema public, auth to anon, authenticated, service_role;
create table public.progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  track_slug text not null, step_index integer not null,
  created_at timestamptz not null default now(), primary key (user_id, track_slug, step_index));
create index progress_user_idx on public.progress (user_id);
alter table public.progress enable row level security;
create policy "own progress" on public.progress for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create table public.badges (
  user_id uuid not null references auth.users(id) on delete cascade,
  track_slug text not null, earned_at timestamptz not null default now(),
  primary key (user_id, track_slug));
create index badges_user_idx on public.badges (user_id);
alter table public.badges enable row level security;
create policy "own badges" on public.badges for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create table public.shares (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  track_slug text not null, display_name text not null,
  earned_at timestamptz not null default now(), unique (user_id, track_slug));
create index shares_user_idx on public.shares (user_id);
create index shares_track_idx on public.shares (track_slug);
alter table public.shares enable row level security;
create policy "shares are public" on public.shares for select to anon using (true);
create table public.subscribers (
  id uuid primary key default gen_random_uuid(), email text not null,
  lang text not null default 'en', source text, platform text, campaign text,
  guide text, placement text, landing_path text, consented_at timestamptz,
  unsubscribed_at timestamptz, created_at timestamptz not null default now());
create unique index subscribers_email_key on public.subscribers (lower(email));
alter table public.subscribers enable row level security;
-- Supabase default privileges: RLS is the protection, not grants.
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
