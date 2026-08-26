#!/usr/bin/env bash
# =============================================================================
# verify-migrations.sh — run the v3 migration set twice against a throwaway
# database seeded with production-shaped data, and assert what must hold.
#
# This exists so the idempotency claim in README.md is checkable rather than
# asserted. It found three real bugs the first time it was run.
#
# Needs a local PostgreSQL 16 server binary. Touches no remote database and
# reads no credentials.
#
#   ./verify-migrations.sh
# =============================================================================
set -euo pipefail

PGBIN="${PGBIN:-/usr/lib/postgresql/16/bin}"
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TMP="$(mktemp -d)"
PORT="${PORT:-54329}"
export PGOPTIONS="-c client_min_messages=warning"   # `if not exists` NOTICEs are the point, not news
SHARE_ID='d8ad0f50-fb66-445e-8c1f-fc9960d08d78'   # the one live badge URL
USER_ID='11111111-1111-4111-8111-111111111111'
fails=0

cleanup() { "$PGBIN/pg_ctl" -D "$TMP/data" stop -m immediate >/dev/null 2>&1 || true; rm -rf "$TMP"; }
trap cleanup EXIT

ok()   { echo "  ✓ $1"; }
bad()  { echo "  ✗ $1"; fails=$((fails+1)); }
# psql echoes "SET" for each `set role` / `set request…`; drop those so an
# assertion compares the value, not the session chatter.
q()    { "$PGBIN/psql" -h "$TMP/sock" -p "$PORT" -U postgres -d atc -At -c "$1" 2>&1 | grep -v '^SET$'; }
runf() { "$PGBIN/psql" -h "$TMP/sock" -p "$PORT" -U postgres -d atc -q -v ON_ERROR_STOP=1 -f "$1"; }
expect() { # expect <label> <actual> <wanted>
  [ "$2" = "$3" ] && ok "$1" || bad "$1 — got '$2', wanted '$3'"
}

mkdir -p "$TMP/data" "$TMP/sock"
"$PGBIN/initdb" -D "$TMP/data" -U postgres --auth=trust >/dev/null
"$PGBIN/pg_ctl" -D "$TMP/data" -o "-k $TMP/sock -p $PORT -c listen_addresses=" -l "$TMP/log" start >/dev/null
"$PGBIN/psql" -h "$TMP/sock" -p "$PORT" -U postgres -q -c 'create database atc'

# ---- a stand-in for production ---------------------------------------------
# Supabase grants every role full access to new public tables; RLS is the
# protection. Reproducing that is what makes this test meaningful.
runf "$DIR/testdata/prod_schema.sql"
runf "$DIR/testdata/seed.sql"

SEQ=(01_profiles 02_badges_rename 07_retire_legacy_gamification 03_achievements 04_xp 05_learning 06_commerce)

echo "first run"
for f in "${SEQ[@]}"; do runf "$DIR/$f.sql" >/dev/null && ok "$f" || bad "$f"; done
first=$(q "select (select count(*) from progress)||'/'||(select count(*) from playground_track_badges)||'/'||(select count(*) from shares)||'/'||(select count(*) from subscribers)||'/'||(select count(*) from user_badges)||'/'||(select count(*) from achievement_verifications)||'/'||(select count(*) from profiles)")

echo "second run — must be a no-op"
for f in "${SEQ[@]}"; do runf "$DIR/$f.sql" >/dev/null && ok "$f" || bad "$f"; done
second=$(q "select (select count(*) from progress)||'/'||(select count(*) from playground_track_badges)||'/'||(select count(*) from shares)||'/'||(select count(*) from subscribers)||'/'||(select count(*) from user_badges)||'/'||(select count(*) from achievement_verifications)||'/'||(select count(*) from profiles)")

echo "assertions"
expect "row counts identical across runs"  "$second" "$first"
expect "legacy data preserved"             "$first"  "10/3/1/1/3/1/1"
expect "the catalogue was not renamed"     "$(q "select count(*) from information_schema.columns where table_schema='public' and table_name='badges' and column_name='key'")" "1"
expect "share id unchanged"                "$(q "select id from achievement_verifications")" "$SHARE_ID"
expect "badge URL resolves for anon"       "$(q "set role anon; select display_name||'/'||track_slug from shares where id='$SHARE_ID'")" "Adel/ai-in-your-camera"
expect "anon SELECT is granted explicitly" "$(q "select privilege_type from information_schema.role_table_grants where table_schema='public' and table_name='achievement_verifications' and grantee='anon' and privilege_type='SELECT'")" "SELECT"
# RLS cannot stop a TRUNCATE — Postgres checks only the table grant — so this is
# the one write that a row-level policy could never have caught. Supabase grants
# it by default; migration 03 must take it back from both public roles.
expect "TRUNCATE is revoked from both roles" "$(q "select count(*) from information_schema.role_table_grants where table_schema='public' and table_name='achievement_verifications' and grantee in ('anon','authenticated') and privilege_type='TRUNCATE'")" "0"
expect "progress is frozen, not writable"  "$(q "set role authenticated; set request.jwt.claim.sub='$USER_ID'; insert into progress values ('$USER_ID','x',1)" 2>&1 | grep -c 'permission denied' || true)" "1"
expect "owner can still read progress"     "$(q "set role authenticated; set request.jwt.claim.sub='$USER_ID'; select count(*) from progress")" "10"

echo "cutover (migration 03 step 4)"
expect "guard query returns 0"             "$(q "select count(*) from shares s where not exists (select 1 from achievement_verifications v where v.id=s.id)")" "0"
runf "$DIR/testdata/cutover.sql" >/dev/null
expect "shares is now a view"              "$(q "select table_type from information_schema.tables where table_schema='public' and table_name='shares'")" "VIEW"
expect "view column set is unchanged"      "$(q "select string_agg(column_name,',' order by ordinal_position) from information_schema.columns where table_schema='public' and table_name='shares'")" "id,user_id,track_slug,display_name,earned_at"
expect "badge URL survives the cutover"    "$(q "set role anon; select display_name||'/'||track_slug from shares where id='$SHARE_ID'")" "Adel/ai-in-your-camera"

echo
if [ "$fails" -eq 0 ]; then echo "✓  migration set verified — runs twice, loses nothing, badge URL intact"; else
  echo "✗  $fails assertion(s) failed"; exit 1; fi
