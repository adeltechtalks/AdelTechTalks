# Phase 2A — Execution report (modules 00–03)

> **Refinement applied 2026-09-14.** Phase 2A is directionally approved and **not final**. The eight review decisions are resolved in `05_PHASE2A_REFINEMENT.md`; this report reflects the refined state. Headline changes: dark semantic values resolved and contrast-checked (zero open flags), KO Ghorab verified and deliberately **not** uploaded, Signature Blue set as the default app-icon ground, the four legacy pages relabelled `Legacy / Reference` and ordered after 99, `AR/UI` removed from the core, the signature end card defined as an optional variant, and the Motion Carousel canonical canvas corrected to 1080×1920.

**Date:** 2026-09-14 · **Figma file:** `OD9bQi6eWexQi53tLKoctW` · **Branch:** `claude/adeltechtalks-brand-os-phase2-9rz7ct`
**Scope executed:** Figma modules 00–03, canonical variables, colour system (core + expressive), typography system, logo/mark rules, signature placeholder, light/dark surfaces, social/video safe-zone tokens, the Adaptive / Fold-First canvas profile architecture, machine-readable repo export. Intent was recorded first in `02_PHASE2A_FIGMA_PLAN.md`; this is what was actually built.
**Not touched:** Canva, Adobe, Supabase/RLS, the CI security check, the website deploy, any signature artwork, the video skill's hard-coded dimensions and safe-zone defaults. No fold video was generated, nothing published, no campaign.

---

## 1 · Figma page / module inventory

| Page | ID | Status after 2A |
|---|---|---|
| `00 — Brand Overview` | `0:1` | renamed from `00 — Brand System`; 23 canvas-level swatches/labels re-parented **into** the `Brand Foundations v2.1` section (empty-section defect fixed); typography note moved off the Soft Gray swatch; new `Brand OS · module index` frame; superseded note on the legacy Typography & Language section |
| `01 — Foundations` | `18:2` | **new** — Colour / Primitives board, Colour / Semantic Light·Dark board (explicit modes), **Colour / Expressive board**, Type / Space & Shape / Motion tables, **Adaptive / Fold-First device-profile board**, Canvas & Safe Zones board (frames bound to `canvas/*` variables, one per mode) |
| `02 — Logo & Signature` | `18:3` | **new** — 5 component sets + 2 components + clear-space/misuse sheet (§4) |
| `03 — Typography` | `18:4` | **new** — specimen sheet applying all 28 text styles; faces / roles / exceptions table |
| `04 — Core Components` | `6:2` | renamed from `03 — Components`; **adaptive-implications spec frame added** — components are Phase 2B |
| `05 — Static Ultra Carousel` · `08 — Social / Channel` | `18:5` `18:8` | **new, empty** — reserved so the approved order is visible |
| `06 — Motion Carousel` | `18:6` | **new** — standard and fold-first motion composition spec frame; storyboards are Phase 2B |
| `07 — Video System` | `18:7` | **new** — Adaptive Device Pack and per-format recomposition spec frame; kits are Phase 2B |
| `09 — Web Components` | `1:4` | renamed from `01 — Website Approved`; content untouched |
| `90 — Export Library` | `6:4` | renamed from `05 — Export Assets`; **spec frame for the machine-readable device/canvas profiles added** |
| `99 — Archive / Edition 1` | `6:7` | renamed from `99 — Archive`; Edition 1 reference frame, **each swatch tagged "→ EXPRESSIVE (approved)" or "ARCHIVED"** after the reclassification |
| `Legacy / Reference — Website Explorations` · `— Mobile App` · `— 0 to Hero Product` · `— QA & Handoff` | `1:5` `6:3` `6:5` `6:6` | not in the approved taxonomy; relabelled **Legacy / Reference** and placed after 99 by explicit page order; intact, nothing deleted |

## 1b · Two approved additions, folded into this phase

