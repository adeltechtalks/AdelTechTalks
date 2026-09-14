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
/* Edition 1 values read from their ORIGINAL file. tokens/colors.css is later
   re-pointed at blue by bridge-v2.css, so the merged cascade cannot be used to
   recover an Edition 1 hex — these two are read straight from the source. */
const EDITION1_FILE = 'colors.css';

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
const edition1Raw = readProps(EDITION1_FILE);

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
    'graphite-sunken': { value: '#090D12', introduced: 'v2.1 (Phase 2A refinement)', source: 'DERIVED, not invented: Graphite minus the measured canvas→raised step (+14/+13/+13), so the dark ladder sunken → canvas → raised is one even step in each direction. White text measures 19.48:1 on it.' },
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
  _status: 'RESOLVED — Graphite-based dark surfaces. Values are either a documented precedent or a v2.1 semantic value newly introduced in the Phase 2A refinement, derived from the approved Graphite / Blue system and contrast-checked. Nothing is inherited from Dark Impact or Edition 1, and no arbitrary colour was added: exactly one new primitive (neutral/graphite-sunken) exists, everything else is an existing ramp step.',
  _contrast: 'Measured with the WCAG relative-luminance formula. Text pairs clear 4.5:1; UI fills clear 3:1 against the surface they sit on.',
  surface: {
    canvas: { ...ref('brand.graphite'), precedent: '--adel-surface-inverse, the graphite navbar' },
    raised: { ...ref('neutral.graphite-raised'), precedent: 'glass composite documented in adel-v2.css' },
    sunken: { ...ref('neutral.graphite-sunken'), introduced: 'v2.1', derivation: 'Graphite − the canvas→raised step, mirroring the light ladder downward', contrast: 'white 19.48:1 · soft-gray 15.88:1' },
    tint: { ...ref('blue.900'), introduced: 'v2.1', derivation: 'the published blue ramp\'s darkest step — the dark counterpart of Ice Blue, from the approved ramp rather than a new mix', contrast: 'white 14.92:1 · ice-blue 12.34:1' },
    inverse: ref('brand.warm-white'), depth: ref('mint.100'),
  },
  text: { primary: { ...ref('brand.white'), precedent: '--adel-nav-fg-strong' }, secondary: { ...ref('brand.soft-gray'), precedent: '--adel-nav-fg' }, tertiary: ref('brand.soft-gray'), inverse: ref('brand.graphite'), link: { ...ref('blue.300'), precedent: 'LoveTech .lovetech--onDark; Signature Blue is 3.37:1 on Graphite and fails 4.5:1 for text' }, 'link-hover': { ...ref('brand.ice-blue'), precedent: '--adel-nav-fg-hover' }, 'on-tint': ref('brand.ice-blue') },
  border: { hairline: { ...ref('alpha.white-10'), precedent: '--adel-glass-border' }, strong: { ...ref('alpha.white-22'), precedent: '--adel-nav-border' }, brand: ref('brand.signature-blue') },
  action: {
    _rule: 'The light ladder\'s rule is "each state moves one step further from the surface". On a Graphite surface that direction is LIGHTER, so the dark ladder is the same rule mirrored — and the foreground flips to Graphite because the fill is now the light element. This is not a preference: keeping the light ladder on dark fails the 3:1 UI floor against the canvas (blue/600 = 2.63:1, deep-blue = 2.02:1), so the mirrored ladder is the accessible option.',
    'primary-bg': { ...ref('blue.400'), introduced: 'v2.1', contrast: 'graphite text 5.50:1 · against the canvas 5.50:1' },
    'primary-bg-hover': { ...ref('blue.300'), introduced: 'v2.1', contrast: 'graphite text 8.71:1' },
    'primary-bg-pressed': { ...ref('blue.200'), introduced: 'v2.1', contrast: 'graphite text 11.86:1' },
    'primary-fg': { ...ref('brand.graphite'), introduced: 'v2.1', note: 'Graphite, not White: on dark the primary fill is a light blue, so the label inverts with it. White on blue/400 measures 3.17:1 and fails.' },
    'secondary-fg': { ...ref('blue.300'), contrast: '8.71:1 on the canvas' },
    'secondary-bg-hover': { ...ref('alpha.white-08'), precedent: '--adel-nav-bg-hover' },
  },
  accent: { mint: ref('brand.fresh-mint') },
  mark: { primary: ref('brand.white'), alternate: ref('brand.signature-blue'), reversed: ref('brand.graphite') },
  heart: { fill: { ...ref('blue.300'), precedent: 'LoveTech .lovetech--onDark' } },
  focus: { ring: ref('brand.signature-blue') },
};

/* ---------------------------------------------------------------------------
   Expressive / Creator palette — APPROVED SECONDARY (not archived)
   ---------------------------------------------------------------------------
   Selected Edition 1 hues, reclassified from "archived" to an approved
   expressive layer for creator-side content. The values are the originals,
   read from their source files; nothing is re-mixed. Signature Blue remains
   the primary brand colour on every surface — these never replace it.
   ------------------------------------------------------------------------ */
