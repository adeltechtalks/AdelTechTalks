/* =============================================================================
   Secret scan — committed source, and built client output
   =============================================================================
   The rule this enforces is narrower than "no long random strings", because
   this repository deliberately commits one:

     site.config.ts holds the Supabase ANON key, in the clear, on purpose.
     It is designed to be public — RLS is what protects the data, not key
     secrecy — and the schema comments say so.

   So a scanner that flags every JWT would fail on day one, be silenced, and
   then catch nothing. This one decodes the token and reads its `role` claim:

     role = anon          → allowed, this is public by design
     role = service_role  → FAIL, this bypasses every RLS policy

   That distinction is the whole point of the file.

   Usage:  node scripts/security/secret-scan.mjs [--dist]
           --dist   also scan built output for secret VALUES
   ========================================================================== */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

/* Scan the whole repository, not just site/ — a secret committed under docs/
   or scripts/ is exactly as leaked as one under src/. */
const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = join(HERE, '..', '..');
const ROOT = (() => {
  try {
    return execSync('git rev-parse --show-toplevel', { cwd: HERE, encoding: 'utf8' }).trim();
  } catch {
    return SITE;
  }
})();
const scanDist = process.argv.includes('--dist');

/* Files that may not be scanned as text, and directories that are not ours. */
const SKIP_DIRS = new Set(['node_modules', '.git', '.astro', 'dist']);
const BINARY = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.ico',
  '.woff', '.woff2', '.ttf', '.otf', '.mp4', '.webm', '.pdf', '.zip', '.gz']);

/* An inline escape hatch, for the one case a rule is genuinely wrong. It has to
   name the reason, so the next reader can judge it rather than trust it. */
const ALLOW = /security-scan-allow:\s*\S+/;

const findings = [];
function report(file, line, rule, detail) {
  findings.push({ file, line, rule, detail });
}

/* ---- rules ---------------------------------------------------------------
   Each returns a finding when it matches. Ordered by how bad it is. */

/** A Supabase/PostgREST JWT whose role is anything other than `anon`. */
function jwtRole(text, file) {
  const JWT = /eyJ[A-Za-z0-9_-]{10,}\.(eyJ[A-Za-z0-9_-]{10,})\.[A-Za-z0-9_-]{10,}/g;
  for (const m of text.matchAll(JWT)) {
    let role = null;
    try {
      const payload = JSON.parse(Buffer.from(m[1], 'base64url').toString('utf8'));
      role = payload.role ?? null;
    } catch {
      continue; /* not a JWT we can read — not our business */
    }
    if (role && role !== 'anon') {
      report(file, lineOf(text, m.index), 'privileged-jwt',
        `JWT with role="${role}" — this bypasses RLS and must never be committed`);
    }
  }
}

/** Provider secret keys, matched on their documented prefixes. */
const LITERALS = [
  [/\bsk_live_[A-Za-z0-9]{10,}/g, 'stripe-live-secret', 'Stripe live secret key'],
  [/\bsk_test_[A-Za-z0-9]{10,}/g, 'stripe-test-secret', 'Stripe test secret key'],
  [/\bwhsec_[A-Za-z0-9]{10,}/g, 'stripe-webhook-secret', 'Stripe webhook signing secret'],
  [/-----BEGIN (?:RSA |EC |OPENSSH |PGP )?PRIVATE KEY-----/g, 'private-key', 'private key block'],
  [/\bghp_[A-Za-z0-9]{20,}/g, 'github-token', 'GitHub personal access token'],
];

