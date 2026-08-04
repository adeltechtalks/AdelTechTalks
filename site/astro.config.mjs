// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

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
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});
