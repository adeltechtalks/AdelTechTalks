/* =============================================================================
   PR 4 acceptance test — the Playground still works after Stage B
   =============================================================================
   Stage B (migrations 02 + 07) revokes the browser's INSERT/UPDATE/DELETE on
   `progress` and the renamed legacy badge table. The claim this PR has to
   support is that the Playground keeps recording progress and awarding badges
   anyway, because those writes now go through the server.

   Asserting that from the client code alone would prove nothing, so this drives
   the REAL shim routes running in workerd, against a REAL post-Stage-B Postgres,
   through a stand-in for Supabase's REST and auth surface. The stand-in does not
   simulate permissions — it issues `SET ROLE` and lets Postgres enforce them, so
   a revoked grant fails here for exactly the reason it would fail in production.

   Usage (see the PR body for the full sequence):
     node scripts/test-write-shims.mjs --serve   # the Supabase stand-in
     node scripts/test-write-shims.mjs --assert  # drive workerd and check
   ========================================================================== */
import { createServer } from 'node:http';
import { execFileSync } from 'node:child_process';

const PGBIN = process.env.PGBIN || '/usr/lib/postgresql/16/bin';
const SOCK = process.env.PGSOCK || '/tmp/pg4/sock';
const PORT = Number(process.env.MOCK_PORT || 5441);
const DBPORT = process.env.PGPORT || '5440';
const SERVICE_KEY = 'test-service-role-key';
const ANON_KEY = 'test-anon-key';
const USER_ID = '11111111-1111-4111-8111-111111111111';
const TOKEN = 'test-session-token-for-adel';

function sql(text, role) {
  /* SET LOCAL inside a transaction: the role applies to this statement only,
     and Postgres — not this script — decides whether it is allowed. */
  const wrapped = `begin; set local role ${role}; set local request.jwt.claim.sub = '${USER_ID}'; ${text}; commit;`;
  try {
    const out = execFileSync(
      'su',
      ['pgtest', '-c', `${PGBIN}/psql -h ${SOCK} -p ${DBPORT} -U postgres -d atc -At -F'|' -v ON_ERROR_STOP=1 -c "${wrapped.replace(/"/g, '\\"')}"`],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
    );
    return { ok: true, rows: out.trim().split('\n').filter((l) => l && l !== 'BEGIN' && l !== 'COMMIT' && !/^(SET|INSERT|DELETE|UPDATE)/.test(l)) };
  } catch (err) {
    const msg = (err.stderr || err.stdout || String(err)).toString();
    return { ok: false, error: msg.split('\n').find((l) => /ERROR/.test(l)) || msg.slice(0, 200) };
  }
}

const q = (v) => `'${String(v).replace(/'/g, "''")}'`;

if (process.argv.includes('--serve')) {
  createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    const key = req.headers.apikey || '';
    const role = key === SERVICE_KEY ? 'service_role' : 'authenticated';
    const send = (code, body) => {
      res.writeHead(code, { 'content-type': 'application/json' });
      res.end(JSON.stringify(body));
    };

    /* auth.getUser(token) */
    if (url.pathname === '/auth/v1/user') {
      const bearer = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
      if (bearer !== TOKEN) return send(401, { error: 'invalid token' });
      return send(200, { id: USER_ID, aud: 'authenticated', email: 'adel@example.test' });
    }

    const m = /^\/rest\/v1\/(\w+)$/.exec(url.pathname);
    if (!m) return send(404, { error: 'no route' });
    const table = m[1];

    let raw = '';
    for await (const chunk of req) raw += chunk;

    if (req.method === 'GET') {
      const r = sql(`select 1 from public.${table} limit 1`, role);
      return r.ok ? send(200, []) : send(400, { code: /does not exist/.test(r.error) ? 'PGRST205' : '42501', message: r.error });
    }

    if (req.method === 'POST') {
      const row = JSON.parse(raw || '{}');
      const rows = Array.isArray(row) ? row : [row];
      const cols = Object.keys(rows[0]);
      const values = rows.map((r) => `(${cols.map((c) => q(r[c])).join(',')})`).join(',');
      const conflict = /merge-duplicates/.test(req.headers.prefer || '')
        ? ` on conflict (${table === 'progress' ? 'user_id,track_slug,step_index' : 'user_id,track_slug'}) do nothing`
        : '';
      const r = sql(`insert into public.${table} (${cols.join(',')}) values ${values}${conflict}`, role);
      return r.ok ? send(201, []) : send(403, { code: '42501', message: r.error });
    }

    if (req.method === 'DELETE') {
      const where = [...url.searchParams.entries()]
        .filter(([k]) => k !== 'select')
        .map(([k, v]) => `${k} = ${q(v.replace(/^eq\./, ''))}`)
        .join(' and ');
      const r = sql(`delete from public.${table} where ${where || 'false'}`, role);
      return r.ok ? send(204, []) : send(403, { code: '42501', message: r.error });
    }
    send(405, { error: 'method' });
  }).listen(PORT, '127.0.0.1', () => console.log(`supabase stand-in on ${PORT}`));
}

