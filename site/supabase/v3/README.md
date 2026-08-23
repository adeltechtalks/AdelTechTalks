# supabase/v3 — proposed migrations

**Status: PROPOSALS. None of these has been run against any Supabase project.**

They accompany `docs/v3/V3_DATA_MODEL.md` and exist to be reviewed as code rather
than as prose. Run them only after that document is approved, in numeric order,
against a branch database first.

Rules every file here follows:

- Additive or a rename with a compatibility view. **Nothing that holds live rows
  is dropped.**
- Every statement is `if not exists` / `or replace`, so running a file twice is
  a no-op.
- RLS is enabled on every table that Postgres exposes, in the same migration
  that creates the table — never "we'll add policies later".
- Every file states its rollback at the top.

The live v2.x tables are `progress`, `badges`, `shares`, `subscribers`. Migration
02 renames `badges` and migration 03 turns `shares` into a view; both preserve
every existing row and every existing public URL. Read those two most carefully.
