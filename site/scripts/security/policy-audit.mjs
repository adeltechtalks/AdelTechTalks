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
    if (name.isDirectory()) sqlFiles(full, out);
    else if (name.name.endsWith('.sql')) out.push(full);
  }
  return out;
}

/* Strip comments so a policy discussed in prose is not parsed as a real one.
   These schema files carry long explanatory comments, and several of them
   contain commented-out SQL on purpose. */
const strip = (sql) =>
  sql.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*--.*$/gm, ' ');

const files = sqlFiles(SUPA);
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
  /* rename carries the table forward under a new name */
  for (const m of sql.matchAll(/alter\s+table\s+(?:if\s+exists\s+)?public\.(\w+)\s+rename\s+to\s+(\w+)/gi)) {
    const from = tables.get(m[1]);
    const to = table(m[2], rel);
    if (from) { to.columns = from.columns; to.rls = from.rls; }
  }
  /* create policy "name" on public.X for CMD to ROLES using(...) with check(...) */
  for (const m of sql.matchAll(
    /create\s+policy\s+"([^"]+)"\s*\n?\s*on\s+public\.(\w+)\s*([\s\S]*?)(?=;\s*(?:\n|$))/gi)) {
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
