/* Builds the default Adel share card — the image every page without its own
 * cover uses on LinkedIn, Facebook, X and WhatsApp (§27).
 *
 * Run:  npm run og      (runs this and the AdelTechTalks badge cards)
 * Out:  public/og/adel-default.png  — commit it.
 *
 * §27 asks for the Adel/AdelTechTalks distinction to be maintained in the
 * sharing layer. It is, and the two scripts are the proof:
 *
 *   build-og-adel.mjs  → Adel.          v2.0 blue, graphite, warm white.
 *   build-og.mjs       → AdelTechTalks. Playground badges, ATT purple.
 *
 * Colours are read out of the token files so the card cannot drift from the
 * site. Nothing here is a literal hex except pure white.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const tokens = readFileSync(join(root, 'src/styles/tokens/adel-v2.css'), 'utf8');
const token = (name, fallback) => {
  const m = tokens.match(new RegExp(`--adel-${name}\\s*:\\s*(#[0-9A-Fa-f]{3,8})`));
  return m ? m[1].trim() : fallback;
};

const SIGNATURE = token('signature-blue', '#2563EB');
const GRAPHITE = token('graphite', '#171A1F');
const SLATE = token('slate', '#667085');
const WARM_WHITE = token('warm-white', '#FAFAF8');
const SOFT_GRAY = token('soft-gray', '#E6E8EC');
const HEART = '#E0342A';

/* The site's own heart path, so the card and the hero draw the same glyph. */
const HEART_PATH =
  'M12 21s-7.5-4.7-9.6-9.1C.7 8.5 2.4 5 5.9 5c2 0 3.4 1.1 4.1 2.2C10.7 6.1 12.1 5 14.1 5c3.5 0 5.2 3.5 3.5 6.9C19.5 16.3 12 21 12 21z';

const SANS = 'Montserrat, DejaVu Sans, Helvetica, Arial, sans-serif';

const card = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${WARM_WHITE}"/>

  <!-- One brand rule down the leading edge. No gradient: v2.0 approves none. -->
  <rect x="0" y="0" width="14" height="630" fill="${SIGNATURE}"/>

  <!-- identity -->
  <text x="100" y="150" font-family="${SANS}" font-size="30" font-weight="700"
        letter-spacing="6" fill="${SIGNATURE}">ADEL</text>

  <!-- the expression -->
  <text x="100" y="300" font-family="${SANS}" font-size="112" font-weight="800"
        letter-spacing="-3" fill="${GRAPHITE}">I</text>
  <g transform="translate(150,205) scale(4.1)">
    <path d="${HEART_PATH}" fill="${HEART}"/>
  </g>
  <text x="262" y="300" font-family="${SANS}" font-size="112" font-weight="800"
        letter-spacing="-3" fill="${GRAPHITE}">Tech</text>

  <!-- positioning -->
  <text x="100" y="372" font-family="${SANS}" font-size="34" font-weight="500"
        fill="${SLATE}">Product Manager · AI Enthusiast · Builder · Lifelong Learner</text>

  <line x1="100" y1="440" x2="1100" y2="440" stroke="${SOFT_GRAY}" stroke-width="2"/>

  <!-- the pattern -->
  <text x="100" y="502" font-family="${SANS}" font-size="30" font-weight="600"
        fill="${GRAPHITE}">I learn it.  I test it.  I build with it.  I share it.</text>

  <text x="1100" y="502" text-anchor="end" font-family="${SANS}" font-size="26"
        fill="${SLATE}">adeltechtalks.com</text>
</svg>`;

const outDir = join(root, 'public/og');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const png = await sharp(Buffer.from(card())).png().toBuffer();
writeFileSync(join(outDir, 'adel-default.png'), png);
console.log('  ✓ public/og/adel-default.png   Adel — default social preview');
