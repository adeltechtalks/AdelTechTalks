/* =============================================================================
   MAINTENANCE MODE — the one switch that takes the public site offline
   =============================================================================
   `true`  → the build still renders all 52 pages, then `scripts/maintenance.mjs`
             reduces dist/ to a single Coming Soon page and installs a Worker
             that 302s every other URL back to `/`.
   `false` → the build is exactly what it always was. Nothing is intercepted.

   NOTHING IS DELETED BY THIS SWITCH. Every page, component, content entry, CMS
   collection, API route and Supabase binding stays in the repository untouched.
   Maintenance mode only edits the BUILD OUTPUT (dist/, which is gitignored), so
   restoring the full site is this one word and a deploy — no file recovery, no
   git surgery.

   TO RESTORE THE FULL SITE
     1. Set MAINTENANCE to false here.
     2. Delete src/pages/coming-soon.astro (optional — see the note there).
     3. Commit and push to main. Cloudflare's Git integration redeploys.

   The exact production state from before this went up is preserved on the
   remote branch `claude/backup-prod-pre-coming-soon`.
   ========================================================================== */

export const MAINTENANCE = true;

/* The route that becomes the site's only page. Built by Astro like any other
   page, then promoted to dist/index.html and removed from its own path, so
   /coming-soon is never publicly reachable either. */
export const HOLDING_ROUTE = 'coming-soon';

/* Paths kept in dist/ verbatim, because the holding page references them.
   Everything else under dist/ is removed from the deployable output. */
export const KEEP_PATHS = [
  '.assetsignore',            // written by postbuild; keeps server code off the CDN
  'logo/favicon-32.png',
  'logo/apple-touch-icon.png',
];
