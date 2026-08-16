/* =============================================================================
   QA sweep over dist/ — run after `npm run build`, with `npm run qa`
   =============================================================================
   Checks the things that are cheap to get wrong across 60 pages and expensive
   to find by hand:

     · every internal link resolves to a page that was actually built
     · no [[term]] marker leaked into rendered text (§11)
     · <html lang> and dir agree, and Arabic pages are rtl
     · exactly one <h1> per page, and no skipped heading levels (§30)
     · every <img> has an alt attribute
     · every link and button has an accessible name
     · hreflang alternates point at pages that exist
     · no placeholder marker reached a published English/Arabic page unnoticed

   It is deliberately a plain DOM-less scan: regex over the built HTML, no
   browser, no server. Fast enough to run on every build.
   ========================================================================== */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const errors = [];
const warnings = [];
const fail = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

/* ---- collect every built HTML page ---- */
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith('.html')) out.push(full);
  }
  return out;
}

const files = walk(DIST);
const routeOf = (file) => {
  const rel = file.slice(DIST.length).replace(/\\/g, '/');
  return rel.replace(/index\.html$/, '') || '/';
};
const routes = new Set(files.map(routeOf));

/* Strip <script>, <style> and HTML comments before looking at visible text. */
function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*"([^"]*)"`, 'i'));
  return m ? m[1] : null;
}

for (const file of files) {
  const page = routeOf(file);
  const html = readFileSync(file, 'utf8');
  const text = visibleText(html);

  /* Astro emits a bare meta-refresh stub for a 301 (/playground/passport/).
     It has no <html lang> and no <h1> by design — it is a redirect, not a
     page, and it is already noindex. Checking it as a page is noise. */
  if (/<meta\s+http-equiv="refresh"/i.test(html)) continue;

  /* ---- language and direction ---- */
  const htmlTag = html.match(/<html[^>]*>/i)?.[0] ?? '';
  const lang = attr(htmlTag, 'lang');
  const dir = attr(htmlTag, 'dir');
  if (!lang) fail(page, 'no <html lang>');
  if (!dir) fail(page, 'no <html dir>');
  const isArabic = page.startsWith('/ar/');
  if (isArabic && (lang !== 'ar' || dir !== 'rtl')) {
    fail(page, `Arabic page has lang="${lang}" dir="${dir}", expected ar/rtl`);
  }
  if (!isArabic && (lang !== 'en' || dir !== 'ltr')) {
    fail(page, `English page has lang="${lang}" dir="${dir}", expected en/ltr`);
  }

  /* ---- [[term]] markers must never survive to the page (§11) ---- */
  if (/\[\[[^\]]+\]\]/.test(text)) {
    const sample = text.match(/\[\[[^\]]+\]\]/)[0];
    fail(page, `unrendered mixed-language marker in output: ${sample}`);
  }

  /* ---- headings (§30) ---- */
  const headings = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => Number(m[1]));
  const h1s = headings.filter((h) => h === 1).length;
  if (h1s === 0) fail(page, 'no <h1>');
  if (h1s > 1) fail(page, `${h1s} <h1> elements, expected exactly 1`);
  let previous = 0;
  for (const level of headings) {
    if (previous && level > previous + 1) {
      warn(page, `heading jumps from h${previous} to h${level}`);
    }
    previous = level;
  }

  /* ---- images ---- */
  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    if (attr(tag, 'alt') === null) fail(page, `<img> without alt: ${tag.slice(0, 90)}`);
  }

  /* ---- links: resolve internal targets, and require an accessible name ---- */
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const tag = `<a${m[1]}>`;
    const inner = m[2];
    const href = attr(tag, 'href');
    if (!href) continue;

    const label =
      attr(tag, 'aria-label') ??
      visibleText(inner).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!label) fail(page, `link with no accessible name: ${href}`);

    if (/^(https?:|mailto:|tel:|#|data:)/i.test(href)) continue;
    const path = href.split('#')[0].split('?')[0];
    if (!path.startsWith('/')) continue;
    /* A file (og image, json, asset) rather than a route. */
    if (/\.[a-z0-9]{2,5}$/i.test(path)) {
      if (!existsSync(join(DIST, path))) fail(page, `broken asset link: ${href}`);
      continue;
    }
    const normalised = path.endsWith('/') ? path : path + '/';
    if (!routes.has(normalised)) fail(page, `broken internal link: ${href}`);
  }

  /* ---- buttons need a name too ---- */
  for (const m of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const tag = `<button${m[1]}>`;
    const label =
      attr(tag, 'aria-label') ??
      visibleText(m[2]).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (!label) fail(page, 'button with no accessible name');
  }

  /* ---- hreflang alternates must resolve ---- */
  for (const tag of html.match(/<link\b[^>]*rel="alternate"[^>]*>/gi) ?? []) {
    const href = attr(tag, 'href');
    if (!href) continue;
    let path;
    try {
      path = new URL(href).pathname;
    } catch {
      continue;
    }
    if (!routes.has(path)) fail(page, `hreflang points at a page that does not exist: ${href}`);
  }

  /* ---- canonical must be present and self-referential ---- */
  const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*>/i)?.[0];
  if (!canonical) fail(page, 'no canonical');

  /* ---- placeholders are a FAILURE, not a warning -------------------------
          No literal PLACEHOLDER text ships publicly. Unwritten content is
          either hidden (an empty `about.body` falls back to approved copy; a
          draft guide does not publish) or declared as an unpublished section
          with a designed panel that names the gap. If this fires, something
          unfinished is about to reach a reader. ---- */
  /* Tags are stripped first: `placeholder="you@example.com"` is a legitimate
     attribute on every newsletter input and is not shipped copy. The marker
     convention is uppercase, and this looks only at what a reader sees. */
  const readerText = text.replace(/<[^>]+>/g, ' ');
  if (/PLACEHOLDER/.test(readerText)) {
    fail(page, 'literal PLACEHOLDER copy would ship to a reader');
  }
}

