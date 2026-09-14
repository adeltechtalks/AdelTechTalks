#!/usr/bin/env node
/* =============================================================================
   AdelTechTalks Brand OS — canonical export builder
   =============================================================================
   Reads the site's token CSS (the concrete implementation of the Figma-defined
   system) plus the two vector masters, and writes:

     brand/tokens/adel-v2.1.json                     machine-readable canonical export
     brand/logo/adel-mark*.svg                       the one A-mark, four colour roles
     brand/heart/love-tech-heart.svg                 the one I ❤ Tech heart path
     brand/safe-zones/<canvas>.svg                   safe-zone overlays per canvas
     .claude/skills/video-ad-editor/BRAND_SYSTEM.md  rendered view for the video skill

   OWNERSHIP
   ---------
   Figma (file OD9bQi6eWexQi53tLKoctW) defines the approved visual system.
   The values here are read from src/styles/tokens — nothing is typed by hand in
   this script except the *structure* and the dark-mode precedent mapping, and
   every value is looked up by its CSS custom-property name. A missing name is a
   hard error: the script never invents a colour, size or safe zone.

   Run:  node brand/scripts/build-tokens.mjs
   Check (CI-style, fails if outputs are stale):  node brand/scripts/build-tokens.mjs --check
   ========================================================================== */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const TOKENS_DIR = join(ROOT, 'site/src/styles/tokens');
const CHECK = process.argv.includes('--check');

/* ---------------------------------------------------------------------------
   1 · Read every custom property from the token files. Later files override
   earlier ones exactly as the CSS cascade does (tokens.css load order).
   ------------------------------------------------------------------------ */
const SOURCE_FILES = [
  'fonts.css', 'colors.css', 'typography.css', 'spacing.css', 'elevation.css',
  'brand.css', 'motion.css', 'adel-v2.css', 'adel-type.css', 'bridge-v2.css',
];
const ARCHIVE_FILE = 'legacy-att.css';

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}
function readProps(file, onlyRootBlock = true) {
  const css = stripComments(readFileSync(join(TOKENS_DIR, file), 'utf8'));
  const props = {};
  // Only the top-level :root / scope block(s); [lang='ar'] overrides are intentionally skipped
  const blocks = onlyRootBlock ? css.match(/:root\s*\{[\s\S]*?\}/g) ?? [] : [css];
  for (const block of blocks) {
    for (const m of block.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) props[m[1]] = m[2].trim();
  }
  return props;
}
const raw = {};
for (const f of SOURCE_FILES) Object.assign(raw, readProps(f));
const archiveRaw = readProps(ARCHIVE_FILE, false);

