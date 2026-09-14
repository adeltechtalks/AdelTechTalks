-- =============================================================================
-- Waitlist subscribers — the Coming Soon page's signup
-- =============================================================================
-- ADDITIVE ONLY. Creates one new table and touches nothing that already exists.
-- `subscribers` (the newsletter list) is a separate table with a separate
-- purpose and is neither read nor altered here. Every statement is
-- IF NOT EXISTS / OR REPLACE, so running it twice is a no-op.
--
-- TO ROLL BACK:  drop table if exists public.waitlist_subscribers;
-- Nothing depends on it.
-- =============================================================================

create table if not exists public.waitlist_subscribers (
  id          uuid primary key default gen_random_uuid(),
  first_name  text not null,
  last_name   text not null,
  email       text not null,
  -- Which surface the signup came from. Constrained by the policy below so the
  -- column cannot be used as free storage by anyone posting to the endpoint.
  source      text not null default 'coming-soon',
  -- Set by the client at submit time. The form states what joining means, so
  -- the moment of consent is the moment of submission.
  consent_at  timestamptz,
  created_at  timestamptz not null default now()
);

-- Case-insensitive uniqueness: `Adel@x.com` and `adel@x.com` are one person.
-- The client lowercases before sending; this index is the guarantee, not the
-- client. A violation surfaces as SQLSTATE 23505, which the form reads as
-- "already on the list" rather than as an error.
create unique index if not exists waitlist_subscribers_email_key
  on public.waitlist_subscribers (lower(email));

-- =============================================================================
-- Row Level Security
-- =============================================================================
-- The anon key is embedded in the page and is public by design. RLS is what
-- makes that safe:
--
--   INSERT  allowed for anon  → anybody can join the waitlist
--   SELECT  NOT granted       → nobody can read the list from the browser
--   UPDATE  NOT granted       → nobody can edit a row
--   DELETE  NOT granted       → nobody can remove a row
--
-- Adel reads the list in the Supabase dashboard, which uses the service role
-- and bypasses RLS. That key never appears in this repository or in the browser.
-- =============================================================================
alter table public.waitlist_subscribers enable row level security;

drop policy if exists "anyone can join the waitlist" on public.waitlist_subscribers;
create policy "anyone can join the waitlist"
  on public.waitlist_subscribers
  for insert
  to anon, authenticated
  with check (
    -- A sanity gate at the database edge, so a malformed or oversized row
    -- cannot be written even if the client-side checks are bypassed entirely.
    first_name is not null and length(btrim(first_name)) between 1 and 80
    and last_name  is not null and length(btrim(last_name))  between 1 and 80
    and email is not null
    and length(email) between 6 and 254
    and position('@' in email) > 1
    and email = lower(email)
    and source in ('coming-soon')
  );

-- No select/update/delete policy is created. With RLS on and no policy, those
-- operations return zero rows / are refused for anon. That is intentional and
-- is asserted against the live database by scripts/security/rls-check.mjs.