**Expressive / Creator palette.** Edition 1 is no longer fully archived: Purple, Spark Coral, Magenta, Electric / Signal Blue and Lavender are reclassified as an approved **secondary** palette for creator content. The core palette and the expressive palette are shown as two separate boards on `01 — Foundations`, live in two separate variable collections, and are two separate blocks in the export — a consumer cannot confuse them. Rulings in `01_PHASE2A_DECISIONS.md §1b`.

**Adaptive / Fold-First Content System.** Four canonical video device profiles, per-format recomposition rules for all eight production formats, the Adaptive Device Pack naming, and the inventory of every hard-coded dimension in the video skill. Architecture and documentation only — no fold video was generated. Full spec in `04_ADAPTIVE_FOLD_FIRST.md`.

## 2 · Variables / tokens created — 217 variables in 8 collections

| Collection | Modes | Count | Contents |
|---|---|---|---|
| `Color / Primitives` (the pre-existing collection, renamed; its 9 variables renamed in place so page-00 bindings survived) | Value | 40 | `brand/*` 9 · `blue/50…900` 10 · `mint/100,300,500,700` · `ink/700` · `neutral/sunken, border, muted, graphite-raised` · `status/*` 6 · `alpha/*` 5 · **`neutral/graphite-sunken`** (the one value introduced by the refinement). Code syntax `var(--adel-…)` on every one. |
| `Color / Semantic` | **Light · Dark** | 34 | all aliases — `surface/*` 6 · `text/*` 7 · `border/*` 3 · `action/*` 6 · `accent/mint` · `mark/primary, alternate, reversed` · `heart/fill` · `focus/ring` · `status/*` 6. **Dark is RESOLVED**: every value carries either a documented precedent or a v2.1 derivation plus its measured contrast. Zero open flags. |
| `Type` | Value | 54 | `font/display, text, arabic-display, mono, hand` (STRING) · `size/xs…5xl` + `size/ar-*` · `leading/*` 8 · `tracking/*` 5 · `social/size|line/*` 16 · `slot/*` 7 |
| `Space & Shape` | Value | 37 | `space/0…32` 14 · `radius/*` 8 · `stroke/*` 4 · `control/*` 3 · `icon/*` 4 · `touch/target` · `mark/min-size, ratio, clearspace-ratio` |
| `Motion` | Value | 22 | `duration/*` 8 and `stagger/*` 2 as native **TIMING**, `ease/enter, exit, move` as native **EASING**, `distance/*` 5, `scale/*` 2, `sequence/*` 2 |
| `Canvas & Safe Zones` (static social) | **Reel 9:16 · Feed 4:5 · Square 1:1 · Thumb 16:9** | 7 | `canvas/width, height, margin, reserve-top, reserve-bottom` · `grid/columns, gutter`. Reel = 1080·1920·72·**260**·**420**·4·32; Feed = 1080·1350·72·96·168·6·24 (Static Ultra Carousel). |
| `Color / Expressive` | Value | 13 | `purple/500,600,700` · `spark-coral/300,500,700` · `magenta/500,700` · `signal-blue/500,700` · `lavender/mist,veil,haze`. Every description carries the secondary-only rule. |
| `Canvas / Video Device Profiles` | **Standard Vertical 9:16 · Fold Portrait 3:4 · Fold Landscape 4:3 · YouTube Landscape 16:9** | 10 | `canvas/width, height, margin, focal-zones, fps` · `safe/top, bottom, side` · `grid/columns, gutter`. Standard Vertical audited; the other three carry their derivation and a PROPOSED flag in every description. |

Effect styles: `Elevation/1`, `Elevation/2`, `Elevation/3` (Graphite shadow ladder).

### Core palette and Expressive palette, side by side