function resolveVar(value, seen = new Set()) {
  return value.replace(/var\((--[a-z0-9-]+)\)/gi, (_, name) => {
    if (seen.has(name)) throw new Error(`Circular token ${name}`);
    if (!(name in raw)) throw new Error(`Token ${name} referenced but not defined`);
    return resolveVar(raw[name], new Set([...seen, name]));
  });
}
function tok(name) {
  if (!(name in raw)) throw new Error(`Missing token ${name} in ${TOKENS_DIR}`);
  return resolveVar(raw[name]);
}
const px = (name) => Number(tok(name).replace(/px$/, ''));
const num = (name) => Number(tok(name));
const ms = (name) => Number(tok(name).replace(/ms$/, ''));
const hex = (name) => {
  const v = tok(name).toUpperCase();
  if (!/^#[0-9A-F]{6}$/.test(v)) throw new Error(`${name} is not a 6-digit hex (${v})`);
  return v;
};

/* ---------------------------------------------------------------------------
   2 · Colour
   ------------------------------------------------------------------------ */
const brand = {
  'signature-blue': { value: hex('--adel-signature-blue'), role: 'primary brand colour, primary action, heart, links' },
  'deep-blue':      { value: hex('--adel-deep-blue'),      role: 'pressed states, depth, text on Ice tint' },
  'ice-blue':       { value: hex('--adel-ice-blue'),       role: 'tinted surfaces, quiet emphasis' },
  'fresh-mint':     { value: hex('--adel-fresh-mint'),     role: 'ACCENT ONLY — ≤ ~3% of any surface, never a background, never the logo' },
  'graphite':       { value: hex('--adel-graphite'),       role: 'primary neutral, primary text, the everyday mark, dark-mode canvas' },
  'slate':          { value: hex('--adel-slate'),          role: 'secondary text' },
  'warm-white':     { value: hex('--adel-warm-white'),     role: 'primary light surface (page canvas), not pure white' },
  'white':          { value: hex('--adel-white'),          role: 'raised surfaces' },
  'soft-gray':      { value: hex('--adel-soft-gray'),      role: 'hairlines, dividers, rules' },
};
const ramp = (prefix, steps) => Object.fromEntries(steps.map((s) => [String(s), hex(`${prefix}-${s}`)]));
const primitives = {
  brand,
  blue: ramp('--adel-blue', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
  mint: ramp('--adel-mint', [100, 300, 500, 700]),
  ink: ramp('--adel-ink', [700]),
  neutral: {
    _note: 'Derived neutrals, NOT brand colours: interpolations on the Warm White → Graphite ramp that the UI needs.',
    sunken: hex('--adel-neutral-sunken'),
    border: hex('--adel-neutral-border'),
    muted: { value: hex('--adel-neutral-muted'), warning: 'NOT a text colour (2.46:1 on Warm White). Disabled controls, icon strokes, decorative rules only.' },
    'graphite-raised': { value: '#25272C', source: 'documented composite of --adel-glass-fill (Graphite 0.94) over Warm White; the only dark raised surface with a written precedent' },
  },
  status: {
    _note: 'Functional, not brand. Kept distinct from the blue family so correct/error/brand never read alike.',
    success: hex('--adel-status-success'),
    'success-text': hex('--adel-status-success-text'),
    'success-bg': hex('--adel-status-success-bg'),
    warning: hex('--adel-status-warning'),
    error: hex('--adel-status-error'),
    'error-bg': hex('--adel-status-error-bg'),
  },
  alpha: {
    'graphite-94': { value: tok('--adel-glass-fill'), use: 'glass fill (the site header — the only glass surface)' },
    'white-10': { value: tok('--adel-glass-border'), use: 'glass top highlight; dark-mode hairline' },
    'white-06': { value: tok('--adel-glass-edge'), use: 'glass bottom edge' },
    'white-08': { value: tok('--adel-nav-bg-hover'), use: 'hover wash on graphite' },
    'white-22': { value: tok('--adel-nav-border'), use: 'strong border on graphite' },
  },
};

/* Semantic tokens. Light values resolve from the site's Tier 2. Dark values are
   the documented precedents listed in docs/brand-os/02_PHASE2A_FIGMA_PLAN.md;
   anything marked open:true has no written precedent and awaits a ruling. */
const ref = (path) => {
  const [group, name] = path.split('.');
  const node = primitives[group]?.[name];
  if (node === undefined) throw new Error(`Unknown primitive ${path}`);
  return { ref: path, value: typeof node === 'string' ? node : node.value };
};
const light = {
  surface: { canvas: ref('brand.warm-white'), raised: ref('brand.white'), sunken: ref('neutral.sunken'), tint: ref('brand.ice-blue'), inverse: ref('brand.graphite'), depth: ref('mint.100') },
  text: { primary: ref('brand.graphite'), secondary: ref('brand.slate'), tertiary: ref('brand.slate'), inverse: ref('brand.white'), link: ref('brand.signature-blue'), 'link-hover': ref('brand.deep-blue'), 'on-tint': ref('brand.deep-blue') },
  border: { hairline: ref('brand.soft-gray'), strong: ref('neutral.border'), brand: ref('brand.signature-blue') },
  action: { 'primary-bg': ref('brand.signature-blue'), 'primary-bg-hover': ref('blue.600'), 'primary-bg-pressed': ref('brand.deep-blue'), 'primary-fg': ref('brand.white'), 'secondary-fg': ref('brand.signature-blue'), 'secondary-bg-hover': ref('brand.ice-blue') },
  accent: { mint: ref('brand.fresh-mint') },
  mark: { primary: ref('brand.graphite'), alternate: ref('brand.signature-blue'), reversed: ref('brand.white') },
  heart: { fill: ref('brand.signature-blue') },
  focus: { ring: ref('brand.signature-blue') },
};
// Sanity: the light tier must equal what the site actually resolves to.
const mustEqual = [
  ['--adel-surface-canvas', light.surface.canvas.value], ['--adel-surface-raised', light.surface.raised.value],
  ['--adel-surface-sunken', light.surface.sunken.value], ['--adel-surface-tint', light.surface.tint.value],
  ['--adel-text-primary', light.text.primary.value], ['--adel-text-secondary', light.text.secondary.value],
  ['--adel-text-link', light.text.link.value], ['--adel-text-on-tint', light.text['on-tint'].value],
  ['--adel-border-hairline', light.border.hairline.value], ['--adel-border-strong', light.border.strong.value],
  ['--adel-action-primary-bg-hover', light.action['primary-bg-hover'].value], ['--atc-mark-primary', light.mark.primary.value],
];
for (const [name, v] of mustEqual) if (hex(name) !== v) throw new Error(`Light semantic drift: ${name} = ${hex(name)} ≠ ${v}`);

const dark = {
  _status: 'PROPOSED — Graphite-based dark surfaces approved in principle (Phase 2A decision 4); values below come from documented precedents; open:true = no precedent, awaiting ruling',
  surface: { canvas: { ...ref('brand.graphite'), precedent: '--adel-surface-inverse, the graphite navbar' }, raised: { ...ref('neutral.graphite-raised'), precedent: 'glass composite documented in adel-v2.css' }, sunken: { ...ref('brand.graphite'), open: true }, tint: { ...ref('blue.900'), open: true }, inverse: ref('brand.warm-white'), depth: ref('mint.100') },
  text: { primary: { ...ref('brand.white'), precedent: '--adel-nav-fg-strong' }, secondary: { ...ref('brand.soft-gray'), precedent: '--adel-nav-fg' }, tertiary: ref('brand.soft-gray'), inverse: ref('brand.graphite'), link: { ...ref('blue.300'), precedent: 'LoveTech .lovetech--onDark; Signature Blue is 3.37:1 on Graphite and fails 4.5:1 for text' }, 'link-hover': { ...ref('brand.ice-blue'), precedent: '--adel-nav-fg-hover' }, 'on-tint': ref('brand.ice-blue') },
  border: { hairline: { ...ref('alpha.white-10'), precedent: '--adel-glass-border' }, strong: { ...ref('alpha.white-22'), precedent: '--adel-nav-border' }, brand: ref('brand.signature-blue') },
  action: { 'primary-bg': { ...ref('brand.signature-blue'), open: true }, 'primary-bg-hover': { ...ref('blue.600'), open: true }, 'primary-bg-pressed': { ...ref('brand.deep-blue'), open: true }, 'primary-fg': ref('brand.white'), 'secondary-fg': ref('blue.300'), 'secondary-bg-hover': { ...ref('alpha.white-08'), precedent: '--adel-nav-bg-hover' } },
  accent: { mint: ref('brand.fresh-mint') },
  mark: { primary: ref('brand.white'), alternate: ref('brand.signature-blue'), reversed: ref('brand.graphite') },
  heart: { fill: { ...ref('blue.300'), precedent: 'LoveTech .lovetech--onDark' } },
  focus: { ring: ref('brand.signature-blue') },
};

const archived = {
  _note: 'Edition 1 / ATT Content System. Archived, not deleted. Scoped to .att-legacy in the site; Figma page 99 — Archive / Edition 1. Never linked from active modules.',
  purple: { 600: archiveRaw['--att-purple-600'], 700: archiveRaw['--att-purple-700'], 50: archiveRaw['--att-purple-50'], 100: archiveRaw['--att-purple-100'] },
  'signal-blue-500': archiveRaw['--att-blue-500'],
  'spark-coral': { 100: archiveRaw['--att-spark-100'], 500: archiveRaw['--att-spark-500'], 700: archiveRaw['--att-spark-700'] },
  'magenta-500': archiveRaw['--att-pink-500'],
  lavender: { mist: archiveRaw['--att-mist'], veil: archiveRaw['--att-veil'], haze: archiveRaw['--att-haze'] },
  'dark-impact': { navy: archiveRaw['--att-impact-navy'], blue: archiveRaw['--att-impact-blue'], purple: archiveRaw['--att-impact-purple'], magenta: archiveRaw['--att-impact-magenta'], gradient: archiveRaw['--att-gradient-impact'] },
  'display-face': 'Cairo',
};
for (const [k, v] of Object.entries(archived)) if (v === undefined) throw new Error(`Archive token missing: ${k}`);

/* ---------------------------------------------------------------------------
   3 · Typography
   ------------------------------------------------------------------------ */
const family = (name) => tok(name).split(',')[0].replace(/['"]/g, '').trim();
const typography = {
  families: {
    display: { family: family('--adel-font-display'), stack: tok('--adel-font-display'), job: 'Latin display — standalone headings, wordmarks, nav, CTA, index figures. Never inside an Arabic run.', weights: [400, 500, 600, 700, 800] },
    text: { family: family('--adel-font-text'), stack: tok('--adel-font-text'), job: 'Arabic body/UI, any Latin inside an Arabic sentence, EN long-form.', weights: [300, 400, 500, 600] },
    'arabic-display': { family: family('--adel-font-arabic-display'), stack: tok('--adel-font-arabic-display'), job: 'Arabic display only — hero, headings, pull quotes. ≥ 24 px. Never letter-spaced. Single weight: hierarchy by size.', weights: [400], licence: 'licensed to Adel; self-hosted; NOT redistributable', figma: 'not in the Figma font environment — must be uploaded as a team font' },
    mono: { family: family('--adel-font-mono'), stack: tok('--adel-font-mono'), job: 'technical figures, specs, code, overlines', weights: [400, 500] },
    hand: { family: family('--adel-font-hand'), stack: tok('--adel-font-hand'), job: 'About-page sketch layer ONLY, EN only. Placeholder until real handwriting exists. NEVER a signature stand-in.', weights: [500, 600], exception: true },
  },
  'not-approved': { Cairo: 'Edition 1 Arabic display — archived', Inter: 'bootstrap placeholder — not approved', Alexandria: 'bootstrap placeholder — not approved', Tajawal: 'generic skill example — not brand data', Amiri: 'not core; documented exception only for the scripture line on the holding page (coming-soon.astro)' },
  'montserrat-weights': { 800: 'Hero / Display XL ("I ❤ Tech")', 700: 'major section headings', 600: 'secondary headings', '500-600': 'navigation, CTA, labels', 400: 'specific supporting text only' },
  scale: Object.fromEntries(['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map((s) => [s, px(`--adel-text-${s}`)])),
  leading: { tight: num('--adel-leading-tight'), snug: num('--adel-leading-snug'), body: num('--adel-leading-body'), 'arabic-body': 1.85, 'arabic-snug': 1.5 },
  tracking: { tight: tok('--adel-tracking-tight'), wide: tok('--adel-tracking-wide'), 'love-tech': '-0.04em', wordmark: '-0.02em', 'adel-lockup': '-0.03em' },
  measure: { latin: tok('--adel-measure'), arabic: tok('--adel-measure-arabic') },
  arabic: {
    hero: { size: px('--adel-type-ar-hero'), mobile: 34, line: num('--adel-type-ar-hero-line') },
    heading: { size: px('--adel-type-ar-heading'), mobile: 24, line: num('--adel-type-ar-heading-line') },
    quote: { size: px('--adel-type-ar-quote'), line: num('--adel-type-ar-quote-line') },
    'display-min': px('--adel-type-ar-display-min'),
    'inline-latin-scale': num('--adel-type-ar-latin-scale'),
    rules: ['RTL-first layouts; Latin terms are isolated LTR islands (.term)', 'Western digits 0–9, tabular', 'never letter-spaced', 'never synthesised bold or italic', 'no uppercase concept — overlines are sentence case', 'Ghorab has no Latin glyphs: an English term inside a Ghorab headline falls to Montserrat 700 at ×0.925'],
  },
  'latin-ui-scale': Object.fromEntries(['display1', 'display2', 'heading1', 'heading2', 'heading3', 'heading4'].map((k) => [k, { size: px(`--atc-${k}-size`), line: px(`--atc-${k}-line`), weight: num(`--atc-${k}-weight`) }])),
  body: { large: { size: px('--atc-body-large-size'), line: px('--atc-body-large-line') }, base: { size: px('--atc-body-base-size'), line: px('--atc-body-base-line') }, small: { size: px('--atc-body-small-size'), line: px('--atc-body-small-line') }, label: { size: px('--atc-label-size'), line: px('--atc-label-line'), weight: num('--atc-label-weight') }, caption: { size: px('--atc-caption-size'), line: px('--atc-caption-line') }, overline: { size: px('--atc-overline-size'), line: px('--atc-overline-line'), weight: num('--atc-overline-weight'), tracking: tok('--atc-overline-tracking'), latinOnly: true } },
  social: {
    _note: 'Authored in Arabic. Latin steps DOWN: size ÷ 1.08, line-height − 0.15. cover = KO Ghorab (was Cairo) · title/sub/body/support/label = Readex Pro · spec = JetBrains Mono tabular · index = Montserrat',
    ...Object.fromEntries(['cover', 'title', 'sub', 'body', 'support', 'label', 'spec', 'index'].map((k) => [k, { size: px(`--atc-social-${k}-size`), line: px(`--atc-social-${k}-line`), weight: num(`--atc-social-${k}-weight`) }])),
    'latin-stepdown': { size: num('--atc-latin-stepdown-size'), line: num('--atc-latin-stepdown-line') },
  },
  'figma-text-styles': [
    ['EN/Display/Hero · I ❤ Tech', 'Montserrat', 'ExtraBold', 72, 83, '-4%'], ['EN/Display/1', 'Montserrat', 'Bold', 56, 64], ['EN/Display/2', 'Montserrat', 'Bold', 44, 52],
    ['EN/Heading/1', 'Montserrat', 'Bold', 36, 44], ['EN/Heading/2', 'Montserrat', 'SemiBold', 28, 36], ['EN/Heading/3', 'Montserrat', 'SemiBold', 22, 30], ['EN/Heading/4', 'Montserrat', 'SemiBold', 18, 26],
    ['EN/Body/L', 'Readex Pro', 'Regular', 18, 30], ['EN/Body/M', 'Readex Pro', 'Regular', 16, 26], ['EN/Body/S', 'Readex Pro', 'Regular', 14, 22], ['EN/Label', 'Readex Pro', 'Medium', 14, 20], ['EN/Caption', 'Readex Pro', 'Regular', 12, 18], ['EN/Overline', 'Readex Pro', 'SemiBold', 12, 16, '+8%'],
    ['AR/Display/Hero [Ghorab]', 'KO Ghorab', 'Regular', 52, 73], ['AR/Display/Heading [Ghorab]', 'KO Ghorab', 'Regular', 32, 46], ['AR/Display/Quote [Ghorab]', 'KO Ghorab', 'Regular', 26, 39],
    ['AR/Body/L', 'Readex Pro', 'Regular', 18, 33], ['AR/Body/M', 'Readex Pro', 'Regular', 16, 30], ['AR/UI', 'Readex Pro', 'Medium', 14, 24],
    ['Social/Cover [Ghorab]', 'KO Ghorab', 'Regular', 112, 123], ['Social/Title', 'Readex Pro', 'Bold', 76, 94], ['Social/Sub', 'Readex Pro', 'SemiBold', 54, 71], ['Social/Body', 'Readex Pro', 'Regular', 36, 58], ['Social/Support', 'Readex Pro', 'Regular', 30, 48], ['Social/Label', 'Readex Pro', 'Medium', 26, 32], ['Social/Spec', 'JetBrains Mono', 'Medium', 34, 40], ['Social/Index', 'Montserrat', 'ExtraBold', 150, 135],
    ['Tech/Code', 'JetBrains Mono', 'Regular', 14, 22],
  ].map(([name, fam, style, size, line, tracking]) => ({ name, family: fam, style, size, line, ...(tracking ? { tracking } : {}) })),
};

/* ---------------------------------------------------------------------------
   4 · Space, shape, motion
   ------------------------------------------------------------------------ */
const space = Object.fromEntries([0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32].map((s) => [String(s), px(`--atc-space-${s}`)]));
const radius = { inline: px('--adel-radius-inline'), control: px('--adel-radius-control'), card: px('--adel-radius-card'), panel: px('--adel-radius-panel'), media: px('--adel-radius-media'), hero: px('--atc-radius-xl'), signature: px('--atc-radius-2xl'), pill: px('--adel-radius-pill') };
const stroke = { hairline: px('--atc-stroke-hairline'), default: px('--atc-stroke-default'), strong: Number(tok('--atc-stroke-strong').replace('px', '')), brand: px('--atc-stroke-brand') };
const sizing = { control: { sm: px('--atc-control-sm'), md: px('--atc-control-md'), lg: px('--atc-control-lg') }, icon: { sm: px('--atc-icon-sm'), md: px('--atc-icon-md'), lg: px('--atc-icon-lg'), xl: px('--atc-icon-xl') }, 'touch-target': px('--atc-touch-target') };
const elevation = { 1: tok('--adel-elevation-1'), 2: tok('--adel-elevation-2'), 3: tok('--adel-elevation-3'), 4: tok('--atc-elevation-4'), _note: 'neutral-cool Graphite shadows; the violet ladder is archived' };
const motion = {
  duration: Object.fromEntries(['instant', 'micro', 'fast', 'base', 'moderate', 'slow', 'deliberate', 'ceiling'].map((k) => [k, ms(`--atc-duration-${k}`)])),
  sequence: { 'product-max': ms('--atc-sequence-product-max'), 'marketing-max': ms('--atc-sequence-marketing-max') },
  ease: { enter: tok('--atc-ease-enter'), exit: tok('--atc-ease-exit'), move: tok('--atc-ease-move'), loop: tok('--atc-ease-loop') },
  distance: { 1: px('--atc-distance-1'), 2: px('--atc-distance-2'), 3: px('--atc-distance-3'), 4: px('--atc-distance-4'), marketing: px('--atc-distance-marketing') },
  scale: { enter: num('--atc-scale-enter'), rest: num('--atc-scale-rest'), overshoot: num('--atc-scale-overshoot') },
  stagger: { product: ms('--atc-stagger-product'), marketing: ms('--atc-stagger-marketing') },
  'reduced-motion': 'full replacement, never a degradation',
  'v3-cinematic': { range: '500–900 ms', bar: 'Tech-savvy · Cinematic · Tactile · Premium · Fast', rules: ['one memorable interaction per section', 'no confetti', 'no looping idle motion', 'no gimmicky transitions'] },
};

/* ---------------------------------------------------------------------------
   5 · Canvases and safe zones — the audited repository tokens win
   ------------------------------------------------------------------------ */
const canvasDef = (key, css, label, use) => ({
  key, label, use,
  width: px(`--atc-social-${css}-w`), height: px(`--atc-social-${css}-h`),
  margin: px(`--atc-social-${css}-margin`), 'reserve-top': px(`--atc-social-${css}-top`), 'reserve-bottom': px(`--atc-social-${css}-bottom`),
  columns: num(`--atc-social-${css}-cols`), gutter: px(`--atc-social-${css}-gutter`),
});
const canvases = {
  _note: 'reserve-top / reserve-bottom are layout reserves: no headline, body or signature inside them. They are larger than, and contain, the platform UI-overlay areas the video skill\'s safe-check detects.',
  'reel-9x16': canvasDef('reel-9x16', 'reel', 'Reel / Story 9:16', 'Motion Carousel slides, Reels, ASMR, Talking Head, all vertical video'),
  'feed-4x5': canvasDef('feed-4x5', 'feed', 'Feed 4:5', 'Static Ultra Carousel canonical canvas'),
  'square-1x1': canvasDef('square-1x1', 'square', 'Square 1:1', 'square posts'),
  'thumb-16x9': canvasDef('thumb-16x9', 'thumb', 'Thumbnail 16:9', 'YouTube / long-form covers'),
};
const slots = { _note: 'ENFORCED, counted in Arabic words. On breach the remedy is fewer words, never smaller type.', 'cover-headline': num('--atc-slot-cover-headline'), 'slide-title': num('--atc-slot-slide-title'), body: num('--atc-slot-body'), support: num('--atc-slot-support'), 'spec-tokens': num('--atc-slot-spec-tokens'), 'chip-words': num('--atc-slot-chip-words'), 'chip-count': num('--atc-slot-chip-count') };

/* ---------------------------------------------------------------------------
   6 · Logo, heart, signature — read from the vector masters
   ------------------------------------------------------------------------ */
const markSvg = readFileSync(join(ROOT, 'site/public/logo/atc-mark-currentcolor.svg'), 'utf8');
const MARK_PATH = markSvg.match(/ d="([^"]+)"/)[1];
const MARK_VIEWBOX = markSvg.match(/viewBox="([^"]+)"/)[1];
const loveTech = readFileSync(join(ROOT, 'site/src/components/LoveTech.astro'), 'utf8');
const HEART_PATH = loveTech.match(/<path\s+d="([^"]+)"/)[1];
const adelAMark = readFileSync(join(ROOT, 'site/src/assets/brand/adel-a-mark.svg'), 'utf8').match(/ d="([^"]+)"/)[1];
if (adelAMark !== MARK_PATH) throw new Error('adel-a-mark.svg and atc-mark-currentcolor.svg have diverged — one mark, one path');

const logo = {
  master: 'brand/logo/adel-mark.svg',
  path: MARK_PATH, viewBox: MARK_VIEWBOX,
  ratio: num('--atc-mark-ratio'), 'clearspace-ratio': num('--atc-mark-clearspace-ratio'), 'min-size': px('--atc-mark-min-size'), 'min-print': tok('--atc-mark-min-print'), 'min-embroidery': tok('--atc-mark-min-embroidery'),
  geometry: 'viewBox 220.64 × 180, ratio 1.2258 LOCKED, legs 1.19° apart, counter open at the bottom. Never redraw, never scale non-uniformly.',
  roles: { primary: { name: 'Graphite', ref: 'brand.graphite', value: brand.graphite.value, use: 'the everyday mark' }, alternate: { name: 'Signature Blue', ref: 'brand.signature-blue', value: brand['signature-blue'].value, use: 'approved brand alternate' }, reversed: { name: 'White', ref: 'brand.white', value: brand.white.value, use: 'dark or photographic grounds; never tinted grey' } },
  forbidden: ['Fresh Mint', 'any gradient', 'Purple 600 (Edition 1)', 'any tint or opacity', 'stretching, redrawing, outlining'],
  files: { graphite: 'brand/logo/adel-mark-graphite.svg', 'signature-blue': 'brand/logo/adel-mark-signature-blue.svg', white: 'brand/logo/adel-mark-white.svg' },
  lockups: {
    'adeltechtalks': { status: 'primary', word: 'AdelTechTalks', font: 'Montserrat 800', 'word-size': '0.58 × mark height', gap: space['3'], tracking: '-0.02em', direction: 'ltr, never mirrored, Latin on the Arabic site too', source: 'site/src/components/Logo.astro' },
    'adel': { status: 'secondary — kept, not retired', word: 'Adel', font: 'Montserrat 800', 'word-size': '0.72 × mark height', gap: 10, tracking: '-0.03em', source: 'site/src/components/AdelLogo.astro' },
    'love-tech': { status: 'master brand expression', words: 'I ❤ Tech', font: 'Montserrat 800', tracking: '-0.04em', gap: '0.21em', heart: '0.76em, brand/heart/love-tech-heart.svg, fill heart/fill (Signature Blue light · blue/300 dark)', source: 'site/src/components/LoveTech.astro' },
  },
  'app-icon': { tile: 'Signature Blue (recommended) or Graphite — ruling open', mark: 'White', radius: '27/120 of tile', gradient: 'retired (atc-appicon-gradient.svg → archive)' },
};
const heart = { master: 'brand/heart/love-tech-heart.svg', path: HEART_PATH, viewBox: '0 0 24 24', fill: { light: 'heart/fill → brand.signature-blue', dark: 'heart/fill → blue.300' }, note: 'scripts/build-og-adel.mjs still carries a second heart path; consolidate to this master (§5.5 of the audit).' };
const signature = { status: 'RESERVED — empty', asset: null, 'site-slot': 'site.config.ts photography.signature', 'skill-slot': '.claude/skills/video-ad-editor/assets/signature.png', rule: 'No handwritten signature is created, simulated or set in a handwriting font. The slot stays empty until Adel supplies a real scanned signature (SVG or transparent PNG).' };

/* ---------------------------------------------------------------------------
   7 · Rules the video skill enforces (not just documents)
   ------------------------------------------------------------------------ */
const rules = {
  colour: ['Never invent a brand colour when an approved token exists.', 'Fresh Mint ≤ ~3% of any surface; never a background, never the logo.', 'No gradients anywhere in the active system.', 'Status colours are functional, never brand.'],
  logo: ['One geometry, three colour roles (Graphite / Signature Blue / White). Never stretch, redraw, recolour or add a gradient tile.', 'AdelTechTalks lockup is primary; Adel lockup is secondary.', 'Bare mark never below 24 px; below that use an app-icon tile.'],
  typography: ['Montserrat when Latin stands alone; Readex Pro the moment Latin sits inside an Arabic sentence.', 'KO Ghorab: Arabic display only, ≥ 24 px, never letter-spaced, hierarchy by size.', 'Western digits 0–9 in both languages.', 'Arabic layouts RTL-first with isolated LTR islands for Latin terms.'],
  video: ['Product footage occupies the dominant area; text second; signature micro.', 'ASMR: recorded tactile audio (box opening, peeling, clicks, scratches, packaging, handling) stays ON — no music, captions, denoise, gating or compression by default.', 'Motion Carousel: 5–6 independent ~5 s slides at 1080×1920, each exportable as its own MP4; a stitched preview is optional; never a static carousel with generic zoom.', 'Brand opener / end card are micro moments, not intros.', 'Motion is precise and premium, not template-heavy: cut / match-cut by default for ASMR.'],
  families: ['ASMR / Product Unboxing', 'Talking Head / Reel', 'Motion Carousel', 'Product Comparison', 'Product Demo / Feature Spotlight', 'Mixed Talking Head + Product B-roll', 'Long-form / Explainer (routing profile of the Talking Head pipeline — supported, no separate JSON yet)'],
};

/* ---------------------------------------------------------------------------
   8 · Assemble and write
   ------------------------------------------------------------------------ */
const tokens = {
  $meta: {
    brand: 'AdelTechTalks', system: 'v2.1 Blue', schema: 'adeltechtalks-brand-tokens/1',
    authority: 'Figma file OD9bQi6eWexQi53tLKoctW defines the approved visual system. This file is the one machine-readable export automation consumes. It is GENERATED from site/src/styles/tokens by brand/scripts/build-tokens.mjs — never hand-edited.',
    regenerate: 'node brand/scripts/build-tokens.mjs',
    sources: [...SOURCE_FILES.map((f) => `site/src/styles/tokens/${f}`), `site/src/styles/tokens/${ARCHIVE_FILE}`, 'site/public/logo/atc-mark-currentcolor.svg', 'site/src/components/LoveTech.astro'],
    decisions: 'docs/brand-os/01_PHASE2A_DECISIONS.md',
    consumers: ['.claude/skills/video-ad-editor/BRAND_SYSTEM.md (generated)', 'Canva brand kit rebuild (Phase 2B+)', 'Framer / website work'],
  },
  color: { primitives, semantic: { light, dark }, archived },
  typography, space, radius, stroke, sizing, elevation, motion, canvases, slots, logo, heart, signature, rules,
};

const outputs = new Map();
const json = JSON.stringify(tokens, null, 2) + '\n';
outputs.set('brand/tokens/adel-v2.1.json', json);

/* logo variants — same path, fills from the token export */
const markFile = (fill, title) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}" width="220.64" height="180"><title>${title}</title><path d="${MARK_PATH}" fill="${fill}"/></svg>\n`;
outputs.set('brand/logo/adel-mark.svg', markFile('currentColor', 'AdelTechTalks mark — master (currentColor)'));
outputs.set('brand/logo/adel-mark-graphite.svg', markFile(brand.graphite.value, 'AdelTechTalks mark — Graphite (primary)'));
outputs.set('brand/logo/adel-mark-signature-blue.svg', markFile(brand['signature-blue'].value, 'AdelTechTalks mark — Signature Blue (alternate)'));
outputs.set('brand/logo/adel-mark-white.svg', markFile(brand.white.value, 'AdelTechTalks mark — White (reversed)'));
outputs.set('brand/heart/love-tech-heart.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><title>I ❤ Tech heart — master</title><path d="${HEART_PATH}" fill="${brand['signature-blue'].value}"/></svg>\n`);

/* safe-zone overlays */
for (const c of Object.values(canvases)) {
  if (typeof c !== 'object' || !c.width) continue;
  const { width: w, height: h, margin: m, columns: cols, gutter: g } = c;
  const top = c['reserve-top'], bottom = c['reserve-bottom'];
  const colW = (w - 2 * m - (cols - 1) * g) / cols;
  const colRects = Array.from({ length: cols }, (_, i) => `<rect x="${(m + i * (colW + g)).toFixed(2)}" y="${top}" width="${colW.toFixed(2)}" height="${h - top - bottom}" fill="${brand['signature-blue'].value}" fill-opacity="0.06"/>`).join('');
  outputs.set(`brand/safe-zones/${c.key}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<title>${c.label} — safe zones (margin ${m}, reserve top ${top}, bottom ${bottom}, ${cols} cols / ${g} gutter)</title>
<rect width="${w}" height="${h}" fill="none"/>
<rect x="0" y="0" width="${w}" height="${top}" fill="${brand['deep-blue'].value}" fill-opacity="0.18"/>
<rect x="0" y="${h - bottom}" width="${w}" height="${bottom}" fill="${brand['deep-blue'].value}" fill-opacity="0.18"/>
<rect x="${m}" y="${m}" width="${w - 2 * m}" height="${h - 2 * m}" fill="none" stroke="${brand['signature-blue'].value}" stroke-width="2" stroke-dasharray="12 8"/>
${colRects}
</svg>
`);
}

/* rendered view for the video skill */
const t = (rows) => rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
const semRows = (mode) => Object.entries(mode).filter(([k]) => !k.startsWith('_')).flatMap(([g, obj]) => Object.entries(obj).map(([k, v]) => [`${g}/${k}`, v.value, v.ref, v.open ? '⚠ open — no precedent' : (v.precedent ?? '')]));
const brandMd = `<!-- GENERATED by brand/scripts/build-tokens.mjs from brand/tokens/adel-v2.1.json — DO NOT EDIT BY HAND. -->
# AdelTechTalks Creative System — Production Contract (rendered view)

**Authority:** Figma (\`OD9bQi6eWexQi53tLKoctW\`) defines the approved visual system. The repository holds the one machine-readable export, \`brand/tokens/adel-v2.1.json\`, generated from the site token CSS. This file is a rendering of that export for the video skill. It is regenerated by \`node brand/scripts/build-tokens.mjs\` and is never edited directly. Canva mirrors approved templates; it never leads.

The bootstrap file \`brand/adeltechtalks.bootstrap.json\` in this folder is **superseded**; it points here.

## Colour — AdelTechTalks v2.1 Blue (the only active system)

| Token | Value | Role |
|---|---|---|
${t(Object.entries(brand).map(([k, v]) => [`brand/${k}`, `\`${v.value}\``, v.role]))}