/** A secret-shaped env var assigned a real value rather than left empty. */
const ENV_ASSIGN =
  /\b(SUPABASE_SERVICE_ROLE_KEY|STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET|SERVICE_ROLE_KEY)\s*[:=]\s*['"`]([^'"`\s]{8,})['"`]/g;

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

/* Dist-only: the string `service_role` has no business in anything a browser
   downloads. In source it appears in comments and documentation, which is why
   this rule is scoped to built client output rather than applied everywhere. */
function distOnlyRules(text, file) {
  for (const m of text.matchAll(/service_role/g)) {
    report(file, lineOf(text, m.index), 'service-role-in-client-bundle',
      'the string "service_role" appears in output the browser downloads');
  }
}

function scanText(text, file, dist = false) {
  jwtRole(text, file);
  if (dist) distOnlyRules(text, file);
  for (const [re, rule, detail] of LITERALS) {
    for (const m of text.matchAll(re)) {
      const ln = lineOf(text, m.index);
      if (ALLOW.test(text.split('\n')[ln - 1] ?? '')) continue;
      report(file, ln, rule, detail);
    }
  }
  for (const m of text.matchAll(ENV_ASSIGN)) {
    /* A placeholder is not a secret. */
    if (/^(your|placeholder|changeme|xxx+|<.*>|\$\{)/i.test(m[2])) continue;
    report(file, lineOf(text, m.index), 'committed-env-secret',
      `${m[1]} assigned a literal value`);
  }
}

function walk(dir, onFile) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, onFile);
    else onFile(full);
  }
}

/* ---- 1. tracked source ---------------------------------------------------
   Only files git tracks. An untracked local scratch file is the developer's
   own business and flagging it is how a scanner becomes noise. */
let tracked = [];
try {
  tracked = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8' })
    .split('\n').filter(Boolean);
} catch {
  console.error('secret-scan: not a git repository — falling back to a full walk');
  walk(ROOT, (f) => tracked.push(relative(ROOT, f)));
}

for (const rel of tracked) {
  if (BINARY.has(extname(rel).toLowerCase())) continue;
  const full = join(ROOT, rel);
  if (!existsSync(full) || statSync(full).isDirectory()) continue;
  /* This file necessarily contains the patterns it looks for. */
  if (rel.endsWith('scripts/security/secret-scan.mjs')) continue;
  scanText(readFileSync(full, 'utf8'), rel);
}

/* ---- 2. built client output ----------------------------------------------
   The check that actually protects visitors: whatever the source says, nothing
   privileged may end up in what the browser downloads. Server bundles are
   excluded — _worker.js legitimately reads secret bindings by name at runtime,
   and a scanner that fails on the NAME teaches people to rename the binding. */
if (scanDist) {
  const dist = join(SITE, 'dist');
  if (!existsSync(dist)) {
    console.error('secret-scan: --dist given but dist/ does not exist. Run `npm run build` first.');
    process.exit(2);
  }
  walk(dist, (full) => {
    const rel = relative(ROOT, full);
    if (rel.includes('_worker.js')) return;          /* server bundle, not shipped to browsers */
    if (BINARY.has(extname(full).toLowerCase())) return;
    scanText(readFileSync(full, 'utf8'), rel, true);
  });
}

/* ---- self-test -----------------------------------------------------------
   A scanner nobody has ever seen fire is a scanner nobody should trust. This
   asserts every rule catches its own case, and — just as important — that the
   anon key does NOT fire. Runs in CI, costs milliseconds.
   `node secret-scan.mjs --self-test` */
if (process.argv.includes('--self-test')) {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const jwt = (role) => `eyJhbGciOiJIUzI1NiJ9.${b64({ iss: 'supabase', role })}.c2lnbmF0dXJlX3BsYWNlaG9sZGVy`;

  const cases = [
    ['privileged-jwt',        jwt('service_role'),                       true],
    ['privileged-jwt (anon)', jwt('anon'),                               false],
    ['stripe-live-secret',    'const k = "sk_live_ABCDEFGHIJ1234567890"', true],
    ['stripe-test-secret',    'const k = "sk_test_ABCDEFGHIJ1234567890"', true],
    ['stripe-webhook-secret', 'const k = "whsec_ABCDEFGHIJ1234567890"',   true],
    ['private-key',           '-----BEGIN RSA PRIVATE KEY-----',         true],
    ['github-token',          'ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ012345',    true],
    ['committed-env-secret',  'SUPABASE_SERVICE_ROLE_KEY="realvalue123"', true],
    ['env placeholder',       'SUPABASE_SERVICE_ROLE_KEY="your-key-here"', false],
  ];

  /* dist-only rule, checked separately because it is scoped to built output */
  findings.length = 0;
  scanText('const role = "service_role";', '<self-test>', true);
  const distFired = findings.length > 0;
  findings.length = 0;
  scanText('const role = "service_role";', '<self-test>', false);
  const srcFired = findings.length > 0;
  if (!distFired || srcFired) {
    console.error('  ✗ service-role-in-client-bundle: must fire on dist only');
    process.exitCode = 1;
  } else {
    console.log('  ✓ service-role-in-client-bundle (dist only, ignored in source)');
  }

  let failed = 0;
  for (const [name, sample, shouldFire] of cases) {
    findings.length = 0;
    scanText(sample, '<self-test>');
    const fired = findings.length > 0;
    if (fired !== shouldFire) {
      console.error(`  ✗ ${name}: expected ${shouldFire ? 'a finding' : 'no finding'}, got ${fired ? 'one' : 'none'}`);
      failed++;
    } else {
      console.log(`  ✓ ${name}${shouldFire ? '' : ' correctly ignored'}`);
    }
  }
  findings.length = 0;
  if (failed) { console.error(`\n✗  secret-scan self-test: ${failed} rule(s) broken\n`); process.exit(1); }
  console.log('\n✓  secret-scan self-test passed — every rule fires, the anon key does not\n');
  process.exit(0);
}

/* ---- report --------------------------------------------------------------- */
const scope = scanDist ? 'tracked source + built client output' : 'tracked source';
if (findings.length === 0) {
  console.log(`✓  secret scan clean (${scope}, ${tracked.length} tracked files)`);
  console.log('   note: the Supabase anon key is committed by design and is not a finding.');
  process.exit(0);
}

console.error(`\n✗  secret scan found ${findings.length} problem(s):\n`);
for (const f of findings) {
  console.error(`   ${f.file}:${f.line}`);
  console.error(`     [${f.rule}] ${f.detail}\n`);
}
console.error('   If a finding is genuinely wrong, add a trailing comment naming the');
console.error('   reason: security-scan-allow: <why>. Never silence a privileged JWT.\n');
process.exit(1);
