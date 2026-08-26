# supabase/v3 — proposed migrations

**Status: PROPOSALS. None of these has been run against any Supabase project.**
**Revision: v3.1.** Migrations 02, 03 and 05 changed; migration 07 is new.

They accompany `docs/v3/V3_DATA_MODEL.md` and exist to be reviewed as code rather
than as prose. Run them only after that document is approved, in numeric order,
against a branch database first.

## Files

| # | file | v3.1 status |
|---|---|---|
| 01 | `01_profiles.sql` | unchanged |
| 02 | `02_badges_rename.sql` | **revised** — backfill is now one-time and enforced; write policy marked transitional |
| 03 | `03_achievements.sql` | **rewritten** — no client writes; generalised to badge / course / challenge |
| 04 | `04_xp.sql` | unchanged — already server-write-only |
| 05 | `05_learning.sql` | **revised** — `lesson_progress` server-written; `scored_by` added to attempts |
| 06 | `06_commerce.sql` | unchanged |
| 07 | `07_retire_legacy_gamification.sql` | **new** — dated retirement of the client-writable legacy path |

## Rules every file here follows

- Additive or a rename with a compatibility view. **Nothing that holds live rows
  is dropped.**
- **Running the whole set twice is a no-op, and this is tested rather than
  asserted** — see `verify-migrations.sh` below. That rule used to be written
  here as an aspiration and was not true: the first time it was actually
  checked, three files failed on a re-run. Every `create policy` is now preceded
  by `drop policy if exists` for *the same name*, and 02's rename is guarded on
  both source and target state.
- **Grants are stated, not inherited.** Supabase grants every role full access to
  new tables in `public`, which is why RLS is the protection here. Where a role
  genuinely needs a privilege — `anon` reading `achievement_verifications` so
  `/badge/<id>` renders — the grant is written down, so the page does not depend
  on a platform default nobody stated.
- RLS is enabled on every table that Postgres exposes, in the same migration
  that creates the table — never "we'll add policies later".
- Every file states its rollback at the top.

## Verifying, before anything touches a real database

```bash
./verify-migrations.sh          # needs a local PostgreSQL 16; touches nothing remote
```

It stands up a throwaway database, reproduces the production schema **including
Supabase's default privileges**, seeds it with production-shaped data — 10
`progress`, 3 `badges`, 1 `shares` under the real live id, 1 `subscribers` —
then runs the full set **twice** and asserts:

- both runs succeed and leave identical row counts
- the legacy rows are preserved, not duplicated
- the new `badges` catalogue is never renamed by a re-run
- the share id is unchanged and `/badge/<id>` still resolves **as `anon`**
- `progress` is frozen: its owner can read it, nobody can write it
- after the step-4 cutover, `shares` is a view with a byte-identical column set
  and the badge URL still resolves

Reproducing the default privileges is what makes the test meaningful. A run
without them gives false failures — it reports the badge page as broken when it
is not.

## The v3.1 rule, added after review

**A client may write a table only if writing it confers nothing.**

Not "only its own rows" — that was the v3 rule, and it is not sufficient. A row
that is about you can still be a row that claims something untrue about you. The
test each policy has to pass is: *if a client wrote this row itself, what could
it then obtain?* If the answer is XP, a level, a badge, a course completion, an
entitlement, or a public verification, the table is server-written.

After v3.1 exactly one table in this set is client-writable: `saved_prompts`,
which is a bookmark and awards nothing. `subscribers` keeps its anon insert,
unchanged from v2.x.

## Order and coupling

**Applying 02 + 07 stops the live v2.x Playground from writing.** That is not a
prediction; it is what the harness observes. After 07, `insert into progress`
and `insert into playground_track_badges` are refused for `authenticated`.
Reads and `/badge/<id>` are unaffected. So the write shims must ship in the same
release, or the Playground silently stops recording progress.

`02` and `07` **ship in the same deploy, in that order.** 02 leaves a transitional
write policy on `playground_track_badges` because the live v2.x Playground is
still writing it; 07 removes that policy and the server-mediated write path lands
with it. Running 02 without 07 leaves the escalation route open.

The live v2.x tables are `progress`, `badges`, `shares`, `subscribers`. Migration
02 renames `badges`, migration 03 turns `shares` into a view, and migration 07
freezes `progress` and the renamed legacy table. All three preserve every
existing row and every existing public URL. Read those most carefully.
