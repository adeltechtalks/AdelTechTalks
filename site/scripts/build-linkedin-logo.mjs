/* Builds the AdelTechTalks logo at LinkedIn Page size (§ LG v2.0 · SH v1.0).
 *
 * LinkedIn asks for a SQUARE page logo — 300 × 300 px, PNG, under 8 MB. It
 * then redraws that one file everywhere: ~48px beside a feed post, ~32px in a
 * comment, ~130px on the page header. So the tile has to survive being shrunk
 * to a thumbnail, which is what decides the variants below.
 *
 *   linkedin-logo-300.png          PRIMARY. White mark on Purple 600.
 *                                  Purple 600 is the LG v2.0 default mark
 *                                  colour, and a solid tile has no floor — it
 *                                  reads at 32px as well as at 300px.
 *   linkedin-logo-impact-300.png   Dark Impact alternative: the three-stop
 *                                  brand gradient on Impact Navy, the same
 *                                  lockup as the app icon.
 *                                  ⚠️ --atc-mark-min-gradient-size is 40px.
 *                                  Inside this tile the mark is 62% of the
 *                                  canvas, so the gradient falls under its
 *                                  floor once LinkedIn draws the tile below
 *                                  ~65px — i.e. in the feed. Use it only if
 *                                  the page is being run as a Dark Impact
 *                                  property and small-size fusing is accepted.
 *   linkedin-logo-light-300.png    Purple 600 mark on white, for a light
 *                                  ground. Loses its edges against LinkedIn's
 *                                  own white chrome — alternative, not default.
 *
 * The 400px twins are the same artwork rendered larger: LinkedIn re-encodes
 * whatever you give it, and uploading above the minimum keeps the header crisp.
 *
 * GEOMETRY IS NOT REDRAWN HERE. The path is read out of
 * public/logo/atc-mark-currentcolor.svg so this script cannot drift from the
 * mark, and the tile is laid out on the app icon's own proportions: the mark
 * is 62% of the canvas width, optically centred. That leaves 74px of clear
 * space above and below and 57px either side at 300px — comfortably past the
 * 23%-of-mark-height minimum (35px), so the LG clear-space rule holds.
 *
 * Colours are read out of the token files. Nothing here is a literal hex
 * except pure white.
 *
 * Run:  npm run logo:linkedin
 * Out:  public/logo/linkedin/*.svg and *.png  — commit them.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const tokens = readFileSync(join(root, 'src/styles/tokens/colors.css'), 'utf8');
const token = (name, fallback) => {
  const m = tokens.match(new RegExp(`--atc-${name}\\s*:\\s*(#[0-9A-Fa-f]{3,8})`));
  return m ? m[1].trim() : fallback;
};

const PURPLE_600 = token('purple-600', '#6C41E4');
const IMPACT_NAVY = token('impact-navy', '#0B0918');
const IMPACT_BLUE = token('impact-blue', '#2B6CFF');
const IMPACT_PURPLE = token('impact-purple', '#7A3BE8');
const IMPACT_MAGENTA = token('impact-magenta', '#D63BC9');
const WHITE = '#FFFFFF';

/* The one true mark. Read, never retyped. */
const markFile = readFileSync(join(root, 'public/logo/atc-mark-currentcolor.svg'), 'utf8');
const MARK_PATH = markFile.match(/\sd="([^"]+)"/)?.[1];
if (!MARK_PATH) throw new Error('Could not read the mark path out of atc-mark-currentcolor.svg');

const MARK_W = 220.64;
const MARK_H = 180;
/* App icon proportions: mark occupies 62% of the tile width. */
const MARK_SCALE_OF_TILE = 0.62;
/* LG v2.0 — clear space is 23% of mark HEIGHT, on every side. */
const CLEARSPACE_RATIO = 0.23;

function tile(size, { ground, ink, gradient = false }) {
  const scale = (size * MARK_SCALE_OF_TILE) / MARK_W;
  const w = MARK_W * scale;
  const h = MARK_H * scale;
  const x = (size - w) / 2;
  const y = (size - h) / 2;

  const minClear = h * CLEARSPACE_RATIO;
  if (Math.min(x, y) < minClear) {
    throw new Error(
      `Clear space breach at ${size}px: ${Math.min(x, y).toFixed(1)}px < ${minClear.toFixed(1)}px required.`
    );
  }

  const fill = gradient ? 'url(#atc-impact)' : ink;
  const defs = gradient
    ? `<defs><linearGradient id="atc-impact" x1="0" y1="1" x2="1" y2="0">` +
      `<stop offset="0%" stop-color="${IMPACT_BLUE}"/>` +
      `<stop offset="52%" stop-color="${IMPACT_PURPLE}"/>` +
      `<stop offset="100%" stop-color="${IMPACT_MAGENTA}"/>` +
      `</linearGradient></defs>`
    : '';

  /* Full bleed, no baked corner radius: LinkedIn crops and masks the tile
     itself, and rounded corners here would punch transparent notches into
     whatever it draws underneath — including its dark mode. */
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <title>AdelTechTalks</title>
  ${defs}
  <rect width="${size}" height="${size}" fill="${ground}"/>
  <g transform="translate(${x.toFixed(2)},${y.toFixed(2)}) scale(${scale.toFixed(5)})">
    <path d="${MARK_PATH}" fill="${fill}"/>
  </g>
</svg>`;
}

const VARIANTS = [
  { slug: 'linkedin-logo', ground: PURPLE_600, ink: WHITE, note: 'primary — white mark on Purple 600' },
  { slug: 'linkedin-logo-impact', ground: IMPACT_NAVY, gradient: true, note: 'Dark Impact — brand gradient on navy' },
  { slug: 'linkedin-logo-light', ground: WHITE, ink: PURPLE_600, note: 'light ground — Purple 600 mark on white' },
];

/* 300 is LinkedIn's stated Page-logo size; 400 is the same artwork with room
   to spare for the page header, which draws the logo larger than the feed. */
const SIZES = [300, 400];

const outDir = join(root, 'public/logo/linkedin');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();

for (const variant of VARIANTS) {
  for (const size of SIZES) {
    const svg = tile(size, variant);
    const base = `${variant.slug}-${size}`;
    writeFileSync(join(outDir, `${base}.svg`), svg);

    await page.setViewportSize({ width: size, height: size });
    await page.setContent(
      `<style>html,body{margin:0;padding:0;background:transparent}svg{display:block}</style>${svg}`
    );
    await page.screenshot({ path: join(outDir, `${base}.png`), omitBackground: true });
    console.log(`  ✓ public/logo/linkedin/${base}.png   ${variant.note}`);
  }
}

await browser.close();
