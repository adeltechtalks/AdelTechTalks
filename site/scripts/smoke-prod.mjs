/* =============================================================================
   Production smoke test — read-only, run against the live site after a deploy
   =============================================================================
   Checks the things that can only go wrong in production: the CDN serving a
   stale build, a route that 404s despite existing in dist/, a canonical or
   hreflang pointing at the wrong host, a sitemap that did not publish.

   It fetches, it does not write. The one thing it cannot cover — a real
   newsletter signup reaching Supabase — is deliberately done separately, so a
   write to a production table is never a side effect of a smoke test.

     node scripts/smoke-prod.mjs [origin]

   Defaults to https://adeltechtalks.com.
   ========================================================================== */

const ORIGIN = (process.argv[2] ?? 'https://adeltechtalks.com').replace(/\/$/, '');

const pass = [];
const fail = [];
const check = (ok, label) => (ok ? pass : fail).push(label);

async function get(path) {
  const res = await fetch(ORIGIN + path, { redirect: 'follow' });
  const body = res.headers.get('content-type')?.includes('text/html') ||
    res.headers.get('content-type')?.includes('xml') ||
    res.headers.get('content-type')?.includes('json')
    ? await res.text()
    : '';
  return { status: res.status, url: res.url, body };
}

const attr = (tag, name) => tag?.match(new RegExp(`\\s${name}\\s*=\\s*"([^"]*)"`, 'i'))?.[1] ?? null;

/* ---- 1. the nine smoke routes ---- */
const ROUTES = [
  '/', '/ar/', '/learn/', '/series/vibe-coding/', '/use-cases/gearnest/',
  '/prompts/', '/newsletter/', '/playground/', '/login/',
];

const pages = {};
for (const path of ROUTES) {
  const r = await get(path);
  pages[path] = r;
  check(r.status === 200, `${path} → 200 (got ${r.status})`);
}

/* ---- 2. the deployed build is the new one, not a stale cache ---- */
const home = pages['/'].body;
check(/Vibe Coding/.test(home), 'homepage carries the Vibe Coding series band');
check(/Adel — Product Manager/.test(home), 'homepage serves the v2.0 title, not the ATT one');

/* NOT a check for the string "atc-purple". The Phase 1 bridge deliberately
   KEEPS every legacy --atc-* token NAME and re-points its VALUE at a v2.0
   colour — that is what moved the whole pre-existing site onto the new palette
   without editing a component or inlining a hex. So the names survive on
   purpose, and asserting their absence fails against a working site.

   What actually matters is that no ATT purple VALUE wins, and that the legacy
   palette stays opt-in. Both are checked below. */
check(
  !/class="[^"]*\batt-legacy\b/.test(home),
  'legacy ATT scope is not applied to anything on the homepage'
);

/* ---- 3. language and direction ---- */
for (const [path, expectLang, expectDir] of [['/', 'en', 'ltr'], ['/ar/', 'ar', 'rtl'], ['/learn/', 'en', 'ltr']]) {
  const tag = pages[path]?.body.match(/<html[^>]*>/i)?.[0];
  check(attr(tag, 'lang') === expectLang, `${path} html lang="${expectLang}" (got ${attr(tag, 'lang')})`);
  check(attr(tag, 'dir') === expectDir, `${path} html dir="${expectDir}" (got ${attr(tag, 'dir')})`);
}

/* ---- 4. canonical points at the production host, self-referentially ---- */
for (const path of ['/', '/ar/', '/learn/', '/series/vibe-coding/', '/prompts/']) {
  const canonical = attr(pages[path].body.match(/<link[^>]*rel="canonical"[^>]*>/i)?.[0], 'href');
  check(canonical === `${ORIGIN}${path}`, `${path} canonical is ${ORIGIN}${path} (got ${canonical})`);
}

/* ---- 5. hreflang: real pairs, and every target resolves ---- */
const alts = [...pages['/learn/'].body.matchAll(/<link[^>]*rel="alternate"[^>]*>/gi)].map((m) => ({
  hreflang: attr(m[0], 'hreflang'),
  href: attr(m[0], 'href'),
}));
check(alts.some((a) => a.hreflang === 'en' && a.href === `${ORIGIN}/learn/`), '/learn/ declares an en alternate');
check(alts.some((a) => a.hreflang === 'ar' && a.href === `${ORIGIN}/ar/learn/`), '/learn/ declares an ar alternate');
check(alts.some((a) => a.hreflang === 'x-default'), '/learn/ declares x-default');
for (const a of alts) {
  const r = await fetch(a.href, { method: 'HEAD', redirect: 'follow' });
  check(r.status === 200, `hreflang ${a.hreflang} → ${a.href} resolves (got ${r.status})`);
}