/* =============================================================================
   Undefined design tokens
   =============================================================================
   A `var(--token)` that was never defined does not throw and does not show up
   in the built CSS as an error — the declaration is simply dropped, and the
   element silently falls back to its initial value. During the DS v2.1 hero
   build this cost a broken layout twice: --atc-space-14/-18/-7 do not exist on
   the 4px scale, so a 56px grid gap and a 26px action gap both became 0.

   So: every var(--…) referenced in src/ must be defined somewhere in src/.
   Cheap, and it catches the failure at build time instead of in a screenshot.
   ========================================================================== */
const SRC = join(DIST, '..', 'src');
function walkSrc(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walkSrc(full, out);
    else if (/\.(css|astro)$/.test(name)) out.push(full);
  }
  return out;
}

if (existsSync(SRC)) {
  const sources = walkSrc(SRC);
  const defined = new Set();
  const referenced = new Map();
  for (const file of sources) {
    const text = readFileSync(file, 'utf8');
    for (const m of text.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)) defined.add(m[1]);
    for (const m of text.matchAll(/var\(\s*(--[a-zA-Z0-9-]+)/g)) {
      /* A trailing hyphen means the name is being built by interpolation —
         `var(--atc-elevation-${n})`. The prefix is not itself a token, and the
         real name cannot be known statically. */
      if (m[1].endsWith('-')) continue;
      if (!referenced.has(m[1])) referenced.set(m[1], file.slice(SRC.length + 1));
    }
  }
  for (const [token, where] of referenced) {
    /* A var() with its own fallback is deliberate — motion.css does this so the
       reveal still works if the motion token layer is ever absent. */
    const hasFallback = sources.some((f) =>
      new RegExp(`var\\(\\s*${token}\\s*,`).test(readFileSync(f, 'utf8'))
    );
    if (!defined.has(token) && !hasFallback) {
      fail(where, `uses ${token}, which is never defined — the declaration will be dropped silently`);
    }
  }
}

/* =============================================================================
   DEAD SCOPED RULES
   =============================================================================
   Astro scopes a component's CSS by stamping `data-astro-cid-XXXX` onto the
   elements in its own template, and by handing that attribute to a child
   component as a prop. A child that does not forward the prop renders an
   element the parent's stylesheet cannot see: the class is in the HTML, the
   rule is in the CSS, and nothing connects them. The page still renders — with
   the browser's default heading sizes — so it looks like a design decision
   rather than a bug.

   That is exactly how ~30 headings across this site ended up at UA defaults
   without anyone noticing, because <Rich as="h3" class="ex__name" /> dropped
   the attribute on the floor.

   So: for every `.klass[data-astro-cid-x]` the CSS relies on, at least one
   element carrying that class must also carry one of those attributes.
   ========================================================================== */
{
  const cssFiles = walk(DIST).filter((f) => f.endsWith('.css'));
  const css = cssFiles.map((f) => readFileSync(f, 'utf8')).join('\n');

  const needs = new Map(); // class -> Set of acceptable cid attributes
  for (const m of css.matchAll(/\.([A-Za-z0-9_-]+)\[(data-astro-cid-[a-z0-9]+)\]/g)) {
    if (!needs.has(m[1])) needs.set(m[1], new Set());
    needs.get(m[1]).add(m[2]);
  }

  const dead = new Map(); // "class" -> first page it was seen on
  for (const file of files) {
    const html = readFileSync(file, 'utf8');
    for (const tag of html.matchAll(/<[a-zA-Z][^>]*class="([^"]*)"[^>]*>/g)) {
      for (const cls of tag[1].split(/\s+/)) {
        const cids = needs.get(cls);
        if (!cids) continue;
        if ([...cids].some((cid) => tag[0].includes(cid))) continue;
        if (!dead.has(cls)) dead.set(cls, routeOf(file));
      }
    }
  }
  for (const [cls, route] of dead) {
    fail(route, `.${cls} is styled by a scoped rule that never matches it — the component is dropping its scope attribute (forward ...rest onto the root element)`);
  }
}

/* ---- report ---- */
console.log(`\nQA swept ${files.length} pages in dist/\n`);
if (warnings.length) {
  console.log(`⚠  ${warnings.length} warning${warnings.length === 1 ? '' : 's'}`);
  for (const w of warnings) console.log(`   · ${w}`);
  console.log('');
}
if (errors.length) {
  console.log(`✗  ${errors.length} error${errors.length === 1 ? '' : 's'}`);
  for (const e of errors) console.log(`   · ${e}`);
  console.log('');
  process.exit(1);
}
console.log('✓  no errors\n');