Ramps: blue ${Object.values(primitives.blue).join(' · ')} · mint ${Object.values(primitives.mint).join(' · ')} · ink-700 ${primitives.ink['700']}. Derived neutrals (not brand): sunken ${primitives.neutral.sunken} · border ${primitives.neutral.border} · muted ${primitives.neutral.muted.value} (never text) · graphite-raised ${primitives.neutral['graphite-raised'].value}.
Status (functional): success ${primitives.status.success} / text ${primitives.status['success-text']} · warning ${primitives.status.warning} · error ${primitives.status.error}.
**Archived, never used in active work:** Edition 1 purple ${archived.purple['600']}, lavender, Spark Coral ${archived['spark-coral']['500']}, magenta ${archived['magenta-500']}, Dark Impact navy ${archived['dark-impact'].navy} and its gradient, Cairo.

### Light mode (site Tier 2, verified against the CSS)
| Token | Value | Alias | |
|---|---|---|---|
${t(semRows(light))}

### Dark mode — Graphite-based, PROPOSED
${dark._status}

| Token | Value | Alias | Precedent |
|---|---|---|---|
${t(semRows(dark))}

## Typography (audited website faces win)

| Face | Job |
|---|---|
${t(Object.entries(typography.families).map(([k, v]) => [`**${v.family}** (${k})`, v.job]))}

