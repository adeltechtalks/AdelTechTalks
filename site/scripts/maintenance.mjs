/* =============================================================================
   Maintenance mode — reduce the built site to one Coming Soon page
   =============================================================================
   Runs last in `npm run build`. When maintenance.config.mjs has MAINTENANCE set
   to false this script prints one line and exits, so a normal build is bit-for-bit
   what it always was.

   WHAT IT TOUCHES: dist/ only. dist/ is gitignored build output, regenerated from
   scratch on every build. No page, component, content entry, style, API route or
   Supabase file is read, moved or deleted by this script. Flipping the switch back
   restores the whole site on the next build — there is nothing to recover.

   WHAT IT PRODUCES
     dist/index.html        the holding page, promoted from /coming-soon
     dist/robots.txt        Disallow: / — nothing crawls a temporary page
     dist/_headers          X-Robots-Tag on every response, as a second signal
     dist/_worker.js/…      a ~20-line Worker that 302s every other URL to /
     dist/logo/…            the two favicon files the page references
     dist/.assetsignore     kept from postbuild.mjs, keeps server code off the CDN

   Everything else that `astro build` emitted is removed from the OUTPUT, which is
   what makes the old URLs unreachable: there is no longer any asset behind
   /learn, /gear, /playground or any other route, so every one of them falls
   through to the Worker and is redirected.

   WHY A WORKER RATHER THAN A _redirects FILE
   A redirect rule with a splat would also match `/` and loop, and rules written
   out one route at a time would silently miss the dynamic content routes. The
   Worker is explicit: `/` is served from assets, everything else is a 302. It is
   also the mechanism already configured in wrangler.jsonc, so no hosting
   configuration changes.

   WHY 302 AND NOT 301
   301 is cached by browsers and intermediaries, sometimes indefinitely. A visitor
   who hit /learn during the holding period could keep being redirected long after
   the real site is back. 302 is the correct status for a temporary state.
   ========================================================================== */

import { readFileSync, writeFileSync, existsSync, rmSync, mkdirSync, renameSync, readdirSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MAINTENANCE, HOLDING_ROUTE, KEEP_PATHS } from '../maintenance.config.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

if (!MAINTENANCE) {
  /* The holding page is never a public URL in either mode. Here it is simply
     dropped from the output, so turning maintenance off restores the real site
     without leaving /coming-soon reachable behind it. It stays in src/, ready
     for the next time. (It is excluded from the sitemap in astro.config.mjs.) */
  const stray = join(dist, HOLDING_ROUTE);
  if (existsSync(stray)) {
    rmSync(stray, { recursive: true, force: true });
    console.log(`  · maintenance mode OFF — full site built, /${HOLDING_ROUTE} withheld`);
  } else {
    console.log('  · maintenance mode OFF — full site built, nothing intercepted');
  }
  process.exit(0);
}

if (!existsSync(dist)) {
  console.error('  ✗ dist/ does not exist. Run `astro build` first.');
  process.exit(1);
}

/* ---- 1. Find the holding page Astro built -------------------------------- */
const holdingDir = join(dist, HOLDING_ROUTE);
const holdingFile = join(holdingDir, 'index.html');
if (!existsSync(holdingFile)) {
  console.error(`  ✗ expected ${relative(root, holdingFile)} to exist.`);
  console.error(`    src/pages/${HOLDING_ROUTE}.astro must build before it can be promoted.`);
  process.exit(1);
}
const holdingHtml = readFileSync(holdingFile, 'utf8');

/* Keep whatever build assets the page actually references, and nothing else.
   The page inlines its own CSS, so in practice this is usually empty — but
   reading it off the HTML means it stays correct if that ever changes. */
const referenced = new Set(
  [...holdingHtml.matchAll(/(?:href|src)="\/(_astro\/[^"]+)"/g)].map((m) => m[1]),
);

const keep = new Set(['index.html', 'robots.txt', '_headers', ...KEEP_PATHS, ...referenced]);

/* Counted before the sweep so the report can state the real figure. Counting
   only the files deleted one by one would undercount badly: whole directories
   are removed in a single call. */
function countFiles(dir) {
  let n = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    n += e.isDirectory() ? countFiles(join(dir, e.name)) : 1;
  }
  return n;
}
const filesBefore = countFiles(dist);
const pagesBefore = (function pages(dir) {
  let n = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) n += pages(join(dir, e.name));
    else if (e.name.endsWith('.html')) n += 1;
  }
  return n;
})(dist);

/* ---- 2. Promote it to / -------------------------------------------------- */
/* Written before the sweep, so a failure mid-sweep still leaves a valid `/`. */
writeFileSync(join(dist, 'index.html'), holdingHtml);

/* ---- 3. Remove every other public path from the output ------------------- */
/* Walk the tree and delete anything not in `keep`. Directories that end up
   empty are removed too, so dist/ has no stray husks. */

function sweep(dir) {
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, name.name);
    const rel = relative(dist, abs).split('\\').join('/');

    /* The Worker directory is rebuilt wholesale in step 4. */
    if (rel === '_worker.js') {
      rmSync(abs, { recursive: true, force: true });
      continue;
    }

    if (name.isDirectory()) {
      /* Descend only if something inside might be kept. */
      if ([...keep].some((k) => k.startsWith(rel + '/'))) {
        sweep(abs);
        if (readdirSync(abs).length === 0) rmSync(abs, { recursive: true, force: true });
      } else {
        rmSync(abs, { recursive: true, force: true });
      }
      continue;
    }

    if (!keep.has(rel)) rmSync(abs, { force: true });
  }
}
sweep(dist);

/* ---- 4. The Worker that redirects everything else ------------------------ */
/* Workers serves a matching static asset first and only runs this when nothing
   matches — so `/` never reaches it. The explicit `/` check is belt and braces
   in case asset precedence is ever configured differently. */
mkdirSync(join(dist, '_worker.js'), { recursive: true });
writeFileSync(
  join(dist, '_worker.js', 'index.js'),
  `/* Generated by scripts/maintenance.mjs — do not edit. See maintenance.config.mjs. */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/' || url.pathname === '/index.html') {
      return env.ASSETS.fetch(request);
    }

    const home = new URL('/', url);
    return new Response(null, {
      status: 302,
      headers: {
        Location: home.toString(),
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  },
};
`,
);

/* ---- 5. Crawler instructions -------------------------------------------- */
/* The sitemap integration in astro.config.mjs is untouched; its OUTPUT was just
   swept away, so no sitemap is exposed while this is up. It returns on the next
   non-maintenance build. */
writeFileSync(
  join(dist, 'robots.txt'),
  `# Temporary holding page. The site is not open for indexing right now.\nUser-agent: *\nDisallow: /\n`,
);

writeFileSync(
  join(dist, '_headers'),
  `/*\n  X-Robots-Tag: noindex, nofollow\n`,
);

/* ---- 6. Report ---------------------------------------------------------- */
const remaining = [];
(function list(dir) {
  for (const n of readdirSync(dir, { withFileTypes: true })) {
    const abs = join(dir, n.name);
    if (n.isDirectory()) list(abs);
    else remaining.push(relative(dist, abs).split('\\').join('/'));
  }
})(dist);

console.log('  ✓ MAINTENANCE MODE — public output reduced to the Coming Soon page');
console.log(
  `    ${pagesBefore} pages built, ${pagesBefore - 1} withdrawn from the public output`,
);
console.log(
  `    ${filesBefore} files in dist/ before, ${remaining.length} after (source untouched)`,
);
console.log('    every withdrawn URL → 302 /');
for (const f of remaining.sort()) console.log(`      · ${f}`);
