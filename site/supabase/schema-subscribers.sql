-- =============================================================================
-- Newsletter subscribers  (Adel Personal Brand v2.0 · §20, §21, §34)
-- =============================================================================
-- ADDITIVE ONLY. This migration creates one new table and touches nothing that
-- already exists — `progress`, `badges` and `shares` are not read, altered or
-- dropped by any statement in this file. Every statement is IF NOT EXISTS, so
-- running it twice is a no-op.
--
-- TO ROLL BACK:  drop table if exists public.subscribers;
-- Nothing else depends on it.
-- =============================================================================

create table if not exists public.subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text not null,
  -- Which language the reader was using when they subscribed. Adel writes in
  -- both, and sending Arabic readers English-only mail would waste the list.
  lang          text not null default 'en',

  -- ---- attribution (§21) --------------------------------------------------
  -- Four columns, all nullable, all taken from the URL the visitor arrived on.
  -- No identifiers, no cross-site tracking, nothing derived from the visitor.
  source        text,
  platform      text,
  campaign      text,
  guide         text,
  -- Where on the site they subscribed from ('home', 'guide', 'newsletter'),
  -- and the path they were reading. Path only — never the query string.
  placement     text,
  landing_path  text,

  -- ---- consent (§20) ------------------------------------------------------
  consented_at  timestamptz,
  unsubscribed_at timestamptz,

  created_at    timestamptz not null default now()
);

-- Case-insensitive uniqueness. `Adel@x.com` and `adel@x.com` are one person.
-- The client also lowercases before sending; this is the guarantee, not the
-- client. A violation here surfaces as 23505, which the form reads as
-- "already subscribed" rather than as an error.
create unique index if not exists subscribers_email_key
  on public.subscribers (lower(email));

-- Handy for "who came from the TikTok campaign" without a full scan.
create index if not exists subscribers_campaign_idx
  on public.subscribers (campaign)
  where campaign is not null;

-- =============================================================================
-- Row Level Security
-- =============================================================================
-- The anon key is embedded in the page and is public by design. RLS is what
-- makes that safe:
--
--   INSERT  allowed for anon  → anybody can subscribe
--   SELECT  NOT granted       → nobody can read the list from the browser
--   UPDATE  NOT granted       → nobody can edit a row
--   DELETE  NOT granted       → nobody can remove a row
--
-- Adel reads the list in the Supabase dashboard, which uses the service role
-- and bypasses RLS. That key never appears in this repository or in the browser.
-- =============================================================================
alter table public.subscribers enable row level security;

drop policy if exists "anyone can subscribe" on public.subscribers;
create policy "anyone can subscribe"
  on public.subscribers
  for insert
  to anon, authenticated
  with check (
    -- A minimal sanity gate at the database edge, so a malformed row cannot be
    -- written even if the client-side check is bypassed.
    email is not null
    and length(email) between 6 and 254
    and position('@' in email) > 1
    and lang in ('en', 'ar')
  );

-- No select/update/delete policy is created. With RLS on and no policy, those
-- operations return zero rows / are refused for anon. That is intentional.
