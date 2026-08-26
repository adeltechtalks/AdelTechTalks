/* =============================================================================
   Supabase policy audit — static analysis of the SQL that defines access
   =============================================================================
   Runs with no credentials and no network, so it works on every machine and in
   every CI run. It reads the schema files and asserts the invariants that must
   hold for RLS to mean anything:

     1. every table created in `public` enables row level security
     2. no table is left with RLS on and no policy at all, unless that is
        deliberate (service-role-only tables are declared, not inferred)
     3. no write policy is granted to `anon` without a `with check`
     4. broad `for all` policies are surfaced
     5. a public `select using (true)` on a table holding `user_id` is surfaced,
        because "public" then means every column, including internal ids

   Severities:
     FAIL    — breaks the build. Definitely wrong.
     REVIEW  — surfaced, and must appear in accepted-findings.json with a
               reason. An UNACCEPTED review finding becomes a FAIL.

   That last mechanism is the point. It means a new broad policy fails CI while
   the ones already argued about stay quiet — no daily noise, no silent drift.

   Usage:  node scripts/security/policy-audit.mjs
   ========================================================================== */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = join(HERE, '..', '..');
const SUPA = join(SITE, 'supabase');
const ACCEPTED = join(HERE, 'accepted-findings.json');

/* ---- collect the SQL ------------------------------------------------------ */
function sqlFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, name.name);
    /* `testdata/` holds fixtures that deliberately recreate the OLD schema so
       the migrations have something to migrate. Auditing them would report the
       v2.x policies as if they were live and would make the fixture's shape a
       security finding — so scaffolding is skipped, not accepted. */
    if (name.isDirectory()) { if (name.name !== 'testdata') sqlFiles(full, out); }
    else if (name.name.endsWith('.sql')) out.push(full);
  }
  return out;
}

/* Strip comments so a policy discussed in prose is not parsed as a real one.
   These schema files carry long explanatory comments, and several of them
   contain commented-out SQL on purpose. */
const strip = (sql) =>
  sql.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*--.*$/gm, ' ');

/* Sorted, so migrations are read in the order they would be applied:
   the live schema first, then supabase/v3/01… through 07. The end state
   is what gets judged, and the end state depends on that order. */
const files = sqlFiles(SUPA).sort();
if (files.length === 0) {
  console.error('policy-audit: no .sql files found under supabase/');
  process.exit(2);
}

/* ---- parse ---------------------------------------------------------------- */
const tables = new Map();   // name → { file, columns, rls, policies[] }

function table(name, file) {
  if (!tables.has(name)) tables.set(name, { name, file, columns: [], rls: false, policies: [] });
  return tables.get(name);
}

for (const file of files) {
  const rel = relative(SITE, file);
  const sql = strip(readFileSync(file, 'utf8'));

  /* create table public.X ( ...columns... ) */
  for (const m of sql.matchAll(/create\s+table\s+(?:if\s+not\s+exists\s+)?public\.(\w+)\s*\(([\s\S]*?)\n\s*\);/gi)) {
    const t = table(m[1], rel);
    t.columns = m[2].split('\n')
      .map((l) => (l.trim().match(/^(\w+)\s+\w/) || [])[1])
      .filter(Boolean);
  }
  /* alter table public.X enable row level security */
  for (const m of sql.matchAll(/alter\s+table\s+(?:if\s+exists\s+)?public\.(\w+)\s+enable\s+row\s+level\s+security/gi)) {
    table(m[1], rel).rls = true;
  }
  /* A rename carries the whole table forward — columns, RLS *and* policies —
     and leaves nothing behind under the old name. Migration 02 renames `badges`
     to `playground_track_badges` and then creates a new, unrelated `badges`
     catalogue. If the policies did not move with the rename, the old
     `for all` policy would appear to sit on the new catalogue table, which is
     read-only reference data — a phantom finding on a table that never had it. */
  for (const m of sql.matchAll(/alter\s+table\s+(?:if\s+exists\s+)?public\.(\w+)\s+rename\s+to\s+(\w+)/gi)) {
    const from = tables.get(m[1]);
    if (!from) continue;
    const to = table(m[2], rel);
    to.columns = from.columns;
    to.rls = from.rls;
    to.policies = from.policies;
    tables.delete(m[1]);
  }
  /* Policies, walked in source order so a later `drop policy` actually removes
     an earlier one. Without this the audit reports the union of every policy
     ever written rather than the state the database ends in — and migration 07
     exists precisely to drop the transitional policies migration 02 leaves
     behind. Reporting those as live findings would be a false positive, and a
     false positive that can only be silenced by writing an untrue reason into
     accepted-findings.json is worse than no check at all. */
  const CREATE = /create\s+policy\s+"([^"]+)"\s*\n?\s*on\s+public\.(\w+)\s*([\s\S]*?)(?=;\s*(?:\n|$))/gi;
  const DROP = /drop\s+policy\s+(?:if\s+exists\s+)?"([^"]+)"\s*\n?\s*on\s+public\.(\w+)/gi;

  const stmts = [];
  for (const m of sql.matchAll(CREATE)) stmts.push({ at: m.index, kind: 'create', m });
  for (const m of sql.matchAll(DROP)) stmts.push({ at: m.index, kind: 'drop', m });
  stmts.sort((a, b) => a.at - b.at);

  for (const { kind, m } of stmts) {
    if (kind === 'drop') {
      const [, name, tbl] = m;
      const t = tables.get(tbl);
      if (t) t.policies = t.policies.filter((p) => p.name !== name);
      continue;
    }
    const [, name, tbl, rest] = m;
    const cmd = (rest.match(/\bfor\s+(all|select|insert|update|delete)\b/i) || [, 'all'])[1].toLowerCase();
    const roles = (rest.match(/\bto\s+([\w\s,]+?)(?=\s+(?:using|with)\b|\s*$)/i) || [, ''])[1]
      .split(',').map((r) => r.trim()).filter(Boolean);
    const using = (rest.match(/\busing\s*\(([\s\S]*?)\)\s*(?:with\s+check|$)/i) || [])[1] || null;
    const hasCheck = /\bwith\s+check\s*\(/i.test(rest);
    table(tbl, rel).policies.push({ name, cmd, roles, using, hasCheck, file: rel });
  }
}

