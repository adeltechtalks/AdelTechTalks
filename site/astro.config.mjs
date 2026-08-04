// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// CHANGE ME: set this to your real domain once it is connected.
// It is used for the sitemap and for social share links.
const SITE = 'https://adeltechtalks.com';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});
