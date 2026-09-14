# Phase 2A — Execution report (modules 00–03)

**Date:** 2026-09-14 · **Figma file:** `OD9bQi6eWexQi53tLKoctW` · **Branch:** `claude/adeltechtalks-brand-os-phase2-9rz7ct`
**Scope executed:** Figma modules 00–03, canonical variables, colour system, typography system, logo/mark rules, signature placeholder, light/dark surfaces, social/video safe-zone tokens, machine-readable repo export. Intent was recorded first in `02_PHASE2A_FIGMA_PLAN.md`; this is what was actually built.
**Not touched:** Canva, Adobe, Supabase/RLS, the CI security check, the website deploy, any signature artwork, the video skill's hard-coded safe-zone defaults.

---

## 1 · Figma page / module inventory

| Page | ID | Status after 2A |
|---|---|---|
| `00 — Brand Overview` | `0:1` | renamed from `00 — Brand System`; 23 canvas-level swatches/labels re-parented **into** the `Brand Foundations v2.1` section (empty-section defect fixed); typography note moved off the Soft Gray swatch; new `Brand OS · module index` frame; superseded note on the legacy Typography & Language section |
| `01 — Foundations` | `18:2` | **new** — Colour / Primitives board, Colour / Semantic Light·Dark board (explicit modes), Type / Space & Shape / Motion tables, Canvas & Safe Zones board (four frames bound to `canvas/*` variables, one per mode) |
| `02 — Logo & Signature` | `18:3` | **new** — 5 component sets + 2 components + clear-space/misuse sheet (§4) |
| `03 — Typography` | `18:4` | **new** — specimen sheet applying all 28 text styles; faces / roles / exceptions table |
| `04 — Core Components` | `6:2` | renamed from `03 — Components` (empty) — reserved |
| `05 — Static Ultra Carousel` · `06 — Motion Carousel` · `07 — Video System` · `08 — Social / Channel` | `18:5`–`18:8` | **new, empty** — reserved so the approved order is visible |
| `09 — Web Components` | `1:4` | renamed from `01 — Website Approved`; content untouched |
| `90 — Export Library` | `6:4` | renamed from `05 — Export Assets` (empty) |
| `99 — Archive / Edition 1` | `6:7` | renamed from `99 — Archive`; new reference frame with the Edition 1 palette + Impact gradient as plain unbound swatches |
| `zz · parked — Website Explorations` · `Mobile App` · `0 to Hero Product` · `QA & Handoff` | `1:5` `6:3` `6:5` `6:6` | not in the approved taxonomy; renamed and moved after 99; nothing deleted (see §8) |

## 2 · Variables / tokens created — 193 variables in 6 collections

| Collection | Modes | Count | Contents |
|---|---|---|---|
| `Color / Primitives` (the pre-existing collection, renamed; its 9 variables renamed in place so page-00 bindings survived) | Value | 39 | `brand/*` 9 · `blue/50…900` 10 · `mint/100,300,500,700` · `ink/700` · `neutral/sunken, border, muted, graphite-raised` · `status/*` 6 · `alpha/*` 5. Code syntax `var(--adel-…)` on every one. |
| `Color / Semantic` | **Light · Dark** | 34 | all aliases — `surface/*` 6 · `text/*` 7 · `border/*` 3 · `action/*` 6 · `accent/mint` · `mark/primary, alternate, reversed` · `heart/fill` · `focus/ring` · `status/*` 6. Dark values carry their precedent in the description; ⚠ marks the five with none (`surface/sunken`, `surface/tint`, the three `action/primary-*`). |
| `Type` | Value | 54 | `font/display, text, arabic-display, mono, hand` (STRING) · `size/xs…5xl` + `size/ar-*` · `leading/*` 8 · `tracking/*` 5 · `social/size|line/*` 16 · `slot/*` 7 |
| `Space & Shape` | Value | 37 | `space/0…32` 14 · `radius/*` 8 · `stroke/*` 4 · `control/*` 3 · `icon/*` 4 · `touch/target` · `mark/min-size, ratio, clearspace-ratio` |
| `Motion` | Value | 22 | `duration/*` 8 and `stagger/*` 2 as native **TIMING**, `ease/enter, exit, move` as native **EASING**, `distance/*` 5, `scale/*` 2, `sequence/*` 2 |
| `Canvas & Safe Zones` | **Reel 9:16 · Feed 4:5 · Square 1:1 · Thumb 16:9** | 7 | `canvas/width, height, margin, reserve-top, reserve-bottom` · `grid/columns, gutter`. Reel = 1080·1920·72·**260**·**420**·4·32 (Motion Carousel slide, all vertical video); Feed = 1080·1350·72·96·168·6·24 (Static Ultra Carousel). |

Effect styles: `Elevation/1`, `Elevation/2`, `Elevation/3` (Graphite shadow ladder).

Every value was read from `site/src/styles/tokens/*.css`; nothing was invented. Mint is documented as ≤ ~3% accent on both modes. No gradient exists anywhere in the active collections.

## 3 · Typography styles — 28 local text styles

Eight pre-existing styles were **retuned in place** (IDs kept) and twenty created.