/* ---- rules ---------------------------------------------------------------- */
const findings = [];
const add = (sev, id, table, detail) => findings.push({ sev, id, table, detail });

const WRITE = new Set(['all', 'insert', 'update', 'delete']);

for (const t of tables.values()) {
  if (t.columns.length === 0 && t.policies.length === 0) continue; /* rename-only shadow */

  if (!t.rls && t.columns.length) {
    add('FAIL', 'rls-disabled', t.name,
      `table created in public without "enable row level security" (${t.file})`);
  }

  for (const p of t.policies) {
    const anon = p.roles.includes('anon');

    if (WRITE.has(p.cmd) && anon && !p.hasCheck) {
      add('FAIL', 'anon-write-unchecked', t.name,
        `policy "${p.name}" grants ${p.cmd.toUpperCase()} to anon with no WITH CHECK`);
    }
    if (p.cmd === 'all') {
      add('REVIEW', 'broad-for-all', t.name,
        `policy "${p.name}" is FOR ALL to ${p.roles.join(', ') || '(unspecified)'} — one policy covering read and every write`);
    }
    if (p.cmd === 'select' && anon && p.using && /^\s*true\s*$/i.test(p.using)) {
      const exposes = t.columns.filter((c) => /^(user_id|email|anon_key)$/.test(c));
      if (exposes.length) {
        add('REVIEW', 'public-select-exposes-identifier', t.name,
          `policy "${p.name}" is SELECT to anon USING (true) on a table holding ${exposes.join(', ')} — public means every column`);
      }
    }
  }

  if (t.rls && t.policies.length === 0 && t.columns.length) {
    add('REVIEW', 'rls-no-policy', t.name,
      'RLS enabled with no policy — reachable only by the service role. Intentional for ledger tables; a mistake anywhere else');
  }
}

/* ---- accepted findings ---------------------------------------------------- */
let accepted = [];
if (existsSync(ACCEPTED)) accepted = JSON.parse(readFileSync(ACCEPTED, 'utf8')).accepted ?? [];
const key = (f) => `${f.id}:${f.table}`;
const acceptedMap = new Map(accepted.map((a) => [`${a.id}:${a.table}`, a.reason]));

let fails = 0;
const reviews = [];
for (const f of findings) {
  if (f.sev === 'FAIL') { fails++; continue; }
  if (acceptedMap.has(key(f))) { reviews.push({ ...f, accepted: acceptedMap.get(key(f)) }); }
  else { f.sev = 'FAIL'; f.detail += '  — NOT in accepted-findings.json'; fails++; }
}

/* An accepted finding that no longer fires is not harmless: it is a tolerance
   for a problem that may already be fixed, sitting in the file looking like it
   still applies. Migration 07 retires the `progress` and `badges` write
   policies, so their entries stop matching the moment those migrations are in
   the tree — and the correct response is to delete them, not to leave them
   accruing. Failing on a stale entry is what forces that. */
const fired = new Set(findings.map(key));
const stale = accepted.filter((a) => !fired.has(`${a.id}:${a.table}`));
for (const a of stale) {
  console.error(`  ✗ FAIL   [stale-acceptance] ${a.table}`);
  console.error(`           accepted-findings.json still accepts [${a.id}] on ${a.table}, `
    + 'but the audit no longer reports it. Delete the entry — the finding is gone.\n');
  fails++;
}

/* ---- report --------------------------------------------------------------- */
console.log(`policy audit — ${tables.size} tables across ${files.length} SQL file(s)\n`);

for (const f of findings.filter((x) => x.sev === 'FAIL')) {
  console.error(`  ✗ FAIL   [${f.id}] ${f.table}`);
  console.error(`           ${f.detail}\n`);
}
for (const f of reviews) {
  console.log(`  · review [${f.id}] ${f.table}`);
  console.log(`           ${f.detail}`);
  console.log(`           accepted: ${f.accepted}\n`);
}

const clientWritable = [...tables.values()]
  .filter((t) => t.policies.some((p) => WRITE.has(p.cmd) && (p.roles.includes('anon') || p.roles.includes('authenticated'))))
  .map((t) => t.name).sort();
console.log(`  client-writable tables: ${clientWritable.join(', ') || '(none)'}`);

if (fails) {
  console.error(`\n✗  policy audit failed — ${fails} finding(s) need a decision.`);
  console.error('   Fix the policy, or record the finding in scripts/security/accepted-findings.json');
  console.error('   with a reason. Accepting one is a reviewable diff, which is the point.\n');
  process.exit(1);
}
console.log(`\n✓  policy audit clean — ${reviews.length} accepted finding(s), no unreviewed ones\n`);
