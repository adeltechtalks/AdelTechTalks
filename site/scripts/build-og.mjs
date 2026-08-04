/* Builds the 1200×630 share cards that LinkedIn and Facebook display.
 *
 * Run:  npm run og
 * Output: public/og/<track-slug>.png  — commit these.
 *
 * Why a script and not runtime generation: rasterising per request inside a
 * Cloudflare Worker needs a WASM font renderer and an embedded font binary.
 * These cards are per-track, not per-person, so pre-rendering is simpler,
 * faster for the crawler, and cannot fail in production.
 *
 * The visitor's NAME still personalises the card — it goes in the og:title and
 * og:description, which is the line LinkedIn shows above the image.
 *
 * Colours are read from the design system's own token files so these cannot
 * drift from the site.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

/* ---- pull real values out of the token files ---- */
const colors = readFileSync(join(root, 'src/styles/tokens/colors.css'), 'utf8');
const token = (name, fallback) => {
  const m = colors.match(new RegExp(`--atc-${name}\\s*:\\s*([^;]+);`));
  return m ? m[1].trim() : fallback;
};

const MIST = token('mist', '#F8F6FF');
const INK900 = token('ink-900', '#1A1633');
const INK500 = token('ink-500', '#6B6390');
const INK100 = token('ink-100', '#E7E4F0');
const WHITE = '#FFFFFF';
/* mark.primary — the mark's own colour role, independent of the pillar. */
const MARK_PURPLE = token('purple-600', '#6C41E4');

const PILLAR = {
  ai: token('purple-600', '#6C41E4'),
  gadgets: token('blue-500', '#3E7BFA'),
  automation: token('pink-500', '#DB4A9B'),
  enterprise: token('teal-500', '#0E9384'),
  creator: token('gold-500', '#C8802E'),
};

/* The official mark — exact geometry, never redrawn. */
const MARK =
  'M 139.96 0.1 L 98.09 0 L 0 179.9 L 40.87 180 L 118.57 37.49 L 161.89 121.04 L 101.29 120.89 L 69.49 179.21 L 108.07 179.31 L 121.08 155.45 L 220.64 155.69 Z';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function card({ badge, product, pillar }) {
  const accent = PILLAR[pillar] ?? PILLAR.ai;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${MIST}"/>

  <!-- Origin Corner: 16% of the shorter side on the leading corner, 8% elsewhere (SH-04) -->
  <path d="M 80 180.8 A 100.8 100.8 0 0 1 180.8 80 L 1069.6 80 A 50.4 50.4 0 0 1 1120 130.4 L 1120 499.6 A 50.4 50.4 0 0 1 1069.6 550 L 130.4 550 A 50.4 50.4 0 0 1 80 499.6 Z"
        fill="${WHITE}" stroke="${INK100}" stroke-width="2"/>

  <!-- badge disc -->
  <circle cx="196" cy="250" r="60" fill="${accent}"/>
  <g transform="translate(166,220) scale(2.5)" fill="none" stroke="${WHITE}" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </g>

  <text x="292" y="216" font-family="Montserrat, Helvetica, Arial, sans-serif" font-size="26"
        font-weight="600" letter-spacing="2.2" fill="${accent}">BADGE EARNED</text>
  <text x="292" y="292" font-family="Montserrat, Helvetica, Arial, sans-serif" font-size="72"
        font-weight="800" letter-spacing="-1.4" fill="${INK900}">${esc(badge)}</text>
  <text x="292" y="340" font-family="Helvetica, Arial, sans-serif" font-size="28"
        fill="${INK500}">${esc(product)}</text>

  <line x1="140" y1="420" x2="1060" y2="420" stroke="${INK100}" stroke-width="2"/>

  <!-- wordmark -->
  <!-- LG v2.0: the mark takes its own colour role (purple 600), never the
       pillar accent. Tinting the mark to match context is a defect. -->
  <g transform="translate(140,455) scale(0.2)">
    <path d="${MARK}" fill="${MARK_PURPLE}"/>
  </g>
  <text x="196" y="490" font-family="Montserrat, Helvetica, Arial, sans-serif" font-size="30"
        font-weight="800" letter-spacing="-0.6" fill="${INK900}">AdelTechTalks</text>
  <text x="1060" y="490" text-anchor="end" font-family="Helvetica, Arial, sans-serif"
        font-size="24" fill="${INK500}">Play it at adeltechtalks.com</text>
</svg>`;
}

/* ---- read the tracks straight out of site.config.ts ---- */
const cfg = readFileSync(join(root, 'src/site.config.ts'), 'utf8');
const block = cfg.slice(cfg.indexOf('export const playground'));
const tracks = [];
const re = /slug:\s*'([^']+)'[\s\S]*?badge:\s*'([^']+)'/g;
const pillarRe = /pillar:\s*'([^']+)'/g;
const productRe = /product:\s*'([^']+)'/g;
let m;
const pillars = [...block.matchAll(pillarRe)].map((x) => x[1]);
const products = [...block.matchAll(productRe)].map((x) => x[1]);
let i = 0;
while ((m = re.exec(block))) {
  tracks.push({ slug: m[1], badge: m[2], pillar: pillars[i] ?? 'ai', product: products[i] ?? '' });
  i++;
}

const outDir = join(root, 'public/og');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

for (const t of tracks) {
  const svg = card(t);
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  writeFileSync(join(outDir, `${t.slug}.png`), png);
  console.log(`  ✓ public/og/${t.slug}.png   ${t.badge} · ${t.pillar}`);
}
console.log(`${tracks.length} share card(s) built.`);