Not approved: ${Object.entries(typography['not-approved']).map(([k, v]) => `${k} — ${v}`).join('; ')}.
Arabic display: hero ${typography.arabic.hero.size}/${typography.arabic.hero.line} · heading ${typography.arabic.heading.size}/${typography.arabic.heading.line} · quote ${typography.arabic.quote.size}/${typography.arabic.quote.line} · floor ${typography.arabic['display-min']} px.
Social scale (Arabic-authored, Latin ÷ ${typography.social['latin-stepdown'].size}): ${['cover', 'title', 'sub', 'body', 'support', 'label', 'spec', 'index'].map((k) => `${k} ${typography.social[k].size}/${typography.social[k].line}`).join(' · ')}.

## Canvases and safe zones (repository tokens — these win)

| Canvas | Size | Margin | Reserve top | Reserve bottom | Grid |
|---|---|---|---|---|---|
${t(Object.values(canvases).filter((c) => c.width).map((c) => [c.label, `${c.width}×${c.height}`, c.margin, c['reserve-top'], c['reserve-bottom'], `${c.columns} cols · ${c.gutter}`]))}

Slot ceilings (Arabic words, enforced): cover ${slots['cover-headline']} · slide title ${slots['slide-title']} · body ${slots.body} · support ${slots.support} · spec tokens ${slots['spec-tokens']} · chips ${slots['chip-count']}×${slots['chip-words']}.