/* ---- 6. the empty Guides state survived the deploy ---- */
const guides = await get('/guides/');
check(guides.status === 200, `/guides/ still reachable (got ${guides.status})`);
check(/noindex/.test(guides.body), '/guides/ is noindex in production');
check(!/rel="alternate"/.test(guides.body), '/guides/ advertises no hreflang');
const videos = await get('/videos/');
check(/noindex/.test(videos.body), '/videos/ is noindex in production');

/* ---- 7. sitemap ---- */
const index = await get('/sitemap-index.xml');
check(index.status === 200, `sitemap-index.xml → 200 (got ${index.status})`);
const sitemapUrl = index.body.match(/<loc>([^<]+)<\/loc>/)?.[1];
const sitemap = sitemapUrl ? await (await fetch(sitemapUrl)).text() : '';
const has = (u) => sitemap.includes(`<loc>${ORIGIN}${u}</loc>`);
for (const u of ['/', '/ar/', '/learn/', '/series/vibe-coding/', '/use-cases/gearnest/', '/prompts/']) {
  check(has(u), `sitemap lists ${u}`);
}
for (const u of ['/guides/', '/ar/guides/', '/videos/', '/ar/videos/', '/login/', '/profile/']) {
  check(!has(u), `sitemap correctly omits ${u}`);
}

/* ---- 8. no placeholder copy anywhere public ---- */
const ALL = [...ROUTES, '/guides/', '/videos/', '/about/', '/ar/about/', '/ar/learn/',
  '/ar/series/vibe-coding/', '/ar/use-cases/gearnest-ar/', '/ar/prompts/', '/topics/', '/404'];
for (const path of ALL) {
  const r = pages[path] ?? (await get(path));
  const readerText = r.body
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  check(!/PLACEHOLDER/.test(readerText), `${path} ships no PLACEHOLDER copy`);
  check(!/\[\[[^\]]+\]\]/.test(readerText), `${path} ships no unrendered [[term]] marker`);
}

/* ---- 9. the colour bridge actually won in the deployed CSS ----------------
        Legacy token names survive by design; their values must not. This reads
        the served stylesheet and confirms that the LAST :root definition of a
        legacy purple token points at a v2.0 blue, and that the ATT value is
        only ever restored inside the opt-in .att-legacy scope. ---- */
const cssHref = home.match(/\/_astro\/[A-Za-z0-9._-]+\.css/)?.[0];
if (!cssHref) {
  check(false, 'found the deployed stylesheet');
} else {
  const css = await (await fetch(ORIGIN + cssHref)).text();
  const blocks = [...css.matchAll(/([^{}]+)\{([^{}]*--atc-purple-700\s*:[^{}]*)\}/g)].map((m) => ({
    selector: m[1].trim().split(/\s*,\s*/).pop().trim(),
    value: m[2].match(/--atc-purple-700\s*:\s*([^;}]+)/)[1].trim(),
  }));
  const rootWinner = blocks.filter((b) => b.selector === ':root').at(-1);
  check(
    rootWinner?.value === 'var(--adel-deep-blue)',
    `the bridge wins at :root — --atc-purple-700 resolves to ${rootWinner?.value}`
  );
  check(
    blocks.filter((b) => /att-legacy/.test(b.selector)).every((b) => /--att-purple/.test(b.value)),
    'ATT purple is restored only inside the opt-in .att-legacy scope'
  );
  check(/--adel-deep-blue:\s*#1746A2/i.test(css), 'v2.0 Deep Blue is the served value');
}

/* ---- 10. the retrieval artefact ---- */
const ask = await get('/ask-index.json');
check(ask.status === 200, `/ask-index.json → 200 (got ${ask.status})`);
try {
  const parsed = JSON.parse(ask.body);
  check(parsed.schema === 1 && parsed.count > 0, `/ask-index.json is valid and non-empty (${parsed.count} docs)`);
} catch {
  check(false, '/ask-index.json parses as JSON');
}

/* ---- report ---- */
console.log(`\nProduction smoke test — ${ORIGIN}\n`);
console.log(`✓ ${pass.length} passed`);
for (const p of pass) console.log(`   · ${p}`);
if (fail.length) {
  console.log(`\n✗ ${fail.length} FAILED`);
  for (const f of fail) console.log(`   · ${f}`);
  process.exit(1);
}
console.log('\n✓ all production checks passed\n');
