-- =============================================================================
-- v3 · 06 · commerce and entitlements   (PHASE 3 — written now, run later)
-- ROLLBACK: drop table public.workshop_registrations, public.workshops,
--                      public.entitlements, public.stripe_events,
--                      public.subscriptions, public.purchases,
--                      public.stripe_customers;
-- =============================================================================
-- Written ahead of the phase that needs it so the entitlement resolver has a
-- stable shape to compile against from day one. Nothing here is required by the
-- v3 foundation release.
--
-- NOTE ON RLS THROUGHOUT THIS FILE: every table is readable by its owner and
-- writable by NOBODY through the client. Purchases, subscriptions and
-- entitlements are written only by the Stripe webhook handler using the service
-- role, server-side. A client that can insert into `entitlements` owns every
-- paid course on the site.

create table if not exists public.stripe_customers (
  user_id            uuid        primary key references auth.users (id) on delete cascade,
  stripe_customer_id text        not null unique,
  created_at         timestamptz not null default now()
);
alter table public.stripe_customers enable row level security;
drop policy if exists "own customer read" on public.stripe_customers;
create policy "own customer read" on public.stripe_customers
  for select to authenticated using (auth.uid() = user_id);

create table if not exists public.purchases (
  id                         uuid        primary key default gen_random_uuid(),
  user_id                    uuid        not null references auth.users (id) on delete cascade,
  stripe_checkout_session_id text        not null unique,
  stripe_payment_intent_id   text,
  product_key                text        not null,
  kind                       text        not null check (kind in ('course','workshop','pack')),
  amount_cents               integer     not null,
  currency                   text        not null default 'usd',
  status                     text        not null default 'pending'
                               check (status in ('pending','paid','refunded','failed')),
  purchased_at               timestamptz,
  refunded_at                timestamptz,
  raw                        jsonb,
  created_at                 timestamptz not null default now()
);
alter table public.purchases enable row level security;
drop policy if exists "own purchases read" on public.purchases;
create policy "own purchases read" on public.purchases
  for select to authenticated using (auth.uid() = user_id);

create table if not exists public.subscriptions (
  id                     uuid        primary key default gen_random_uuid(),
  user_id                uuid        not null references auth.users (id) on delete cascade,
  stripe_subscription_id text        not null unique,
  price_id               text        not null,
  status                 text        not null,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean     not null default false,
  raw                    jsonb,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
drop policy if exists "own subscriptions read" on public.subscriptions;
create policy "own subscriptions read" on public.subscriptions
  for select to authenticated using (auth.uid() = user_id);

-- The webhook idempotency ledger. Every Stripe event is INSERTED BEFORE it is
-- acted on, so a duplicate delivery is a primary-key conflict rather than a
-- second entitlement. Stripe retries; this is what makes retries harmless.
create table if not exists public.stripe_events (
  id           text        primary key,     -- Stripe's own event id
  type         text        not null,
  received_at  timestamptz not null default now(),
  processed_at timestamptz,
  error        text,
  payload      jsonb       not null
);
alter table public.stripe_events enable row level security;
-- No policy at all: nothing but the service role ever touches this table.

-- ---- the one table that answers "can this person open that?" ----------------
create table if not exists public.entitlements (
  id           uuid        primary key default gen_random_uuid(),
  user_id      uuid        not null references auth.users (id) on delete cascade,
  subject_type text        not null
                 check (subject_type in ('course','lesson','resource','prompt_pack',
                                         'download','workshop','playground','tool')),
  subject_id   text        not null,        -- git slug, or '*' for a whole class
  source       text        not null
                 check (source in ('free','membership','purchase','subscription',
                                   'workshop','grant')),
  source_ref   text,
  granted_at   timestamptz not null default now(),
  expires_at   timestamptz,
  revoked_at   timestamptz,
  unique (user_id, subject_type, subject_id, source)
);
alter table public.entitlements enable row level security;
drop policy if exists "own entitlements read" on public.entitlements;
create policy "own entitlements read" on public.entitlements
  for select to authenticated using (auth.uid() = user_id);

create index if not exists entitlements_lookup_idx
  on public.entitlements (user_id, subject_type, subject_id);

create table if not exists public.workshops (
  slug             text        primary key,
  title            text        not null,
  starts_at        timestamptz not null,
  duration_min     integer     not null,
  capacity         integer,
  price_cents      integer     not null default 0,
  recording_asset  text,
  status           text        not null default 'scheduled'
                     check (status in ('scheduled','live','done','cancelled')),
  created_at       timestamptz not null default now()
);
alter table public.workshops enable row level security;
drop policy if exists "workshops are public" on public.workshops;
create policy "workshops are public" on public.workshops
  for select to anon, authenticated using (true);

create table if not exists public.workshop_registrations (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users (id) on delete cascade,
  workshop_slug  text        not null references public.workshops (slug),
  purchase_id    uuid        references public.purchases (id),
  registered_at  timestamptz not null default now(),
  attended_at    timestamptz,
  unique (user_id, workshop_slug)
);
alter table public.workshop_registrations enable row level security;
drop policy if exists "own registrations read" on public.workshop_registrations;
create policy "own registrations read" on public.workshop_registrations
  for select to authenticated using (auth.uid() = user_id);