if (process.argv.includes('--assert')) {
  const WORKER = process.env.WORKER || 'http://127.0.0.1:8793';
  let fails = 0;
  const ok = (l) => console.log(`  ✓ ${l}`);
  const bad = (l, d) => { console.log(`  ✗ ${l} — ${d}`); fails++; };
  const count = (t, where) => {
    const r = sql(`select count(*) from public.${t} where ${where}`, 'service_role');
    return r.ok ? Number(r.rows[r.rows.length - 1]) : -1;
  };

  console.log('\n1 · the browser can no longer write directly (Stage B applied)');
  for (const [t, stmt] of [
    ['progress', `insert into public.progress (user_id,track_slug,step_index) values (${q(USER_ID)},'shim-test',1)`],
    ['playground_track_badges', `insert into public.playground_track_badges (user_id,track_slug) values (${q(USER_ID)},'shim-test')`],
  ]) {
    const r = sql(stmt, 'authenticated');
    r.ok ? bad(`${t} write should have been denied`, 'it succeeded') : ok(`${t}: denied as authenticated — ${/permission denied/.test(r.error) ? 'permission denied' : r.error.slice(0, 60)}`);
  }

  const call = async (path, body, token = TOKEN) =>
    fetch(`${WORKER}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(token ? { authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body),
    });

  console.log('\n2 · the shims still record progress and award badges');
  const before = count('progress', `track_slug = 'shim-test'`);
  let r = await call('/api/playground/progress', { track_slug: 'shim-test', step_index: 1, done: true });
  r.status === 200 ? ok('POST /api/playground/progress → 200') : bad('progress shim', `${r.status} ${await r.text()}`);
  const after = count('progress', `track_slug = 'shim-test'`);
  after === before + 1 ? ok(`progress row written by the server (${before} → ${after})`) : bad('progress row', `${before} → ${after}`);

  r = await call('/api/playground/progress', { track_slug: 'shim-test', step_index: 1, done: true });
  count('progress', `track_slug = 'shim-test'`) === after ? ok('re-posting the same step is idempotent') : bad('idempotency', 'row count moved');

  r = await call('/api/playground/complete', { track_slug: 'ai-in-your-camera' });
  r.status === 200 ? ok('POST /api/playground/complete → 200') : bad('complete shim', `${r.status} ${await r.text()}`);
  count('playground_track_badges', `track_slug = 'ai-in-your-camera'`) >= 1
    ? ok('badge present in playground_track_badges — written under the RENAMED table')
    : bad('badge row', 'missing');

  r = await call('/api/playground/progress', { track_slug: 'shim-test', step_index: 1, done: false });
  count('progress', `track_slug = 'shim-test'`) === before ? ok('un-ticking a step deletes it again') : bad('delete', 'row survived');

  console.log('\n3 · the shims refuse what they should');
  r = await call('/api/playground/progress', { track_slug: 'shim-test', step_index: 1, done: true }, '');
  r.status === 401 ? ok('no token → 401') : bad('missing token', r.status);
  r = await call('/api/playground/progress', { track_slug: 'shim-test', step_index: 1, done: true }, 'forged-token');
  r.status === 401 ? ok('forged token → 401') : bad('forged token', r.status);
  r = await call('/api/playground/progress', { track_slug: 'x', step_index: 1, done: true, user_id: 'someone-else' });
  r.status === 400 ? ok('body carrying user_id → 400 (never silently stripped)') : bad('user_id', r.status);
  r = await call('/api/playground/progress', { track_slug: 'BAD SLUG!', step_index: 1, done: true });
  r.status === 400 ? ok('malformed track_slug → 400') : bad('slug validation', r.status);
  r = await call('/api/playground/progress', { track_slug: 'x', step_index: -1, done: true });
  r.status === 400 ? ok('negative step_index → 400') : bad('step validation', r.status);
  r = await call('/api/playground/complete', { track_slug: 'not-a-real-track' });
  r.status === 400 ? ok('unknown track → 400 (badge list cannot be invented)') : bad('unknown track', r.status);

  console.log(fails === 0 ? '\n✓  write shims verified against a post-Stage-B database\n' : `\n✗  ${fails} assertion(s) failed\n`);
  process.exit(fails ? 1 : 0);
}
