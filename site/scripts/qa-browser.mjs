/* =============================================================================
   Browser QA — the things a static scan cannot see
   =============================================================================
   Runs against a plain static server over dist/. Checks:

     · every key route loads with no console errors and no failed same-origin
       requests
     · Arabic pages actually lay out right-to-left (computed direction, and the
       header logo genuinely sitting on the right)
     · the Prompt Library copy button works, and degrades honestly when the
       clipboard is refused
     · the newsletter form is present, validates, and does not submit an
       invalid address
     · nothing regressed on the Playground, login and profile routes

   Not a replacement for a real device pass — it is one headless Chromium at two
   viewport sizes. It catches the regressions that matter between builds.
   ========================================================================== */

import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const PORT = 4321;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

const server = createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file = join(DIST, url);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) {
    res.writeHead(404, { 'content-type': 'text/html' });
    res.end(existsSync(join(DIST, '404.html')) ? readFileSync(join(DIST, '404.html')) : 'not found');
    return;
  }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  res.end(readFileSync(file));
});

const failures = [];
const notes = [];
const check = (ok, label) => {
  if (ok) notes.push(`  ✓ ${label}`);
  else failures.push(label);
};

/* The two pillar HUBS are always routed and are listed here. The two pillar
   STORY templates are not: a story only exists once its asset has landed (a
   real screenshot for a build, a real photograph for a gear test), so there is
   no fixed story URL to name. `PILLAR_STORIES` below discovers whatever has
   actually been published and sweeps that — zero stories is a correct state
   and passes, one is checked like any other route. */
const ROUTES = [
  /* No guide detail route is listed: the Phase 1 demo guide is held back as a
     draft, so /guides renders its designed empty state until Adel writes one. */
  '/', '/learn/', '/series/vibe-coding/', '/guides/', '/vibe-coding/', '/gear/',
  '/use-cases/', '/use-cases/gearnest/', '/prompts/', '/prompts/spec-before-you-build/',
  '/videos/', '/topics/', '/topics/building/', '/about/', '/newsletter/',
  '/playground/', '/login/', '/profile/', '/work-with-me/', '/contact/',
  '/ar/', '/ar/learn/', '/ar/series/vibe-coding/', '/ar/guides/',
  '/ar/use-cases/', '/ar/use-cases/gearnest-ar/', '/ar/prompts/',
  '/ar/prompts/spec-before-you-build-ar/', '/ar/videos/', '/ar/topics/',
  '/ar/about/', '/ar/newsletter/', '/ar/vibe-coding/', '/ar/gear/',
];

/* Whatever pillar stories are actually published, in both languages, found by
   walking dist/ rather than hard-coded — so this keeps working the day the
   first real build or gear test goes up, and stays silent until then. */
function findPillarStories() {
  const out = [];
  const walk = (dir, base) => {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (!statSync(full).isDirectory()) continue;
      if (existsSync(join(full, 'index.html'))) out.push(`${base}${name}/`);
      walk(full, `${base}${name}/`);
    }
  };
  walk(join(DIST, 'vibe-coding'), '/vibe-coding/');
  walk(join(DIST, 'gear'), '/gear/');
  walk(join(DIST, 'ar', 'vibe-coding'), '/ar/vibe-coding/');
  walk(join(DIST, 'ar', 'gear'), '/ar/gear/');
  return out;
}
ROUTES.push(...findPillarStories());

await new Promise((r) => server.listen(PORT, r));

/* Use whatever Chromium is already on the machine when the pinned Playwright
   build is not the one installed — downloading a second browser to run a QA
   pass is not a reasonable cost. Falls back to Playwright's own resolution. */
function findChromium() {
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH;
  if (!root || !existsSync(root)) return undefined;
  for (const dir of readdirSync(root)) {
    if (!dir.startsWith('chromium-')) continue;
    const candidate = join(root, dir, 'chrome-linux', 'chrome');
    if (existsSync(candidate)) return candidate;
  }
  return undefined;
}