| Group | Styles |
|---|---|
| EN | `Display/Hero · I ❤ Tech` Montserrat ExtraBold 72/83 −4% · `Display/1` 56/64 · `Display/2` 44/52 · `Heading/1` 36/44 · `Heading/2` 28/36 · `Heading/3` 22/30 · `Heading/4` 18/26 · `Body/L` Readex Pro 18/30 · `Body/M` 16/26 · `Body/S` 14/22 · `Label` Medium 14/20 · `Caption` 12/18 · `Overline` SemiBold 12/16 +8% |
| AR | `Display/Hero [Ghorab]` 52/73 · `Display/Heading [Ghorab]` 32/46 · `Display/Quote [Ghorab]` 26/39 · `Body/L` 18/33 · `Body/M` 16/30 · `UI` Medium 14/24 (carried over — no site token, review) |
| Social | `Cover [Ghorab]` 112/123 · `Title` Readex Bold 76/94 · `Sub` SemiBold 54/71 · `Body` 36/58 · `Support` 30/48 · `Label` Medium 26/32 · `Spec` JetBrains Mono Medium 34/40 · `Index` Montserrat ExtraBold 150/135 |
| Tech | `Code` JetBrains Mono 14/22 |

What changed versus the file's previous eight: EN body moved from Montserrat to **Readex Pro**; display sizes moved to the audited scale (Hero 64→72 ExtraBold, H1 48→56, H2 32→28); AR body leading 28→30 (1.85).

**KO Ghorab is not in the Figma font environment.** The four `[Ghorab]` styles carry **Readex Pro Regular as a placeholder family** with a description saying so; sizes and leading are final and only the family swaps once the licensed font is uploaded as a team font. No Caveat or Amiri style was created; both are documented as exceptions on page 03.

## 4 · Logo variants created (page 02)

| Component | ID | Variants | Binding |
|---|---|---|---|
| `Mark / A` | `21:108` | Tone = Graphite · Signature Blue · White (220.64 × 180) | fills → `mark/primary` · `mark/alternate` · `mark/reversed` (flip automatically in Dark mode) |
| `Heart / I ❤ Tech` | `21:109` | — (96 × 96, path from `LoveTech.astro`) | fill → `heart/fill` |
| `Lockup / AdelTechTalks` (primary) | `22:623` | Tone × 3 | mark instance + Montserrat ExtraBold 0.58 × mark, gap bound to `space/3`, tracking −2% |
| `Lockup / Adel (secondary)` | `22:639` | Tone × 3 | kept, documented as secondary (decision 2) |
| `Lockup / I ❤ Tech` | `22:652` | Ground = Light · Dark (explicit semantic mode per variant) | words → `text/primary`, heart → `heart/fill` (Signature Blue / blue-300) |
| `Tile / App Icon` | `22:661` | Ground = Signature Blue · Graphite | white mark, radius 27/120; replaces the Impact-gradient icon |
| `Signature / Reserved slot` | `22:662` | — | dashed empty frame + rule text; **no artwork** |
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
| `after_99-archive-edition1.png` | the archived Edition 1 palette and gradient, unbound |

## 6 · Repository files changed

| File | Change |
|---|---|
| `brand/scripts/build-tokens.mjs` | **new** — generator; reads the token CSS and the two vector masters, writes everything below; `--check` mode fails when outputs are stale |
| `brand/tokens/adel-v2.1.json` | **new, generated** — the canonical machine-readable export (colour primitives / semantic light+dark / archived, typography incl. the Figma style list, space, radius, stroke, sizing, elevation, motion, canvases + safe zones, slot ceilings, logo geometry + roles + lockups, heart, signature slot, rules, video families) |
| `brand/logo/adel-mark*.svg` · `brand/heart/love-tech-heart.svg` · `brand/safe-zones/*.svg` | **new, generated** |
| `brand/README.md` · `brand/fonts/README.md` | **new** — ownership model, regenerate commands, licence notes |
| `.claude/skills/video-ad-editor/BRAND_SYSTEM.md` | **regenerated** from the export; header says generated / do not edit — ownership ambiguity resolved |
| `.claude/skills/video-ad-editor/brand/adeltechtalks.bootstrap.json` | marked **SUPERSEDED**; Alexandria/Inter removed; brand reserves 260/420/72 recorded; the 150/300/180 values relabelled as legacy UI-overlay detector defaults, not brand safe zones |
| `docs/brand-os/00_PHASE1_AUDIT.md` | addendum: skill exists at 3.1.0, ownership resolved, Figma state changed, decisions answered |
| `docs/brand-os/01_PHASE2A_DECISIONS.md` · `02_PHASE2A_FIGMA_PLAN.md` · `03_PHASE2A_REPORT.md` · `evidence/*.png` | **new** |

Not changed: `site/**` (no site code, no deploy), `scripts/security/**`, Supabase, `SKILL.md`, `formats/*.json`, `08_safe_check.js`.

## 7 · Before / after

| | Before (start of 2A) | After |
|---|---|---|
| Pages | 9; numbering collided with the approved taxonomy; 01–07 empty website scaffolds | 16; approved `00–99` order in place, 00–03 built, 04–90 reserved, 4 legacy pages parked |
| Variables | 1 collection, 9 flat colour variables, one mode, code syntax `--brand-*` | 6 collections, 193 variables, semantic Light/Dark, four canvas modes, code syntax = site `--adel-*` / `--atc-*` |
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
10. **Figma pages 00's legacy sections** (Typography & Language, Badge Taxonomy, Visual Direction) are kept as pre-2A reference; the type section is marked superseded. Decide whether they move to 99 in Phase 2B.

## 9 · What Phase 2B would do (not started)

`04 — Core Components` (badge taxonomy from the existing section, chips, buttons, brand bar, index counter, spec row, CTA end card, lower-third, title card) → `05 — Static Ultra Carousel` masters (1080 × 1350, AR/EN/mixed, light/dark) → `06 — Motion Carousel` storyboards (5–6 × ~5 s at 1080 × 1920) → `07 — Video System` kits → then Canva rebuild from the export, then the video skill safe-zone refactor.
