/* Wrangler uploads everything in dist/ as public static assets. Astro also puts
 * the compiled server code in dist/_worker.js. Without this file, that server
 * bundle would be served publicly — wrangler refuses to deploy rather than let
 * that happen silently.
 *
 * .assetsignore tells the asset uploader to skip it. _routes.json is Astro's
 * own routing manifest and has no business being fetchable either.
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
writeFileSync(join(dist, '.assetsignore'), '_worker.js\n_routes.json\n');
console.log('  ✓ dist/.assetsignore written (keeps server code off the public CDN)');