const executablePath = findChromium();
const browser = await chromium.launch(executablePath ? { executablePath } : {});

try {
  /* ---- 1. every route loads clean ---- */
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    const problems = [];
    page.on('console', (m) => {
      if (m.type() !== 'error') return;
      /* "Failed to load resource" is the console's echo of a network failure,
         and network failures are judged by origin in the handler below. Google
         Fonts and YouTube thumbnails are unreachable from this sandbox and are
         not a defect in the page. */
      if (/Failed to load resource/i.test(m.text())) return;
      problems.push(`console: ${m.text()}`);
    });
    page.on('requestfailed', (r) => {
      /* Google Fonts and YouTube thumbnails are not reachable from this
         sandbox. Only same-origin failures are ours. */
      if (r.url().startsWith(`http://localhost:${PORT}`)) problems.push(`request: ${r.url()}`);
    });

    const response = await page.goto(`http://localhost:${PORT}${route}`, {
      waitUntil: 'domcontentloaded',
    });
    check(response?.status() === 200, `${route} → 200 (got ${response?.status()})`);
    if (problems.length) failures.push(`${route}: ${problems.join(' | ')}`);
    await page.close();
  }

  /* ---- 2. Arabic is genuinely RTL, not just tagged rtl ---- */
  for (const route of ['/ar/', '/ar/learn/', '/ar/series/vibe-coding/', '/ar/prompts/spec-before-you-build-ar/']) {
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' }).catch(() => {});
    const direction = await page.evaluate(() => getComputedStyle(document.body).direction);
    check(direction === 'rtl', `${route} computed direction is rtl (got ${direction})`);

    /* The logo has to sit on the RIGHT half of an RTL header. If a layout used
       physical `left`/`margin-left` instead of logical properties, this is
       where it shows up. */
    const box = await page.locator('.hdr__logo').boundingBox();
    const width = await page.evaluate(() => window.innerWidth);
    check(box !== null && box.x > width / 2, `${route} header logo is on the right in RTL`);

    /* No horizontal overflow — the classic RTL failure. */
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    check(!overflow, `${route} has no horizontal overflow`);
    await page.close();
  }

  /* English stays LTR with the logo on the left. */
  {
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' }).catch(() => {});
    const direction = await page.evaluate(() => getComputedStyle(document.body).direction);
    check(direction === 'ltr', `/ computed direction is ltr (got ${direction})`);
    const box = await page.locator('.hdr__logo').boundingBox();
    const width = await page.evaluate(() => window.innerWidth);
    check(box !== null && box.x < width / 2, '/ header logo is on the left in LTR');
    await page.close();
  }

  /* ---- 3. the prompt copy button ---- */
  {
    const granted = await browser.newContext({
      permissions: ['clipboard-read', 'clipboard-write'],
      viewport: { width: 1280, height: 900 },
    });
    const page = await granted.newPage();
    await page.goto(`http://localhost:${PORT}/prompts/spec-before-you-build/`, {
      waitUntil: 'domcontentloaded',
    });
    const before = await page.locator('[data-copy-label]').innerText();
    await page.locator('[data-copy]').click();
    await page.waitForTimeout(300);
    const after = await page.locator('[data-copy-label]').innerText();
    check(before !== after, `copy button changes its label (${before} → ${after})`);
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    check(
      clip.includes('turn a rough product idea into a spec'),
      'clipboard holds the prompt text'
    );
    const live = await page.locator('[data-copy-status]').innerText();
    check(live.trim().length > 0, 'copy result is announced in a live region');
    await granted.close();
  }

  /* Refused clipboard must fail honestly rather than silently. */
  {
    const denied = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await denied.newPage();
    await page.goto(`http://localhost:${PORT}/prompts/cut-the-scope/`, {
      waitUntil: 'domcontentloaded',
    });
    await page.evaluate(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: () => Promise.reject(new Error('denied')) },
        configurable: true,
      });
    });
    await page.locator('[data-copy]').click();
    await page.waitForTimeout(300);
    const label = await page.locator('[data-copy-label]').innerText();
    check(/select/i.test(label), `refused clipboard tells the reader what to do (got "${label}")`);
    await denied.close();
  }

  /* ---- 4. newsletter still works and still validates ---- */
  for (const [route, lang] of [['/newsletter/', 'en'], ['/ar/newsletter/', 'ar']]) {
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded' });
    const input = page.locator('input[type="email"]').first();
    check((await input.count()) > 0, `${route} has an email input`);
    const honeypot = await page.locator('form input[name="company"][tabindex="-1"]').count();
    check(honeypot > 0, `${route} still has the honeypot instead of a captcha`);
    await input.fill('not-an-email');
    await page.locator('form button[type="submit"]').first().click();
    await page.waitForTimeout(400);
    const body = await page.locator('body').innerText();
    check(
      /doesn’t look like|لا يبدو/.test(body),
      `${route} rejects an invalid address client-side (${lang})`
    );
    await page.close();
  }

  /* ---- 5. account + playground routes still render their real content ---- */
  {
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${PORT}/playground/`, { waitUntil: 'domcontentloaded' });
    check((await page.locator('h1').count()) === 1, '/playground/ has one h1');
    await page.goto(`http://localhost:${PORT}/login/`, { waitUntil: 'domcontentloaded' });
    check((await page.locator('h1').count()) === 1, '/login/ has one h1');
    await page.goto(`http://localhost:${PORT}/profile/`, { waitUntil: 'domcontentloaded' });
    check((await page.locator('h1').count()) === 1, '/profile/ has one h1');
    await page.close();
  }

  /* ---- 6. mobile: the burger opens and Escape closes it ---- */
  {
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await mobile.newPage();
    await page.goto(`http://localhost:${PORT}/ar/learn/`, { waitUntil: 'domcontentloaded' });
    const burger = page.locator('.hdr__burger');
    check(await burger.isVisible(), 'mobile burger is visible at 390px');
    await burger.click();
    check(await page.locator('.hdr__mobile').isVisible(), 'mobile menu opens');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    check(!(await page.locator('.hdr__mobile').isVisible()), 'Escape closes the mobile menu');
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    check(!overflow, 'no horizontal overflow on mobile Arabic');
    await mobile.close();
  }

  /* ---- 6b. IA v2.0: the homepage renders the frozen section order ---------
     The order is an argument and it runs in one direction, so getting it wrong
     is a content bug rather than a layout one — invisible to every other check
     here. Each section is identified by the id its heading carries, and the
     hero is identified by its own landmark, so this reads the DOM order rather
     than trusting the source order of an import list.

     Sections 2 and 3 collapse when nothing is published, but they collapse to
     a HEADER plus an honest line — the heading and its id are always there —
     so the expected order is the same in both states. */
  {
    const EXPECTED = ['rw-title', 'gs-title', 'ls-title', 'ps-title', 'as-title'];
    for (const route of ['/', '/ar/']) {
      const page = await ctx.newPage();
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded' });

      const order = await page.evaluate((ids) => {
        const found = [...document.querySelectorAll('[id]')]
          .map((el) => el.id)
          .filter((id) => ids.includes(id));
        return found;
      }, EXPECTED);
      check(
        order.join(' → ') === EXPECTED.join(' → '),
        `${route} homepage is in the frozen section order (got ${order.join(' → ') || 'nothing'})`
      );

      /* The hero comes first, above all five. */
      const heroFirst = await page.evaluate(() => {
        const hero = document.querySelector('.hero, [data-hero]');
        const first = document.querySelector('#rw-title');
        if (!hero || !first) return false;
        return hero.compareDocumentPosition(first) & Node.DOCUMENT_POSITION_FOLLOWING;
      });
      check(Boolean(heroFirst), `${route} hero sits above the pillar sections`);

      /* The closing section carries a working subscribe form — the same
         component and the same Supabase path as /newsletter. */
      check(
        (await page.locator('[data-nl-form][data-placement="home-close"]').count()) === 1,
        `${route} closing section has exactly one subscribe form`
      );
      await page.close();
    }
  }

  /* ---- 6c. the pillar surfaces survive both directions at both sizes ------
     The hubs and the story templates are the widest new layouts on the site —
     a graphite panel with a browser frame in it, and a story row with a fixed
     thumbnail column. Both are exactly the shape that overflows in RTL. Story
     URLs are discovered, so this stays correct whether or not anything is
     published yet. */
  {
    const surfaces = ['/vibe-coding/', '/gear/', '/ar/vibe-coding/', '/ar/gear/', ...findPillarStories()];
    const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
    for (const route of surfaces) {
      for (const [context, size] of [[ctx, 'desktop'], [mobile, 'mobile']]) {
        const page = await context.newPage();
        await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded' });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
        );
        check(!overflow, `${route} has no horizontal overflow (${size})`);
        await page.close();
      }
    }
    await mobile.close();
  }

  /* ---- 7. TY v2.0: the Arabic display face obeys its own rules ------------
     KO Ghorab ships ONE style, is never letter-spaced, and never renders below
     24px. Those are the three ways an Arabic display face gets quietly abused —
     a Latin weight inherited from a shared rule becomes a synthesised bold, a
     Latin `letter-spacing` severs the connecting strokes, and a card title
     inherits the display token at 17px. None of the three throws, and none of
     them is obvious in a screenshot unless you already know the script.

     Checked on the rendered page rather than in the CSS, because the failure is
     always a cascade accident rather than a wrong declaration. */
  {
    const routes = [
      '/ar/', '/ar/learn/', '/ar/about/', '/ar/series/vibe-coding/', '/ar/prompts/',
      '/ar/newsletter/', '/ar/topics/', '/ar/use-cases/',
    ];
    const page = await ctx.newPage();
    const violations = [];
    for (const route of routes) {
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded' });
      const found = await page.evaluate(() => {
        const out = new Set();
        for (const el of document.querySelectorAll('h1,h2,h3,h4,p,span,li,a,blockquote')) {
          const cs = getComputedStyle(el);
          if (!/KO Ghorab/.test(cs.fontFamily)) continue;
          /* screen-reader-only and hidden text is never rendered */
          if (el.classList.contains('sr-only') || el.closest('.sr-only')) continue;
          if (!el.getClientRects().length) continue;
          const name = (el.className?.toString?.() || el.tagName).slice(0, 30);
          if (Number(cs.fontWeight) !== 400) out.add(`${name} weight=${cs.fontWeight}`);
          if (parseFloat(cs.fontSize) < 24) out.add(`${name} size=${cs.fontSize}`);
          if (cs.letterSpacing !== 'normal' && Math.abs(parseFloat(cs.letterSpacing)) > 0.01)
            out.add(`${name} tracking=${cs.letterSpacing}`);
        }
        return [...out];
      });
      if (found.length) violations.push(`${route} ${found.join(', ')}`);
    }
    check(
      violations.length === 0,
      violations.length === 0
        ? `Arabic display is Ghorab at one weight, ≥24px, untracked on ${routes.length} routes`
        : `Arabic display breaks TY v2.0 — ${violations.join(' | ')}`
    );
    await page.close();
  }

  await ctx.close();
} finally {
  await browser.close();
  server.close();
}

console.log(`\nBrowser QA\n${notes.join('\n')}\n`);
if (failures.length) {
  console.log(`✗  ${failures.length} failure${failures.length === 1 ? '' : 's'}`);
  for (const f of failures) console.log(`   · ${f}`);
  console.log('');
  process.exit(1);
}
console.log('✓  all browser checks passed\n');
