/* =============================================================================
   Which content collections actually have something published — at CONFIG time
   =============================================================================
   astro.config.mjs runs before Astro's content layer exists, so the sitemap's
   `filter` cannot call getCollection(). It still has to know whether /guides
   and /videos have anything in them, because an index page that is `noindex`
   must not simultaneously be advertised in the sitemap — that is a contradictory
   signal, and the whole point of the empty state is to keep thin pages out of
   search.

   So this reads the Markdown directly and parses the two frontmatter fields it
   needs. It is deliberately minimal: no YAML dependency, no schema, no draft
   semantics of its own beyond `draft: true`.

   IT MUST AGREE WITH lib/content.ts. Both answer the same question — "is there
   a published piece of this kind, in this language" — and they answer it from
   the same files with the same two rules:

     · a filename starting with _ is a template and never publishes
     · `draft: true` never publishes

   If the content model ever grows a third way to hide something, it goes in
   both places.
   ========================================================================== */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const CONTENT = join(dirname(fileURLToPath(import.meta.url)), '..', 'content');

/** Read one scalar out of the frontmatter block. Quotes optional. */
function field(frontmatter, name) {
  const match = frontmatter.match(new RegExp(`^${name}\\s*:\\s*(.+)$`, 'm'));
  return match ? match[1].trim().replace(/^['"]|['"]$/g, '') : undefined;
}

/**
 * Languages that have at least one published file in a collection folder.
 * Returns a Set, e.g. new Set(['en']).
 */
export function publishedLangs(folder) {
  const dir = join(CONTENT, folder);
  const langs = new Set();
  if (!existsSync(dir)) return langs;

  for (const name of readdirSync(dir)) {
    if (name.startsWith('_') || !name.endsWith('.md')) continue;
    const raw = readFileSync(join(dir, name), 'utf8');
    const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
    if (!frontmatter) continue;
    if (field(frontmatter, 'draft') === 'true') continue;
    langs.add(field(frontmatter, 'lang') ?? 'en');
  }
  return langs;
}

/**
 * A sitemap filter that drops an index page whose collection is empty in that
 * page's language. Everything else passes through untouched.
 *
 * `/guides/` → English, `/ar/guides/` → Arabic. The moment a guide is published
 * the folder stops being empty and the URL returns to the sitemap on its own.
 */
export function emptyIndexFilter(pairs) {
  const state = pairs.map(([segment, folder]) => [segment, publishedLangs(folder)]);

  return (page) => {
    const { pathname } = new URL(page);
    for (const [segment, langs] of state) {
      const lang = pathname.startsWith('/ar/') ? 'ar' : 'en';
      const expected = lang === 'ar' ? `/ar/${segment}/` : `/${segment}/`;
      if (pathname === expected && !langs.has(lang)) return false;
    }
    return true;
  };
}