| | **CORE — v2.1 Blue (primary)** | **EXPRESSIVE — Creator (secondary)** |
|---|---|---|
| Where | logo · website / UI · navigation · core layouts · official brand surfaces · all video and social by default | motion carousels · playground / gamification · badges · AI / tech explainers · thumbnails · campaign moments · accents |
| Leads | **Signature Blue `#2563EB`** | one chosen hue per piece |
| Members | Signature Blue · Deep Blue `#1746A2` · Ice Blue `#DCEBFF` · Fresh Mint `#2DD4A8` (≤3%) · Graphite `#171A1F` · Slate `#667085` · Warm White `#FAFAF8` · White · Soft Gray `#E6E8EC` + blue/mint/ink ramps | Purple `#855FF2` `#6C41E4` `#5A32C4` · Spark Coral `#FFB4A3` `#FF6B57` `#CE3A24` · Magenta `#DB4A9B` `#B2317C` · Signal Blue `#3E7BFA` `#1F4BC0` · Lavender `#F8F6FF` `#F1EDFE` `#E6DFFC` |
| Never | invented values · gradients · Mint as a background or on the logo | on the mark, lockups, heart, signature or any site/app UI · as a status colour · replacing Signature Blue · as a gradient · chosen at random |

## 2b · Adaptive / Fold-First profiles

| Profile | Aspect | Size | Margin | Safe top / bottom | Side | Grid | Focal zones | Provenance |
|---|---|---|---|---|---|---|---|---|
| `verticalStandard` | 9:16 | 1080 × 1920 | 72 | 260 / 420 | 72 | 4 · 32 | 1 | **audited** |
| `foldPortrait` | 3:4 | 1440 × 1920 | 96 | 136 / 240 | 96 | 6 · 32 | 2 | ⚠ proposed — margin from the reel ratio, reserves from Feed 4:5 × 1.4222 |
| `foldLandscape` | 4:3 | 1920 × 1440 | 96 | 0 / 120 | 96 | 8 · 32 | 2 | ⚠ proposed — bottom band open, no audited precedent |
| `youtubeLandscape` | 16:9 | 1920 × 1080 | 72 | 0 / 120 | 72 | 8 · 24 | 2 | ⚠ proposed — bottom band open |

Each profile also carries its caption region, preferred brand positions, text limits and focal rules. Per-format PRIMARY / SECONDARY / TEXT / BRAND / FOCAL rules exist for all eight formats. Overlay SVGs generated at `brand/safe-zones/video-*.svg`. Adaptive Device Pack filenames are defined and the pack is requested, never forced.

Every value was read from `site/src/styles/tokens/*.css`; nothing was invented. Mint is documented as ≤ ~3% accent on both modes. No gradient exists anywhere in the active collections.

## 3 · Typography styles — 27 core + 1 legacy

Eight pre-existing styles were **retuned in place** (IDs kept) and twenty created. The refinement then removed `AR/UI` from the core, preserving it as `Legacy / AR-UI (reference only)`.

| Group | Styles |
|---|---|
| EN | `Display/Hero · I ❤ Tech` Montserrat ExtraBold 72/83 −4% · `Display/1` 56/64 · `Display/2` 44/52 · `Heading/1` 36/44 · `Heading/2` 28/36 · `Heading/3` 22/30 · `Heading/4` 18/26 · `Body/L` Readex Pro 18/30 · `Body/M` 16/26 · `Body/S` 14/22 · `Label` Medium 14/20 · `Caption` 12/18 · `Overline` SemiBold 12/16 +8% |
| AR | `Display/Hero [Ghorab]` 52/73 · `Display/Heading [Ghorab]` 32/46 · `Display/Quote [Ghorab]` 26/39 · `Body/L` 18/33 · `Body/M` 16/30 |
| Legacy | `Legacy / AR-UI (reference only)` Readex Pro Medium 14/24 — out of the core; Arabic compact UI uses the `EN/Label` size with Readex Pro |
| Social | `Cover [Ghorab]` 112/123 · `Title` Readex Bold 76/94 · `Sub` SemiBold 54/71 · `Body` 36/58 · `Support` 30/48 · `Label` Medium 26/32 · `Spec` JetBrains Mono Medium 34/40 · `Index` Montserrat ExtraBold 150/135 |
| Tech | `Code` JetBrains Mono 14/22 |

