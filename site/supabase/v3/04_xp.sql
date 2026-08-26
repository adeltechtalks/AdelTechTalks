-- =============================================================================
-- v3 · 04 · XP  (event-sourced)
-- ROLLBACK: drop function public.rebuild_xp(uuid);
--           drop table public.skill_progress, public.xp_balances, public.xp_events;
-- =============================================================================
-- `xp_events` is the ledger and the only source of truth. `xp_balances` and
-- `skill_progress` are caches that can be thrown away and rebuilt at any time by
-- rebuild_xp(). That is what makes XP auditable rather than merely stored.
--
-- The column that actually makes XP CORRECT is `idempotency_key`. Event sourcing
-- without it just produces an auditable record of the wrong number: finish a
-- lesson twice, retry a webhook, double-click a button, and the ledger faithfully
-- records three awards for one achievement.

create table if not exists public.xp_events (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references auth.users (id) on delete cascade,
  amount          integer     not null,        -- may be negative (revocation)
  reason          text        not null,        -- 'challenge.perfect', 'lesson.completed'
  skill           text,                        -- null = general XP only
  subject_type    text,
  subject_id      text,
  idempotency_key text        not null,
  metadata        jsonb       not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  unique (user_id, idempotency_key)
);

alter table public.xp_events enable row level security;
drop policy if exists "own xp events read" on public.xp_events;
create policy "own xp events read" on public.xp_events
  for select to authenticated using (auth.uid() = user_id);
-- No client insert. XP is awarded server-side; a client that can write here can
-- award itself any level and any XP-threshold badge.

create index if not exists xp_events_user_idx on public.xp_events (user_id, created_at desc);

create table if not exists public.xp_balances (
  user_id    uuid        primary key references auth.users (id) on delete cascade,
  total_xp   integer     not null default 0,
  -- A KEY, not a display name. Level names and thresholds live in application
  -- config so renaming "Maker" is a config edit, not a migration.
  level_key  text        not null default 'explorer',
  updated_at timestamptz not null default now()
);

alter table public.xp_balances enable row level security;
drop policy if exists "own balance read" on public.xp_balances;
create policy "own balance read" on public.xp_balances
  for select to authenticated using (auth.uid() = user_id);

create table if not exists public.skill_progress (
  user_id    uuid        not null references auth.users (id) on delete cascade,
  skill      text        not null,
  xp         integer     not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, skill)
);

alter table public.skill_progress enable row level security;
drop policy if exists "own skill read" on public.skill_progress;
create policy "own skill read" on public.skill_progress
  for select to authenticated using (auth.uid() = user_id);

-- ---- the rebuild ------------------------------------------------------------
-- Pass a user_id to rebuild one person, or null to rebuild everyone. CI runs
-- this against a restored snapshot and asserts the caches are unchanged, which
-- turns "the ledger and the totals agree" into a test rather than a hope.
create or replace function public.rebuild_xp(target uuid default null)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.xp_balances (user_id, total_xp, updated_at)
  select e.user_id, greatest(sum(e.amount), 0), now()
  from public.xp_events e
  where target is null or e.user_id = target
  group by e.user_id
  on conflict (user_id) do update
    set total_xp = excluded.total_xp, updated_at = now();

  insert into public.skill_progress (user_id, skill, xp, updated_at)
  select e.user_id, e.skill, greatest(sum(e.amount), 0), now()
  from public.xp_events e
  where e.skill is not null and (target is null or e.user_id = target)
  group by e.user_id, e.skill
  on conflict (user_id, skill) do update
    set xp = excluded.xp, updated_at = now();
end;
$$;