> The skill's \`08_safe_check.js\` still carries its own hard-coded platform UI-overlay areas (150 / 300 / 180). Those detect Instagram's buttons; they are a different, smaller concept than the brand reserves above and sit inside them. Reading them from this export is a deferred refactor (Phase 2A decision 6).

## Logo and signature
- One mark: \`${logo.master}\` (${logo.geometry}). Roles: **Graphite** everyday · **Signature Blue** alternate · **White** reversed. Forbidden: ${logo.forbidden.join(', ')}.
- Lockups: **AdelTechTalks** primary · **Adel** secondary (kept) · **I ❤ Tech** master expression with the drawn heart \`${heart.master}\`.
- App icon: white mark on a flat tile, radius 27/120. No gradient tile.
- Signature: ${signature.status}. ${signature.rule} Skill slot: \`assets/signature.png\`.

## Non-negotiables the skill enforces
${[...rules.colour, ...rules.logo, ...rules.typography, ...rules.video].map((r) => `- ${r}`).join('\n')}

## Format relationship
The brand system is shared; the edit behaviour is not.
- Talking Head / Reel: captions + semantic motion allowed. Long-form / explainer edits are a routing profile of this pipeline.
- ASMR / Unboxing: recorded tactile audio preserved; no default captions/music/denoise/gate/compression.
- Motion Carousel: 5–6 independent ~5 s slides at 1080×1920, one idea per slide, each its own MP4.
- Comparison: matched shots, clear A/B labels, no fake precision.
- Product Demo: real use / proof first, then explain.
- Mixed: speech is the spine, product footage is B-roll unless ASMR is asked for.

Production families: ${rules.families.join(' · ')}.
`;
outputs.set('.claude/skills/video-ad-editor/BRAND_SYSTEM.md', brandMd);

let stale = [];
for (const [rel, content] of outputs) {
  const abs = join(ROOT, rel);
  if (CHECK) {
    if (!existsSync(abs) || readFileSync(abs, 'utf8') !== content) stale.push(rel);
  } else {
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, content);
  }
}
if (CHECK) {
  if (stale.length) { console.error('STALE — regenerate with node brand/scripts/build-tokens.mjs:\n  ' + stale.join('\n  ')); process.exit(1); }
  console.log(`✓ brand export up to date (${outputs.size} files)`);
} else {
  console.log(`✓ wrote ${outputs.size} files:\n  ` + [...outputs.keys()].join('\n  '));
}