What changed versus the file's previous eight: EN body moved from Montserrat to **Readex Pro**; display sizes moved to the audited scale (Hero 64→72 ExtraBold, H1 48→56, H2 32→28); AR body leading 28→30 (1.85).

**KO Ghorab is deliberately not uploaded.** The licence terms are not stored with the project, so a team-font upload — which puts the file on Figma's servers and shares it with every member — is not clearly permitted. The four `[Ghorab]` styles keep **Readex Pro Regular as a labelled placeholder family**; sizes and leading are final and only the family would ever change. KO Ghorab remains the approved Arabic display face in production and export. See `05_PHASE2A_REFINEMENT.md §1`. No Caveat or Amiri style was created; both are documented as exceptions on page 03.

## 4 · Logo variants created (page 02)

| Component | ID | Variants | Binding |
|---|---|---|---|
| `Mark / A` | `21:108` | Tone = Graphite · Signature Blue · White (220.64 × 180) | fills → `mark/primary` · `mark/alternate` · `mark/reversed` (flip automatically in Dark mode) |
| `Heart / I ❤ Tech` | `21:109` | — (96 × 96, path from `LoveTech.astro`) | fill → `heart/fill` |
| `Lockup / AdelTechTalks` (primary) | `22:623` | Tone × 3 | mark instance + Montserrat ExtraBold 0.58 × mark, gap bound to `space/3`, tracking −2% |
| `Lockup / Adel (secondary)` | `22:639` | Tone × 3 | kept, documented as secondary (decision 2) |
| `Lockup / I ❤ Tech` | `22:652` | Ground = Light · Dark (explicit semantic mode per variant) | words → `text/primary`, heart → `heart/fill` (Signature Blue / blue-300) |
| `Tile / App Icon` | `22:661` | Ground = **Signature Blue (default)** · Graphite (secondary dark) | white mark, radius 27/120, no gradient; replaces the Impact-gradient icon |
| `Signature / Reserved slot` | `22:662` | — | dashed empty frame + rule text; **no artwork**. Records that the future real scan becomes an **optional** video end-card variant, never mandatory |
| `Sheet · Clear space, minimum size, misuse` | `22:664` | frame | 23%-of-height clear-space guide, 24 px floor, 40 px sample, misuse list, mark on five approved grounds |

Repo counterparts: `brand/logo/adel-mark.svg` (+ graphite / signature-blue / white) and `brand/heart/love-tech-heart.svg`, generated from the site masters; the build fails if the two mark files in the site ever diverge.

## 5 · Screenshots (in `docs/brand-os/evidence/`)

| File | Shows |
|---|---|
| `before_00-brand-system.png` | the page as found: swatches floating beside an empty section, typography note over the Soft Gray swatch |
| `after_00-brand-overview.png` | swatches inside the section, module index at right |
| `after_01-foundations.png` | primitives board, Light/Dark semantic board, Type / Space / Motion tables, the four canvas frames |
| `detail_01-semantic-light-dark.png` | the same semantic variables rendered under both modes |
| `detail_01-canvas-safe-zones.png` | Reel 260/420, Feed 96/168, Square 96/168, Thumb 0/0 reserves with the 72/64 margin guide |
| `after_02-logo-signature.png` | Mark / A, heart, both lockups, I ❤ Tech light/dark, tiles, reserved signature slot, clear-space sheet |
| `detail_02-love-tech-lockup.png` · `detail_02-clearspace-sheet.png` | close-ups |
| `after_03-typography.png` | all 28 styles as specimen rows (⚠ red labels = placeholder family), faces / exceptions table below |
| `detail_01-expressive-palette.png` | the Expressive / Creator palette board, shown separately from the core palette |
| `detail_01-adaptive-profiles.png` | the four video device profiles, each bound to its mode, with focal zones and the Device Pack |
| `detail_07-video-system-adaptive.png` | the per-format recomposition rules as documented on module 07 |
| `after_99-archive-edition1.png` | Edition 1 reference: each swatch tagged either "→ EXPRESSIVE (approved)" or "ARCHIVED" |
| `detail_01-semantic-light-dark.png` | the dark column now reads RESOLVED v2.1 with no open markers |

