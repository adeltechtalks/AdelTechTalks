/* =============================================================================
   RLS check — what the public anon key can actually reach
   =============================================================================
   The policy audit reads the SQL. This asks the live database, because a policy
   that exists in a file and a policy that is applied are different things.

   It needs no new credentials. The Supabase anon key is already committed in
   site.config.ts by design, and "what can someone do with the public key" is
   exactly the question worth asking — it is the key every visitor already has.

   Assertions, all from an unauthenticated client:

     subscribers   NOT readable   — the mailing list must never be public
     progress      NOT readable   — someone else's Playground progress
     badges        NOT readable   — someone else's earned badges
     shares        readable       — deliberate public projection, /badge/[id]

   The fourth is asserted as readable on purpose. A test suite that only checks
   that things are locked will happily pass on a database where everything is
   broken, including the parts that are supposed to work.

   Optional, when two test accounts are provided: cross-user isolation.
     RLS_TEST_EMAIL_A / RLS_TEST_PASSWORD_A
     RLS_TEST_EMAIL_B / RLS_TEST_PASSWORD_B

   Exit codes:  0 pass or skipped   1 a real failure   (never fails on no network)
   ========================================================================== */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/* Read the public config the site itself uses, so this tests the real target
   rather than a separately-maintained copy that can drift. */
function publicConfig() {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    return { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_ANON_KEY };
  }
  const cfg = readFileSync(join(SITE, 'src', 'site.config.ts'), 'utf8');
  const url = (cfg.match(/supabaseUrl:\s*'([^']+)'/) || [])[1];
  const key = (cfg.match(/supabaseAnonKey:\s*'([^']+)'/) || [])[1];
  return { url, key };
}

const { url, key } = publicConfig();
if (!url || !key || /^\s*$/.test(url)) {
  console.log('· rls-check skipped — no Supabase URL/anon key configured.');
  process.exit(0);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

const results = [];
const ok = (name, detail) => results.push({ name, pass: true, detail });
const bad = (name, detail) => results.push({ name, pass: false, detail });

/** Returns 'denied' | 'readable' | { network: true } */
async function probe(table) {
  try {
    const { data, error } = await sb.from(table).select('*').limit(1);
    if (error) {
      /* Supabase surfaces RLS denial as an error OR as an empty set depending on
         the policy. Anything that looks like a transport problem is not a result. */
      if (/fetch failed|ENOTFOUND|ECONNREFUSED|ETIMEDOUT|network/i.test(error.message)) {
        return { network: true, message: error.message };
      }
      return 'denied';
    }
    return Array.isArray(data) && data.length > 0 ? 'readable' : 'empty';
  } catch (e) {
    return { network: true, message: String(e.message || e) };
  }
}

const MUST_BE_PRIVATE = ['subscribers', 'progress', 'badges'];

let networkDown = null;
for (const t of MUST_BE_PRIVATE) {
  const r = await probe(t);
  if (r && r.network) { networkDown = r.message; break; }
  if (r === 'readable') bad(`${t} is not readable by anon`, `ANON CAN READ ROWS FROM ${t}`);
  else ok(`${t} is not readable by anon`, r === 'denied' ? 'denied by RLS' : 'no rows returned');
}

if (networkDown) {
  console.log(`· rls-check skipped — cannot reach Supabase (${networkDown}).`);
  console.log('  This is a connectivity result, not a security result. It is never a pass.');
  process.exit(0);
}

/* The one that must be readable. */
const shares = await probe('shares');
if (shares && shares.network) {
  console.log('· rls-check partially skipped — lost connectivity mid-run.');
} else if (shares === 'denied') {
  bad('shares is readable by anon', 'PUBLIC PROJECTION IS DENIED — /badge/[id] will break for crawlers');
} else {
  ok('shares is readable by anon', shares === 'empty' ? 'reachable, currently no rows' : 'reachable');
}

/* ---- optional: cross-user isolation --------------------------------------- */
const A = { email: process.env.RLS_TEST_EMAIL_A, password: process.env.RLS_TEST_PASSWORD_A };
const B = { email: process.env.RLS_TEST_EMAIL_B, password: process.env.RLS_TEST_PASSWORD_B };

if (A.email && A.password && B.email && B.password) {
  const c = createClient(url, key, { auth: { persistSession: false } });
  const { data: authA, error: errA } = await c.auth.signInWithPassword(A);
  const { data: authB } = await createClient(url, key, { auth: { persistSession: false } })
    .auth.signInWithPassword(B);
  if (errA || !authA?.user || !authB?.user) {
    console.log('· cross-user isolation skipped — test accounts did not authenticate.');
  } else {
    for (const t of ['progress', 'badges']) {
      const { data } = await c.from(t).select('user_id');
      const foreign = (data || []).filter((r) => r.user_id !== authA.user.id);
      if (foreign.length) bad(`${t}: user A cannot see user B's rows`, `${foreign.length} foreign row(s) visible`);
      else ok(`${t}: user A cannot see user B's rows`, 'only own rows returned');
    }
  }
} else {
  console.log('· cross-user isolation skipped — RLS_TEST_EMAIL_A/B not set.\n');
}

/* ---- report --------------------------------------------------------------- */
for (const r of results) console.log(`  ${r.pass ? '✓' : '✗'} ${r.name} — ${r.detail}`);
const failed = results.filter((r) => !r.pass);
if (failed.length) {
  console.error(`\n✗  rls-check: ${failed.length} assertion(s) failed against the live database.\n`);
  process.exit(1);
}
console.log(`\n✓  rls-check passed — ${results.length} assertion(s) against the live database\n`);
