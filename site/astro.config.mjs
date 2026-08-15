// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import remarkTerms from './src/lib/remark-terms.mjs';

// CHANGE ME if the domain ever changes. Used for the sitemap and share links.
const SITE = 'https://adeltechtalks.com';

export default defineConfig({
  site: SITE,
  // Every page is pre-rendered to static HTML by default — fast and cheap.
  // Individual pages opt into server rendering with `export const prerender = false`.
  // Only the public badge pages do that, because LinkedIn's crawler does not run
  // JavaScript: the visitor's name has to be in the HTML it fetches.
  output: 'static',
  // Declared explicitly. Cloudflare's build previously ran `astro add cloudflare`
  // on the fly and rewrote this file at build time, which meant the deployed
  // configuration was decided by whatever version happened to be current.
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [
    sitemap({
      // §26 — declare the English/Arabic pairs so Google indexes both rather
      // than treating /ar/* as near-duplicates and picking one. English keeps
      // the bare paths; every live URL stays exactly where it was.
      i18n: {
        defaultLocale: 'en',
        locales: { en: 'en', ar: 'ar' },
      },
      // Pages that should never appear in search results. Account pages hold
      // nothing public, and /playground/passport is a 301 kept only so links
      // shared before the move still land somewhere sensible.
      filter: (page) =>
        !/\/(login|profile|playground\/passport)\/$/.test(page),
    }),
  ],
  markdown: {
    // §11 — [[English term]] inside an Arabic Markdown body renders as a
    // bidi-isolated LTR run, exactly as it does in copy.ts. Without this the
    // brackets shipped to the reader.
    remarkPlugins: [remarkTerms],
  },
  build: { inlineStylesheets: 'auto' },
});