## 6 · Repository files changed

| File | Change |
|---|---|
| `brand/scripts/build-tokens.mjs` | **new** — generator; reads the token CSS and the two vector masters, writes everything below; `--check` mode fails when outputs are stale |
| `brand/tokens/adel-v2.1.json` | **new, generated** — the canonical machine-readable export (colour primitives / semantic light+dark / archived, typography incl. the Figma style list, space, radius, stroke, sizing, elevation, motion, canvases + safe zones, slot ceilings, logo geometry + roles + lockups, heart, signature slot, rules, video families) |
| `brand/logo/adel-mark*.svg` · `brand/heart/love-tech-heart.svg` · `brand/safe-zones/*.svg` | **new, generated** |
| `brand/safe-zones/video-*.svg` | **new, generated** — overlay per video device profile |
| `brand/README.md` · `brand/fonts/README.md` | **new** — ownership model, regenerate commands, licence notes |
| `docs/brand-os/04_ADAPTIVE_FOLD_FIRST.md` | **new** — the adaptive spec: profiles, per-format rules, Device Pack, migration inventory, open questions |
| `docs/brand-os/05_PHASE2A_REFINEMENT.md` | **new** — the eight resolved decisions, the dark-ladder contrast working, the KO Ghorab licence finding |
| `.claude/skills/video-ad-editor/formats/motion-carousel.json` | canonical canvas corrected to **1080×1920** bound to the `verticalStandard` profile; 1080×1350 demoted to an explicit alternate; fold editions recorded |
| `.claude/skills/video-ad-editor/BRAND_SYSTEM.md` | **regenerated** from the export; header says generated / do not edit — ownership ambiguity resolved. Now also renders the expressive palette and the adaptive profiles the skill must honour |
| `.claude/skills/video-ad-editor/brand/adeltechtalks.bootstrap.json` | marked **SUPERSEDED**; Alexandria/Inter removed; brand reserves 260/420/72 recorded; the 150/300/180 values relabelled as legacy UI-overlay detector defaults, not brand safe zones |
| `docs/brand-os/00_PHASE1_AUDIT.md` | addendum: skill exists at 3.1.0, ownership resolved, Figma state changed, decisions answered |
| `docs/brand-os/01_PHASE2A_DECISIONS.md` · `02_PHASE2A_FIGMA_PLAN.md` · `03_PHASE2A_REPORT.md` · `evidence/*.png` | **new** |

Not changed: `site/**` (no site code, no deploy), `scripts/security/**`, Supabase, `SKILL.md`, `formats/*.json`, `08_safe_check.js`.

## 7 · Before / after

| | Before (start of 2A) | After |
|---|---|---|
| Pages | 9; numbering collided with the approved taxonomy; 01–07 empty website scaffolds | 16; approved `00–99` order in place, 00–03 built, 04–90 reserved, 4 legacy pages parked |
| Variables | 1 collection, 9 flat colour variables, one mode, code syntax `--brand-*` | 8 collections, 217 variables, semantic Light/Dark, four static canvas modes, four video device-profile modes, code syntax = site `--adel-*` / `--atc-*` |
| Edition 1 colour | proposed for full archive | five families reclassified as the approved **Expressive / Creator** palette; the rest stays archived |
| Fold / large-screen | not addressed anywhere | four canonical video profiles, per-format recomposition rules, Device Pack naming, 16 hard-coded call sites inventoried |
| Text styles | 8; EN body in Montserrat; sizes off the audited scale | 28; audited faces and sizes; KO Ghorab role locked (family pending upload) |
| Components | 0 | 5 sets (13 variants) + 2 components |
| Effect styles | 0 | 3 |
| Empty-section defect | swatches outside the section | inside |
| `BRAND_SYSTEM.md` | hand-written, second source of truth | generated from the export |
| Bootstrap fonts / safe zones | Alexandria + Inter; 150/300/180 as brand values | superseded; 260/420/72 brand reserves; legacy values labelled as detector defaults |
| Skill safe-check defaults | hard-coded 150/300/180 | unchanged (deferred by decision 6) |