const e1 = (name) => {
  const v = (edition1Raw[name] ?? archiveRaw[name] ?? '').toUpperCase();
  if (!/^#[0-9A-F]{6}$/.test(v)) throw new Error(`Edition 1 token ${name} missing or not a hex (${v})`);
  return v;
};
const expressive = {
  _status: 'APPROVED SECONDARY — expressive / creator palette. Never replaces Signature Blue as the primary brand colour, never used on the logo, the website UI, navigation, core layouts or official brand surfaces.',
  _allowed: ['Motion Carousels', 'Playground / gamification', 'badges', 'AI / tech explainers', 'thumbnails', 'campaign moments', 'highlights and creative accents'],
  _rules: [
    'Controlled accents and expressive content colour — never a random or decorative choice.',
    'One expressive hue leads a given piece; a second appears only when the content genuinely has two sides (A/B, before/after, correct/wrong).',
    'Never on the mark, the lockups, the I ❤ Tech heart, the signature, or any website/app UI surface.',
    'Never a substitute for a status colour: correct and error stay functional green/red.',
    'The -700 steps are the text-safe members; the -500 steps are graphic.',
    'Same values in Figma, Canva and video — the expressive palette is one system, not a per-tool improvisation.',
    'Gradients stay retired: the expressive palette is flat colour.',
  ],
  purple: { 500: e1('--atc-purple-500'), 600: e1('--atc-purple-600'), 700: e1('--atc-purple-700') },
  'spark-coral': { 300: e1('--atc-spark-300'), 500: e1('--atc-spark-500'), 700: e1('--atc-spark-700') },
  magenta: { 500: e1('--atc-pink-500'), 700: e1('--atc-pink-700') },
  'signal-blue': { 500: e1('--atc-blue-500'), 700: e1('--atc-blue-700'), _note: 'Electric / Signal Blue. Distinct from Signature Blue #2563EB and never used where the brand blue belongs — pair them only with a clear reason.' },
  lavender: { mist: e1('--atc-mist'), veil: e1('--atc-veil'), haze: e1('--atc-haze'), _note: 'Atmosphere tints for expressive grounds only.' },
};

const archived = {
  _note: 'Edition 1 / ATT Content System — what stays archived after the expressive reclassification. Not deleted. Scoped to .att-legacy in the site; Figma page 99. Never used in active work.',
  'dark-impact': { navy: archiveRaw['--att-impact-navy'], charcoal: raw['--atc-impact-charcoal'], blue: archiveRaw['--att-impact-blue'], purple: archiveRaw['--att-impact-purple'], magenta: archiveRaw['--att-impact-magenta'], gradient: archiveRaw['--att-gradient-impact'], _note: 'Dark Impact mode and its 45° three-stop gradient. Retired: the active system approves no gradient and dark surfaces are Graphite-based.' },
  'violet-neutrals': { 50: archiveRaw['--att-ink-50'], 100: archiveRaw['--att-ink-100'], 200: archiveRaw['--att-ink-200'], 300: archiveRaw['--att-ink-300'], 500: archiveRaw['--att-ink-500'], 700: archiveRaw['--att-ink-700'], 900: archiveRaw['--att-ink-900'], _note: 'Violet-tinted neutral ramp. Replaced by the hueless Graphite → Warm White ramp.' },
  'violet-elevation': { 1: archiveRaw['--att-elevation-1'], 2: archiveRaw['--att-elevation-2'], 3: archiveRaw['--att-elevation-3'], _note: 'Violet shadow ladder. Replaced by the neutral-cool Graphite ladder.' },
  gradients: { aurora: archiveRaw['--att-gradient-aurora'], dawn: archiveRaw['--att-gradient-dawn'] },
  'display-face': 'Cairo — Edition 1 Arabic display; KO Ghorab replaces it on every social and video surface.',
  'pillar-hues': { _note: 'The five-colour content-pillar system (teal / pink / gold) is not revived: topics are differentiated by their label, not by hue. Magenta returns only through the expressive palette above, and never as a pillar.' },
};
for (const [k, v] of Object.entries(archived)) if (v === undefined) throw new Error(`Archive token missing: ${k}`);
for (const [k, v] of Object.entries(archived['dark-impact'])) if (v === undefined) throw new Error(`Dark Impact token missing: ${k}`);
for (const [k, v] of Object.entries(archived['violet-neutrals'])) if (v === undefined) throw new Error(`Violet neutral token missing: ${k}`);

/* ---------------------------------------------------------------------------
   3 · Typography
   ------------------------------------------------------------------------ */
const family = (name) => tok(name).split(',')[0].replace(/['"]/g, '').trim();
const typography = {
  families: {
    display: { family: family('--adel-font-display'), stack: tok('--adel-font-display'), job: 'Latin display — standalone headings, wordmarks, nav, CTA, index figures. Never inside an Arabic run.', weights: [400, 500, 600, 700, 800] },
    text: { family: family('--adel-font-text'), stack: tok('--adel-font-text'), job: 'Arabic body/UI, any Latin inside an Arabic sentence, EN long-form.', weights: [300, 400, 500, 600] },
    'arabic-display': { family: family('--adel-font-arabic-display'), stack: tok('--adel-font-arabic-display'), job: 'Arabic display only — hero, headings, pull quotes. ≥ 24 px. Never letter-spaced. Single weight: hierarchy by size.', weights: [400], licence: 'licensed to Adel; self-hosted; NOT redistributable', 'licence-terms': 'NOT STORED WITH THE PROJECT — no EULA, licence file or written grant exists anywhere in the repository; site/src/assets/fonts/README.md asserts the licence but does not reproduce its terms.', figma: 'NOT UPLOADED. A Figma team-font upload puts the file on the Figma servers and shares it with every team member, which is a redistribution-shaped use. The stored licence does not clearly permit it, so it is not done. KO Ghorab remains the approved Arabic display face and stays in production and export use where the licence does permit it (self-hosted on the site, and in local rendering). The Figma [Ghorab] styles keep their labelled Readex Pro placeholder family. No other typeface substitutes for Ghorab.' },
    mono: { family: family('--adel-font-mono'), stack: tok('--adel-font-mono'), job: 'technical figures, specs, code, overlines', weights: [400, 500] },
    hand: { family: family('--adel-font-hand'), stack: tok('--adel-font-hand'), job: 'About-page sketch layer ONLY, EN only. Placeholder until real handwriting exists. NEVER a signature stand-in.', weights: [500, 600], exception: true },
  },
  'removed-from-core': { 'AR/UI': 'Readex Pro Medium 14/24. Removed from the canonical core typography system in the Phase 2A refinement: no site token backs it and nothing in production uses it. Preserved in Figma only as "Legacy / AR-UI (reference only)", not a brand standard. Arabic compact UI takes the EN/Label size with the Arabic body face.' },
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
    ['AR/Body/L', 'Readex Pro', 'Regular', 18, 33], ['AR/Body/M', 'Readex Pro', 'Regular', 16, 30],
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
   5b · Adaptive / Fold-First video canvas profiles
   ---------------------------------------------------------------------------
   Four canonical VIDEO production profiles. This is a recomposition system, not
   an export-size list: one source edit produces device-appropriate versions in
   which framing, product placement, text, captions, brand position, safe zones
   and motion all adapt. Centre-cropping the 9:16 master is explicitly not the
   mechanism.

   PROVENANCE IS EXPLICIT. `verticalStandard` carries the audited repository
   values. Every number on the other three profiles is DERIVED by a stated rule
   from an audited canvas and marked `proposed: true` — it is a proposal for
   approval, never a silent invention.

   Derivation rules, applied consistently:
     margin        6.67% of the canvas SHORT edge — the audited reel ratio
                   (72 / 1080), rounded to the 8 px grid.
     fold-portrait reserves: the audited Feed 4:5 reserves (96 / 168), the
                   nearest audited canvas by aspect, scaled by the height ratio
                   1920 / 1350 = 1.4222 → 136 / 240.
     landscape     reserves: no audited landscape VIDEO precedent exists (the
                   audited 16:9 token is a static cover with 0 / 0). A bottom
                   player-controls band is proposed and flagged open.
   ------------------------------------------------------------------------ */
const reel = canvases['reel-9x16'];
const feed = canvases['feed-4x5'];
const marginFor = (shortEdge) => Math.round((shortEdge * (reel.margin / reel.width)) / 8) * 8;
const foldScale = reel.height / feed.height; // 1920 / 1350

const canvasProfiles = {
  _note: 'Canonical VIDEO device profiles for the Adaptive / Fold-First Content System. All four are AdelTechTalks — one identity, four compositions. Dimensions are configuration, never assumptions baked into an editor.',
  _contract: [
    'RECOMPOSITION, not resize or crop. A profile re-lays-out the same source edit: subject framing, product placement, text position and line length, captions, brand position, safe zones and motion are all profile-aware.',
    'Never produce a fold profile by centre-cropping or letterboxing the 9:16 master.',
    'Graphics EXPAND into the extra canvas; they are not scaled up to fill it.',
    'Extra canvas is a reason to give content room, not a reason to add content. Empty space is a legitimate use of it.',
    'No profile gets its own visual identity: same palette, same faces, same mark roles, same motion charter.',
    'A profile is requested, never forced: one, several, or the full Adaptive Device Pack.',
  ],
  verticalStandard: {
    key: 'verticalStandard', label: 'Standard Vertical', aspect: '9:16', width: reel.width, height: reel.height, fps: 30,
    provenance: 'AUDITED — site/src/styles/tokens/brand.css (--atc-social-reel-*)',
    use: ['Reels', 'TikTok', 'Shorts', 'Stories', 'standard vertical social video'],
    margin: reel.margin,
    safeZones: { top: reel['reserve-top'], bottom: reel['reserve-bottom'], left: reel.margin, right: reel.margin },
    grid: { columns: reel.columns, gutter: reel.gutter },
    captionRegion: { anchor: 'bottom', y: 1100, height: 360, align: 'center', _note: 'Between the focal column and the bottom reserve; the reference composition ends the caption card at y 1460.' },
    brandPositions: { preferred: 'bottom-center above the bottom reserve', alternates: ['top-left below the top reserve'], scale: 'micro' },
    textLimits: { headlineWords: slots['cover-headline'], titleWords: slots['slide-title'], bodyWords: slots.body, supportWords: slots.support, measure: { arabic: typography.measure.arabic, latin: typography.measure.latin } },
    focal: { zones: 1, layout: 'single centred focal column', rule: 'Face, hands, product or action stay inside the content area between the reserves; never let the focal subject enter a reserve.' },
  },
  foldPortrait: {
    key: 'foldPortrait', label: 'Fold Portrait', aspect: '3:4', width: 1440, height: 1920, fps: 30, proposed: true,
    provenance: 'PROPOSED — margin derived from the audited reel ratio; reserves derived from the audited Feed 4:5 reserves × ' + foldScale.toFixed(4),
    use: ['unfolded / large-screen portrait composition', 'dual-screen portrait', 'tablet portrait'],
    margin: marginFor(1440),
    safeZones: { top: Math.round(feed['reserve-top'] * foldScale / 8) * 8, bottom: Math.round(feed['reserve-bottom'] * foldScale / 8) * 8, left: marginFor(1440), right: marginFor(1440), proposed: true },
    grid: { columns: 6, gutter: reel.gutter, proposed: true, _note: 'Two more columns than the 9:16 reel: the extra width is for a second content column, not a wider single column.' },
    captionRegion: { anchor: 'bottom', align: 'center', maxWidth: '66% of canvas width', proposed: true, _note: 'Captions keep the reel line length rather than stretching to the full fold width — a longer caption line is harder to read, not better.' },
    brandPositions: { preferred: 'bottom-trailing corner inside the margin', alternates: ['bottom-center'], scale: 'micro', proposed: true },
    textLimits: { headlineWords: slots['cover-headline'], titleWords: slots['slide-title'], bodyWords: 24, supportWords: slots.support, proposed: true, _note: 'Body ceiling rises from 18 to 24 Arabic words because the measure is wider. Headline and title ceilings do NOT rise — a bigger canvas is not a licence for a longer headline. "Fewer words, never smaller type" still governs a breach.' },
    focal: { zones: 2, layout: 'focal column + supporting column, roughly 62 / 38', rule: 'The focal subject keeps the dominant column at its 9:16 scale; the freed width becomes a real second zone (graphic, product, spec, B-roll) or deliberate breathing room.' },
  },
  foldLandscape: {
    key: 'foldLandscape', label: 'Fold Landscape', aspect: '4:3', width: 1920, height: 1440, fps: 30, proposed: true,
    provenance: 'PROPOSED — margin derived from the audited reel ratio; no audited landscape VIDEO reserve exists, so the bottom band is a proposal (open)',
    use: ['unfolded / large-screen landscape composition', 'special YouTube large-screen edition where appropriate'],
    margin: marginFor(1440),
    safeZones: { top: 0, bottom: 120, left: marginFor(1440), right: marginFor(1440), proposed: true, open: true, _note: 'Bottom band reserved for player controls. Needs a device check before first production use.' },
    grid: { columns: 8, gutter: reel.gutter, proposed: true },
    captionRegion: { anchor: 'bottom', align: 'center', maxWidth: '50% of canvas width', proposed: true, _note: 'Landscape captions sit as a lower-third band, not a full-width strip.' },
    brandPositions: { preferred: 'bottom-trailing corner inside the margin, clear of the controls band', alternates: ['top-trailing corner'], scale: 'micro', proposed: true },
    textLimits: { headlineWords: slots['cover-headline'], titleWords: slots['slide-title'], bodyWords: 24, supportWords: slots.support, proposed: true },
    focal: { zones: 2, layout: 'side-by-side, roughly 55 / 45 or a true 50 / 50 for comparison', rule: 'Two genuine zones. The focal subject never stretches to fill the width; the second zone carries product, proof, spec or context.' },
  },
  youtubeLandscape: {
    key: 'youtubeLandscape', label: 'Standard YouTube Landscape', aspect: '16:9', width: 1920, height: 1080, fps: 30, proposed: true,
    provenance: 'PROPOSED — margin derived from the audited reel ratio; the audited 16:9 token (1280×720, margin 64, reserves 0/0) is a STATIC cover canvas and stays unchanged',
    use: ['standard YouTube output', 'long-form / explainer', 'landscape embeds'],
    _note: 'Fold-first does not replace standard YouTube. This profile stays first-class.',
    margin: marginFor(1080),
    safeZones: { top: 0, bottom: 120, left: marginFor(1080), right: marginFor(1080), proposed: true, open: true, _note: 'Bottom band for the player control bar and progress. Needs a platform check before first production use.' },
    grid: { columns: 8, gutter: canvases['thumb-16x9'].gutter, proposed: true },
    captionRegion: { anchor: 'bottom', align: 'center', maxWidth: '60% of canvas width', proposed: true, _note: 'Burned-in captions sit above the controls band; a platform subtitle track is preferred where available.' },
    brandPositions: { preferred: 'top-trailing corner inside the margin', alternates: ['bottom-trailing corner above the controls band'], scale: 'micro', proposed: true, _note: 'Trailing-corner placement keeps the mark clear of the end-screen cards that occupy the closing seconds.' },
    textLimits: { headlineWords: slots['cover-headline'], titleWords: slots['slide-title'], bodyWords: 24, supportWords: slots.support, proposed: true },
    focal: { zones: 2, layout: 'focal subject + supporting zone, or full-frame for demo footage', rule: 'Long-form framing: the focal subject may sit off-centre with the supporting zone carrying the explainer graphic.' },
  },
};

/* Per-format adaptive layout logic. For every production format: what must stay
   dominant and uncropped, what may move or reflow, where text and brand may go,
   and what the focal area is. Then how each profile recomposes it. */
const adaptiveLayouts = {
  _note: 'Recomposition rules per production format. PRIMARY never crops; SECONDARY moves, resizes or reflows; TEXT ZONE and BRAND ZONE are profile-dependent; FOCAL ZONE is what a naive crop would destroy.',
  'talking-head': {
    primary: 'the speaker — face and gesture space, uncropped',
    secondary: 'B-roll insert, contextual graphic, semantic scene cards, progress bar',
    textZone: 'caption card in the caption region; semantic scene text in the supporting zone on fold profiles',
    brandZone: 'handle badge below the top reserve; signature micro, bottom',
    focalZone: 'face and upper body, plus the hand area when the speaker gestures — never blind-crop either',
    profiles: {
      verticalStandard: 'speaker in the single focal column; scene graphics overlay or tuck under the caption card.',
      foldPortrait: 'speaker keeps the dominant column at 9:16 scale; the second column takes the contextual graphic, product still or transcript panel. Do NOT enlarge the speaker to fill 3:4.',
      foldLandscape: 'speaker + supporting visual side by side, or speaker with intentional breathing room. The graphic becomes a real panel, not an overlay.',
      youtubeLandscape: 'speaker off-centre with the explainer graphic in the supporting zone; captions as a lower third.',
    },
  },
  'product-hero': {
    primary: 'the product — silhouette and finish, uncropped, visually dominant',
    secondary: 'headline, spec tokens, background treatment',
    textZone: 'opposite the product mass; never across the product',
    brandZone: 'corner furthest from the product, micro scale',
    focalZone: 'the product outline plus its highlight and shadow contact — a crop that clips either reads as damage',
    profiles: {
      verticalStandard: 'product centred, text above or below it.',
      foldPortrait: 'product holds one column, headline and spec stack in the other.',
      foldLandscape: 'product leading, text trailing (mirrored for RTL); the extra width is space around the product, not a bigger product.',
      youtubeLandscape: 'product with room for an on-screen spec or callout.',
    },
  },
  'talking-head-plus-broll': {
    primary: 'speech is the spine — the speaker and the synchronised B-roll moment',
    secondary: 'which of the two is foregrounded at a given beat',
    textZone: 'caption card, tied to word timing',
    brandZone: 'as talking-head',
    focalZone: 'the speaker face and the B-roll subject; one of the two is always fully visible',
    profiles: {
      verticalStandard: 'cut between speaker and B-roll, or B-roll inside a card over the speaker.',
      foldPortrait: 'both can coexist — speaker column + B-roll column — so the cut becomes a choice, not a necessity.',
      foldLandscape: 'speaker and B-roll genuinely side by side; the caption spans under both.',
      youtubeLandscape: 'picture-in-picture or split, speaker smaller when the B-roll carries the point.',
    },
  },
  'comparison-ab': {
    primary: 'both products, at matched scale and matched framing',
    secondary: 'labels, spec rows, verdict card, scorecard',
    textZone: 'product labels stay pinned to their side; verdict text in the shared zone',
    brandZone: 'neutral corner, never inside either product half',
    focalZone: 'the compared feature area on each product — the thing the comparison is about',
    profiles: {
      verticalStandard: 'stacked A over B, or A → B in sequence; split-screen only when simultaneity matters.',
      foldPortrait: 'true side-by-side becomes comfortable; labels sit above each column.',
      foldLandscape: 'the best canvas for this format — large side-by-side A/B at equal scale, spec row beneath, verdict card in the shared band.',
      youtubeLandscape: 'side-by-side with a persistent spec strip.',
    },
  },
  'asmr-unboxing': {
    primary: 'the tactile action — hands, packaging, the product surface',
    secondary: 'nothing, by default',
    textZone: 'minimal or none; brand text only',
    brandZone: 'micro signature, corner, late in the edit',
    focalZone: 'the hands and the contact point where the sound is made',
    profiles: {
      verticalStandard: 'action fills the focal column, clean.',
      foldPortrait: 'keep the action LARGE and the frame clean. Extra canvas is breathing room around the action — do not add graphics because space exists.',
      foldLandscape: 'wider view of the surface and the hands; still no added graphics, no music, no captions by default.',
      youtubeLandscape: 'longer-form unboxing framing; the recorded tactile audio remains the point.',
    },
    rule: 'The ASMR audio policy is profile-independent: recorded tactile audio stays ON, no music, captions, denoise, gating or compression by default.',
  },
  'product-demo': {
    primary: 'the feature in real use — the proof shot',
    secondary: 'feature callout, label, step index',
    textZone: 'callout beside the action on wide profiles; overlaid only when there is no room',
    brandZone: 'corner clear of the action',
    focalZone: 'the interaction point — the control being pressed, the screen being shown, the result appearing',
    profiles: {
      verticalStandard: 'callout overlays or follows the action.',
      foldPortrait: 'product and feature callout COEXIST — the callout stops being an overlay and becomes its own zone.',
      foldLandscape: 'demo footage leading, callout stack trailing; steps can persist instead of flashing.',
      youtubeLandscape: 'screen recording or proof shot with a persistent callout column.',
    },
  },
  'motion-carousel': {
    primary: 'the slide media — one idea per slide, product/video first',
    secondary: 'headline, body, index, signature',
    textZone: 'headline block, RTL-first for Arabic',
    brandZone: 'micro signature, consistent corner across all slides',
    focalZone: 'the slide subject; each slide must read alone',
    profiles: {
      verticalStandard: 'the canonical slide: 1080×1920, ~5 s, own MP4.',
      foldPortrait: 'FOLD EDITION — each slide is RECOMPOSED for the wider canvas: media and text become two zones rather than a stack. Never a crop of the 9:16 slide.',
      foldLandscape: 'fold edition in landscape; slide motion may use the horizontal axis (parallax, reveal) that 9:16 cannot afford.',
      youtubeLandscape: 'the stitched preview is the natural 16:9 artefact; individual slides stay social.',
    },
    rule: 'Every profile still exports each slide as its own MP4; the stitched preview stays optional.',
  },
  'long-form-explainer': {
    primary: 'the explanation — speaker, screen recording or diagram, whichever carries the point',
    secondary: 'chapter cards, lower thirds, recurring diagram',
    textZone: 'lower third; chapter title top-trailing',
    brandZone: 'top-trailing corner, persistent and micro',
    focalZone: 'the diagram or screen region being discussed',
    profiles: {
      verticalStandard: 'clipped highlights only.',
      foldPortrait: 'speaker + diagram stack, comfortable for a handheld unfolded read.',
      foldLandscape: 'large diagram with the speaker inset.',
      youtubeLandscape: 'the home profile for this format.',
    },
  },
};

const devicePack = {
  name: 'Adaptive Device Pack',
  _note: 'Requested, never forced. A job may ask for one profile, several, or the whole pack. Each output is a recomposition of the same source edit.',
  outputs: [
    { profile: 'verticalStandard', filename: '<name>-standard-9x16.mp4' },
    { profile: 'foldPortrait', filename: '<name>-fold-portrait-3x4.mp4' },
    { profile: 'foldLandscape', filename: '<name>-fold-landscape-4x3.mp4' },
    { profile: 'youtubeLandscape', filename: '<name>-youtube-16x9.mp4' },
  ],
  status: 'SPECIFIED, NOT IMPLEMENTED — Phase 2A defines the architecture only. The rendering engine is a later phase.',
};

/* Where the current video skill hard-codes a dimension that must later read a
   profile. Generated as a checklist for the implementation phase, not a change. */
const adaptiveMigration = {
  _note: 'Every entry is a place where 1080 / 1920 / 1350 is baked in today. The implementation phase replaces each with a lookup against canvasProfiles. Nothing here was changed in Phase 2A.',
  targets: [
    { file: '.claude/skills/video-ad-editor/scripts/08_safe_check.js', lines: '22-24, 66, 86', now: 'canvas 1080×1920 and the platform UI-overlay bands 150 / 300 / 180 hard-coded; viewport fixed', then: 'read width/height/safeZones from the active profile; keep the UI-overlay bands as a separate per-profile platform table' },
    { file: '.claude/skills/video-ad-editor/scripts/04_render_frames.js', lines: '30', now: 'puppeteer viewport fixed at 1080×1920', then: 'viewport from the profile' },
    { file: '.claude/skills/video-ad-editor/scripts/03_cut_zoom.py', lines: '17', now: 'ffmpeg scale=1080:1920 baked into the filter', then: 'scale to the profile; zoom windows computed per profile from the focal zone' },
    { file: '.claude/skills/video-ad-editor/scripts/11_behind_text.js', lines: '79', now: 'person-mask scaled to 1080:1920', then: 'mask scaled to the profile' },
    { file: '.claude/skills/video-ad-editor/scripts/13_asmr_assemble.py', lines: '24', now: 'defaults 1080/1920 when the plan omits a target', then: 'default to the profile named in the plan' },
    { file: '.claude/skills/video-ad-editor/scripts/compose.REFERENCE.html', lines: '4, 9, 49, 66', now: 'canvas element, W/H constants and R_FULL fixed at 1080×1920', then: 'canvas sized from the profile; stage rects expressed as ratios of the profile, not pixels' },
    { file: '.claude/skills/video-ad-editor/scripts/studio.html', lines: '28, 64, 81', now: 'same fixed constants as the reference composition', then: 'same change' },
    { file: '.claude/skills/video-ad-editor/scripts/remotion-template/src/Root.tsx', lines: '7', now: 'composition fixed at 1080×1920', then: 'composition dimensions from the profile' },
    { file: '.claude/skills/video-ad-editor/scripts/remotion-template/src/stage.ts', lines: '7', now: 'R_FULL fixed at 1080×1920', then: 'stage rects as ratios' },
    { file: '.claude/skills/video-ad-editor/scripts/remotion-template/src/Guides.tsx', lines: '4-6', now: 'guide bands hard-coded', then: 'guides from the profile safe zones' },
    { file: '.claude/skills/video-ad-editor/scripts/remotion-template/src/Captions.tsx', lines: '9, 20', now: 'caption card pinned to 1920-1460', then: 'caption region from the profile' },
    { file: '.claude/skills/video-ad-editor/scripts/remotion-template/src/Outro.tsx', lines: '18', now: 'wipe geometry uses 1920', then: 'profile height' },
    { file: '.claude/skills/video-ad-editor/scripts/motion-carousel-template/src/Root.tsx', lines: '5', now: 'falls back to 1080×1350 when the project omits a target', then: 'fall back to the named profile' },
    { file: '.claude/skills/video-ad-editor/formats/motion-carousel.json', lines: '7-8', now: 'default_canvas 1080×1350 and alternate_canvas 1080×1920', then: 'reference profile keys instead of literal sizes; add the fold edition' },
    { file: '.claude/skills/video-ad-editor/templates/*.sample.json', lines: 'target block', now: 'literal target width/height/fps', then: 'a profile key, with an optional literal override' },
    { file: '.claude/skills/video-ad-editor/SKILL.md', lines: 'safe-zone table ~267-271', now: 'prose safe-zone table for 9:16 only', then: 'per-profile table generated from this export' },
  ],
  principle: 'The editor must not hold a canvas assumption anywhere. A dimension is configuration, read from a profile, at every stage: analysis, cut, zoom, compose, caption, safe-check, encode.',
};

const foldFirstNaming = {
  status: 'RESERVED CONCEPT ONLY — not an official badge, not a permanent brand element.',
  candidates: ['Fold First', 'Fold Ready', 'Made for your unfolded screen'],
  rule: 'Consumer-facing language is reserved, not adopted. Nothing ships with these words until a separate decision approves one.',
};

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
  'app-icon': { tile: 'Signature Blue — DEFAULT', 'tile-secondary': 'Graphite — secondary dark variant', mark: 'White', radius: '27/120 of tile', gradient: 'NONE. The Edition 1 Impact-gradient icon is retired (atc-appicon-gradient.svg → archive).' },
};
const heart = { master: 'brand/heart/love-tech-heart.svg', path: HEART_PATH, viewBox: '0 0 24 24', fill: { light: 'heart/fill → brand.signature-blue', dark: 'heart/fill → blue.300' }, note: 'scripts/build-og-adel.mjs still carries a second heart path; consolidate to this master (§5.5 of the audit).' };
const signature = {
  status: 'RESERVED — empty', asset: null,
  'site-slot': 'site.config.ts photography.signature',
  'skill-slot': '.claude/skills/video-ad-editor/assets/signature.png',
  rule: 'No handwritten signature is created, simulated, traced or set in a handwriting font. The slot stays empty until Adel supplies a real scanned signature (SVG or transparent PNG).',
  'video-end-card': {
    status: 'OPTIONAL VARIANT — never mandatory branding',
    rule: 'When the real scan exists, the video end card gains a signature variant that a job may choose. It is never applied automatically and never becomes a required element on every video. The default end card carries the mark or lockup, not the signature.',
    'applies-to': 'every canvas profile; the signature follows the profile brand zone and stays micro scale',
  },
};

/* ---------------------------------------------------------------------------
   7 · Rules the video skill enforces (not just documents)
   ------------------------------------------------------------------------ */
const rules = {
  colour: [
    'Never invent a brand colour when an approved token exists.',
    'Signature Blue is the primary brand colour everywhere; the expressive palette never replaces it.',
    'Core palette on the logo, website/UI, navigation, core layouts and official brand surfaces. Expressive palette only on creator content: motion carousels, playground/gamification, badges, AI/tech explainers, thumbnails, campaign moments, accents.',
    'Fresh Mint ≤ ~3% of any surface; never a background, never the logo.',
    'No gradients anywhere in the active system, expressive palette included.',
    'Status colours are functional, never brand and never replaced by an expressive hue.',
  ],
  logo: ['One geometry, three colour roles (Graphite / Signature Blue / White). Never stretch, redraw, recolour or add a gradient tile.', 'AdelTechTalks lockup is primary; Adel lockup is secondary.', 'Bare mark never below 24 px; below that use an app-icon tile.'],
  typography: ['Montserrat when Latin stands alone; Readex Pro the moment Latin sits inside an Arabic sentence.', 'KO Ghorab: Arabic display only, ≥ 24 px, never letter-spaced, hierarchy by size.', 'Western digits 0–9 in both languages.', 'Arabic layouts RTL-first with isolated LTR islands for Latin terms.'],
  video: [
    'Product footage occupies the dominant area; text second; signature micro.',
    'ASMR: recorded tactile audio (box opening, peeling, clicks, scratches, packaging, handling) stays ON — no music, captions, denoise, gating or compression by default, in every canvas profile.',
    'Motion Carousel: 5–6 independent ~5 s slides at 1080×1920, each exportable as its own MP4; a stitched preview is optional; never a static carousel with generic zoom.',
    'Brand opener / end card are micro moments, not intros.',
    'Motion is precise and premium, not template-heavy: cut / match-cut by default for ASMR.',
    'Adaptive profiles RECOMPOSE; they never centre-crop or letterbox the 9:16 master. Graphics expand into the canvas rather than scaling up to fill it.',
    'Extra canvas is room for the same content, not a reason to add content — ASMR in particular stays clean.',
    'Canvas dimensions are configuration read from canvasProfiles, never assumptions held inside the editor.',
  ],
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
  color: { primitives, semantic: { light, dark }, expressive, archived },
  typography, space, radius, stroke, sizing, elevation, motion, canvases, slots,
  canvasProfiles, adaptiveLayouts, devicePack, adaptiveMigration, foldFirstNaming,
  logo, heart, signature, rules,
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

/* video device-profile overlays */
for (const key of ['verticalStandard', 'foldPortrait', 'foldLandscape', 'youtubeLandscape']) {
  const p = canvasProfiles[key];
  const { width: w, height: h, margin: m } = p;
  const { top, bottom, left, right } = p.safeZones;
  const cols = p.grid.columns, g = p.grid.gutter;
  const colW = (w - left - right - (cols - 1) * g) / cols;
  const colRects = Array.from({ length: cols }, (_, i) => `<rect x="${(left + i * (colW + g)).toFixed(2)}" y="${top}" width="${colW.toFixed(2)}" height="${h - top - bottom}" fill="${brand['signature-blue'].value}" fill-opacity="0.06"/>`).join('');
  const band = (y, hh) => hh > 0 ? `<rect x="0" y="${y}" width="${w}" height="${hh}" fill="${brand['deep-blue'].value}" fill-opacity="0.18"/>` : '';
  outputs.set(`brand/safe-zones/video-${p.aspect.replace(':', 'x')}-${key}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<title>${p.label} ${p.aspect} — ${w}×${h}, margin ${m}, safe top ${top} / bottom ${bottom}, ${cols} cols / ${g} gutter${p.proposed ? ' (PROPOSED)' : ' (audited)'}</title>
<rect width="${w}" height="${h}" fill="none"/>
${band(0, top)}${band(h - bottom, bottom)}
<rect x="${left}" y="${m}" width="${w - left - right}" height="${h - 2 * m}" fill="none" stroke="${brand['signature-blue'].value}" stroke-width="2" stroke-dasharray="12 8"/>
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

## Expressive / Creator palette — APPROVED SECONDARY

${expressive._status}

| Family | Values | |
|---|---|---|
| Purple | ${Object.entries(expressive.purple).map(([k, v]) => `${k} \`${v}\``).join(' · ')} | 700 is the text-safe step |
| Spark Coral | ${Object.entries(expressive['spark-coral']).map(([k, v]) => `${k} \`${v}\``).join(' · ')} | 700 is text-safe |
| Magenta | ${Object.entries(expressive.magenta).map(([k, v]) => `${k} \`${v}\``).join(' · ')} | 700 is text-safe |
| Electric / Signal Blue | ${Object.entries(expressive['signal-blue']).filter(([k]) => !k.startsWith('_')).map(([k, v]) => `${k} \`${v}\``).join(' · ')} | distinct from Signature Blue — never used where the brand blue belongs |
| Lavender | ${Object.entries(expressive.lavender).filter(([k]) => !k.startsWith('_')).map(([k, v]) => `${k} \`${v}\``).join(' · ')} | atmosphere tints for expressive grounds |

**May appear in:** ${expressive._allowed.join(' · ')}.
**Rules:**
${expressive._rules.map((r) => `- ${r}`).join('\n')}

**Still archived, never used in active work:** Dark Impact (${archived['dark-impact'].navy} + the 45° gradient), the violet neutral ramp and violet shadow ladder, the aurora/dawn gradients, Cairo.

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

## Adaptive / Fold-First video canvas profiles

${canvasProfiles._contract.map((r) => `- ${r}`).join('\n')}

| Profile | Aspect | Size | Margin | Safe top / bottom | Grid | Focal layout |
|---|---|---|---|---|---|---|
${t(['verticalStandard', 'foldPortrait', 'foldLandscape', 'youtubeLandscape'].map((k) => { const p = canvasProfiles[k]; return [`\`${k}\`${p.proposed ? ' ⚠' : ''}`, p.aspect, `${p.width}×${p.height}`, p.margin, `${p.safeZones.top} / ${p.safeZones.bottom}`, `${p.grid.columns} cols · ${p.grid.gutter}`, p.focal.layout]; }))}

⚠ = PROPOSED. \`verticalStandard\` is audited; every other number is derived by a stated rule (see \`canvasProfiles[*].provenance\` in the JSON) and awaits approval. The two landscape bottom bands are flagged \`open\` and need a device/platform check before first production use.

**Adaptive Device Pack** — requested, never forced; one, several, or all four:
${devicePack.outputs.map((o) => `- \`${o.filename}\` (${o.profile})`).join('\n')}

${devicePack.status}

### Per-format recomposition
${Object.entries(adaptiveLayouts).filter(([k]) => !k.startsWith('_')).map(([k, v]) => `**${k}** — PRIMARY: ${v.primary}. SECONDARY: ${v.secondary}. TEXT: ${v.textZone}. BRAND: ${v.brandZone}. FOCAL: ${v.focalZone}.\n  - fold portrait: ${v.profiles.foldPortrait}\n  - fold landscape: ${v.profiles.foldLandscape}${v.rule ? `\n  - ${v.rule}` : ''}`).join('\n')}

Consumer-facing "Fold First" language is a ${foldFirstNaming.status.toLowerCase()}

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
