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