## 8 · Unresolved questions

1. **KO Ghorab in Figma and Canva.** Adel must upload the licensed OTF/WOFF2 as a Figma team font (and later a Canva brand font). Until then the four `[Ghorab]` styles show Readex Pro. After upload: change the family on those four styles; nothing else moves.
2. **Dark-mode values without a precedent** (marked ⚠ in Figma and `open: true` in the export): `surface/sunken` (currently = canvas), `surface/tint` (currently `blue/900`), and the `action/primary-bg / -hover / -pressed` ladder on dark (currently the light ladder). Rule on these before any dark template is built.
3. **App-icon tile ground:** Signature Blue (recommended) or Graphite — both variants exist; pick one as default.
4. **The four parked pages** (`Website Explorations`, `Mobile App`, `0 to Hero Product`, `QA & Handoff`): fold into `09 — Web Components` / `99 — Archive`, or give them a home outside the Brand OS file?
5. **`AR/UI` style (Readex Pro Medium 14/24)** has no site token behind it; keep, retune, or drop.
6. **Signature on the video end card:** yes/no, so the reserved slot's role in `07 — Video System` is known before Phase 2B.
7. **Amiri on the holding page:** keep the scripture exception (documented) or drop Amiri entirely.
8. **Second heart path in `scripts/build-og-adel.mjs`** still differs from the `LoveTech` master; consolidate in a site change (not done here — no site code touched in 2A).
9. **Figma → CSS sync direction.** The generator reads the site CSS today. A later phase should either export Figma variables to CSS or verify the two against each other in CI (`--check` already guards repo freshness).
0. **Resolved by the refinement** (no longer open): KO Ghorab (verified, not uploaded) · the five dark values · app-icon ground · parked pages · `AR/UI` · signature end card · Amiri · heart path. See `05_PHASE2A_REFINEMENT.md`.
10. **Adaptive profiles awaiting approval** — the two landscape bottom bands (120 px, no audited precedent), the fold-portrait reserve derivation (136 / 240), the body word ceiling rising to 24 on wide profiles, the focal splits, which landscape profile is the default large-screen YouTube edition, frame rate per profile, and whether the Device Pack should have a default subset. Detail in `04_ADAPTIVE_FOLD_FIRST.md §8`.
11. **Expressive palette coverage** — whether any family beyond the five (for example the Edition 1 teal or gold) should join, and whether badges are the one component where an expressive hue is the default rather than an option.
12. **Figma pages 00's legacy sections** (Typography & Language, Badge Taxonomy, Visual Direction) are kept as pre-2A reference; the type section is marked superseded. Decide whether they move to 99 in Phase 2B.

## 9 · What Phase 2B would do (not started)

`04 — Core Components` (badge taxonomy from the existing section — the one place the expressive palette is expected — chips, buttons, brand bar, index counter, spec row, CTA end card, lower-third, title card, each with adaptive Zone variants) → `05 — Static Ultra Carousel` masters (1080 × 1350, AR/EN/mixed, light/dark) → `06 — Motion Carousel` storyboards (5–6 × ~5 s at 1080 × 1920) → `07 — Video System` kits → then Canva rebuild from the export, then the video skill refactor: safe zones and canvas dimensions read from `canvasProfiles`, and the recomposition engine behind the Adaptive Device Pack.
