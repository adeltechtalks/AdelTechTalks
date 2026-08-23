-- =============================================================================
-- v3.1 · 05 · learning state and challenge attempts
-- ROLLBACK: drop table public.challenge_attempts, public.lesson_progress,
--                      public.enrollments, public.saved_prompts;
-- =============================================================================
-- Every *_slug column references content that lives in git, and deliberately
-- carries NO foreign key. Content gets renamed, moved and deleted by editorial
-- action, and a database constraint must not be able to block a content edit.
-- Integrity is enforced at BUILD time instead: a QA check fails the build if a
-- slug that live user rows point at no longer exists in the collections. That is
-- the right place for it — it is a content problem, not a data-integrity one.

create table if not exists public.saved_prompts (
  user_id     uuid        not null references auth.users (id) on delete cascade,
  prompt_slug text        not null,
  note        text,
  created_at  timestamptz not null default now(),
  primary key (user_id, prompt_slug)
);
alter table public.saved_prompts enable row level security;
drop policy if exists "own saved prompts" on public.saved_prompts;
create policy "own saved prompts" on public.saved_prompts
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- v3.1: this is the ONLY table in the v3 set a client may still write, and it is
-- allowed because it confers nothing. A saved prompt is a bookmark. It awards no
-- XP, satisfies no badge requirement and proves no achievement.
--
-- The v3 XP table awarded 5 XP for "save a first prompt". That is REMOVED in
-- v3.1, and this comment records why: it would have made a server-issued XP
-- award depend on a client-written row as its evidence — the same shape as the
-- defect corrected in migrations 03 and 07, at a smaller scale. If a saved
-- prompt should ever earn XP, this table becomes server-written first.

create table if not exists public.enrollments (
  user_id      uuid        not null references auth.users (id) on delete cascade,
  course_slug  text        not null,
  source       text        not null default 'free'
                 check (source in ('free','purchase','grant')),
  enrolled_at  timestamptz not null default now(),
  completed_at timestamptz,
  primary key (user_id, course_slug)
);
alter table public.enrollments enable row level security;
drop policy if exists "own enrollments read" on public.enrollments;
create policy "own enrollments read" on public.enrollments
  for select to authenticated using (auth.uid() = user_id);
-- Written server-side: enrolling is an entitlement decision, not a client one.

create table if not exists public.lesson_progress (
  user_id      uuid        not null references auth.users (id) on delete cascade,
  course_slug  text        not null,
  lesson_slug  text        not null,
  status       text        not null default 'started'
                 check (status in ('started','completed')),
  progress_pct integer     not null default 0 check (progress_pct between 0 and 100),
  last_position integer,
  started_at   timestamptz not null default now(),
  completed_at timestamptz,
  updated_at   timestamptz not null default now(),
  primary key (user_id, course_slug, lesson_slug)
);
alter table public.lesson_progress enable row level security;
drop policy if exists "own lesson progress" on public.lesson_progress;
create policy "own lesson progress read" on public.lesson_progress
  for select to authenticated using (auth.uid() = user_id);
revoke insert, update, delete on public.lesson_progress from anon, authenticated;
-- v3.1: was `for all to authenticated`. Changed, because lesson completion is
-- not private bookkeeping — it is evidence:
--
--     client marks every lesson complete
--       → the completion job sets enrollments.completed_at
--       → POST /api/achievements/publish accepts that as proof
--       → a public verified "completed this course" page for a course nobody took.
--
-- Written by `POST /api/learning/progress`, which verifies the session, checks
-- the entitlement for the lesson, and records position and completion itself.

-- ---- challenge attempts -----------------------------------------------------
-- user_id is NULLABLE on purpose. An anonymous visitor can play the homepage
-- challenge and be scored — that is the conversion mechanic, and "you scored 84,
-- sign up to keep it" cannot work if the score evaporates on navigation.
--
-- An anonymous row carries no PII: one opaque random key generated in the
-- browser, deleted the moment the attempt is claimed at sign-up, and expired by
-- a scheduled job after 30 days.
create table if not exists public.challenge_attempts (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        references auth.users (id) on delete cascade,
  anon_key        text,
  challenge_slug  text        not null,
  experience_slug text        not null,
  format          text        not null check (format in ('choose','repair','create')),
  score           integer     not null check (score between 0 and 100),
  -- jsonb, not five columns: scoring dimensions differ per track, and a rigid
  -- column set would need migrating for every new Playground track.
  dimensions      jsonb       not null default '{}'::jsonb,
  payload         jsonb,
  rubric_version  text,
  -- v3.1. HOW the score was produced, and therefore what it may be used for.
  --   'deterministic' — Choose and Repair. Computed by the server from the
  --                     challenge definition. Trustworthy.
  --   'self_assessed' — Create, at foundation. The learner grades their own
  --                     attempt against a worked model answer. Genuinely
  --                     valuable to do, and NOT evidence of anything.
  --   'model_assisted'— Create, Phase 4. Scored behind the server by a model
  --                     against the rubric.
  scored_by       text        not null default 'deterministic'
                    check (scored_by in ('deterministic','self_assessed','model_assisted')),
  duration_ms     integer,
  is_best         boolean     not null default false,
  created_at      timestamptz not null default now(),
  check (user_id is not null or anon_key is not null)
);

alter table public.challenge_attempts enable row level security;
drop policy if exists "own attempts read" on public.challenge_attempts;
create policy "own attempts read" on public.challenge_attempts
  for select to authenticated using (auth.uid() = user_id);
-- Attempts are written server-side: scoring happens on the server, or a client
-- simply posts itself a 100.
--
-- v3.1, and this is the rule the rest of the system depends on:
-- A SELF-ASSESSED SCORE IS NOT EVIDENCE. It may not satisfy a badge requirement
-- that names a minimum score, and it may not be published as a verified
-- achievement. Both are enforced in the publish endpoint and in the badge
-- evaluator, not in the UI. See V3_GAMIFICATION §5 and V3_API_SURFACE §2.
--
-- Consequence, recorded so it is not quietly worked around: the `prompt-architect`
-- badge ("score >=90 on a Create challenge") cannot be earned at foundation and
-- ships in Phase 4 with model-assisted scoring.

create index if not exists attempts_user_idx on public.challenge_attempts (user_id, challenge_slug);
create index if not exists attempts_challenge_idx on public.challenge_attempts (challenge_slug, created_at desc);
create index if not exists attempts_anon_idx on public.challenge_attempts (anon_key) where anon_key is not null;
