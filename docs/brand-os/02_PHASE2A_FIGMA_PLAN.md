# Phase 2A — Figma intent for modules 00–03

**File:** `OD9bQi6eWexQi53tLKoctW` (team "Adel Mohamed's team", Pro).
**Written before execution** so the exact create/change list is on record. The post-execution inventory is in `03_PHASE2A_REPORT.md`.

## What the file contained at the start of Phase 2A (2026-09-14, 13:00 UTC)

This differs from the Phase 1 audit, which found no variables and no styles. Since then the file gained:

| Item | Found | Assessment |
|---|---|---|
| Pages | `00 — Brand System` (content) · `01 — Website Approved` · `02 — Website Explorations` · `03 — Components` · `04 — Mobile App` · `05 — Export Assets` · `06 — 0 to Hero Product` · `07 — QA & Handoff` · `99 — Archive` | pages 01–07 each hold one **empty** section (page 01 and 02 also hold stray labels describing other pages). The numbering collides with the approved 00–99 taxonomy. |
| Variable collection `AdelTechTalks / Brand Colors` | 9 COLOR variables, one `Default` mode, flat names (`Signature Blue`…), scopes `ALL_FILLS + STROKE_COLOR`, code syntax `var(--brand-*)` | values match the audited palette exactly. Names, grouping and code syntax do not match the site (`--adel-*`). No ramps, no semantic tier, no dark mode. The nine swatches on page 00 are bound to them. |
| Text styles (8) | `EN/Display/Hero` Montserrat Bold 64/68 · `EN/Display/H1` Montserrat Bold 48/54 · `EN/Heading/H2` Montserrat SemiBold 32/40 · `EN/Body/L` **Montserrat** 18/30 · `EN/Body/M` **Montserrat** 16/26 · `AR/Body/M` Readex Pro 16/28 · `AR/UI` Readex Pro Medium 14/24 · `Tech/Code` JetBrains Mono 14/22 | applied to zero nodes. EN body in Montserrat and the display sizes contradict the audited site scale (body is Readex Pro; display 56/64, headings 36/44, 28/36…). |
| Fonts available in Figma | Montserrat, Readex Pro, JetBrains Mono, Caveat (Regular/Bold only), Amiri, Cairo, Inter, Alexandria | **KO Ghorab is not available.** It must be uploaded as a team font by Adel (licence permits use). |

Before-screenshot: `evidence/before_00-brand-system.png`.

## Page mapping (approved taxonomy → file)

| Approved module | Action |
|---|---|
| `00 — Brand Overview` | rename existing `00 — Brand System`; keep every node; fix the empty-section defect by moving the 23 canvas-level swatches/labels **into** the `Brand Foundations v2.1` section; add a module index frame |
| `01 — Foundations` | **create**; variables documented on-canvas (palette, light/dark surface pairs, space, radius, motion, canvases + safe zones) |
| `02 — Logo & Signature` | **create**; components below |
| `03 — Typography` | **create**; text styles below, specimen sheet EN/AR/Social |
| `04 — Core Components` | rename existing empty `03 — Components` (its empty section renamed too) |
| `05`–`08` | **create empty reserved pages** so the approved order is visible; no content (Phase 2B+) |
| `09 — Web Components` | rename existing `01 — Website Approved` (content untouched) |
| `90 — Export Library` | rename existing empty `05 — Export Assets` |
| `99 — Archive / Edition 1` | rename existing `99 — Archive`; add one reference frame listing the archived Edition 1 palette (purple/lavender/coral/magenta/Dark Impact) and Cairo as **plain unbound swatches**, so they are visible and never linkable |
| not in the taxonomy | `02 — Website Explorations`, `04 — Mobile App`, `06 — 0 to Hero Product`, `07 — QA & Handoff` are renamed with a `zz · parked —` prefix and moved after 99. Nothing deleted. Adel decides their final home (§ unresolved). |

## 01 — Foundations: variable collections

Naming follows the site token names so code syntax is exact. All scopes set explicitly.

### `Color / Primitives` (1 mode `Value`) — the existing collection, renamed; the 9 existing variables are renamed in place so page-00 bindings survive

| Group | Variables | Source |
|---|---|---|
| `brand/` | signature-blue `#2563EB` · deep-blue `#1746A2` · ice-blue `#DCEBFF` · fresh-mint `#2DD4A8` · graphite `#171A1F` · slate `#667085` · warm-white `#FAFAF8` · white `#FFFFFF` · soft-gray `#E6E8EC` | `adel-v2.css` Tier 1 |
| `blue/` | 50 `#F0F6FF` · 100 `#DCEBFF` · 200 `#BBD7FF` · 300 `#8FB9FA` · 400 `#5B8EF4` · 500 `#2563EB` · 600 `#1D53CC` · 700 `#1746A2` · 800 `#123577` · 900 `#0D264F` | published CS v2.1 ramp |
| `mint/` | 100 `#DDF8F0` · 300 `#8FE9CE` · 500 `#2DD4A8` · 700 `#17A97F` | published ramp |
| `ink/` | 700 `#3A414C` | published ramp |
| `neutral/` (derived, not brand) | sunken `#F3F4F6` · border `#CDD1D8` · muted `#9AA1AC` | documented derived neutrals |
| `status/` (functional, not brand) | success `#17A96A` · success-text `#0F7A4C` · success-bg `#E6F5F3` · warning `#E08A0B` · error `#DB3A3F` · error-bg `#FFE9E4` | `adel-v2.css` |
| `alpha/` | white-06 · white-08 · white-10 · white-22 · graphite-94 | glass and navbar rgba values |

Code syntax WEB: `var(--adel-<name>)` for every primitive (e.g. `var(--adel-blue-300)`).

### `Color / Semantic` (modes `Light`, `Dark`) — aliases only, never raw hex

| Token | Light (from `adel-v2.css` Tier 2) | Dark (proposed from documented precedents) | Dark precedent |
|---|---|---|---|
| surface/canvas | warm-white | graphite | navbar ground, `--adel-surface-inverse` |
| surface/raised | white | `#25272C` → new primitive `neutral/graphite-raised` | documented composite of glass 0.94 over Warm White |
| surface/sunken | neutral/sunken | graphite | **no precedent — same as canvas, open** |
| surface/tint | ice-blue | blue/900 | **ramp step, no precedent — open** |
| surface/inverse | graphite | warm-white | mirror |
| surface/depth | mint/100 | mint/100 | unchanged (rare) |
| text/primary | graphite | white | `--adel-nav-fg-strong` |
| text/secondary | slate | soft-gray | `--adel-nav-fg` rest |
| text/tertiary | slate | soft-gray | mirrors light rule (size/weight, not paler) |
| text/inverse | white | graphite | mirror |
| text/link | signature-blue | blue/300 | `LoveTech` on-dark (Signature Blue fails 4.5:1 on Graphite) |
| text/link-hover | deep-blue | ice-blue | `--adel-nav-fg-hover` |
| text/on-tint | deep-blue | ice-blue | contrast on blue/900 |
| border/hairline | soft-gray | alpha/white-10 | `--adel-glass-border` |
| border/strong | neutral/border | alpha/white-22 | `--adel-nav-border` |
| border/brand | signature-blue | signature-blue | 3.37:1 ≥ 3:1 graphic floor |
| action/primary-bg · -hover · -pressed · -fg | signature-blue · blue/600 · deep-blue · white | **same ladder — open** | no dark ladder documented |
| action/secondary-fg | signature-blue | blue/300 | as link |
| action/secondary-bg-hover | ice-blue | alpha/white-08 | `--adel-nav-bg-hover` |
| accent/mint | fresh-mint | fresh-mint | ≤ 3% both modes |
| mark/primary · alternate · reversed | graphite · signature-blue · white | white · signature-blue · graphite | decision 2 |
| heart/fill | signature-blue | blue/300 | `LoveTech` |
| focus/ring | signature-blue | signature-blue | 3:1 UI floor |
| status/* | aliases | same aliases | functional, mode-independent |

### `Type` (1 mode)
STRING `font/display` Montserrat · `font/text` Readex Pro · `font/arabic-display` KO Ghorab · `font/mono` JetBrains Mono · `font/hand` Caveat.
FLOAT `size/xs…5xl` 12 · 14 · 17 · 20 · 24 · 32 · 42 · 56 · 72; `size/ar-hero` 52 · `size/ar-heading` 32 · `size/ar-quote` 26 · `size/ar-display-min` 24; `leading/tight` 1.15 · `snug` 1.35 · `body` 1.7 · `ar-body` 1.85 · `ar-snug` 1.5; `tracking/tight` −2% · `wide` +8%; `social/size/*` and `social/line/*` for cover 112/123 · title 76/94 · sub 54/71 · body 36/58 · support 30/48 · label 26/32 · spec 34/40 · index 150/135; `slot/*` ceilings 5 · 6 · 18 · 8 · 3 · 3 · 3.

### `Space & Shape` (1 mode)
`space/0…32` (4 px base: 0 4 8 12 16 20 24 32 40 48 64 80 96 128) · `radius/inline` 6 · `control` 10 · `card` 14 · `panel` 18 · `media` 20 · `hero` 24 · `signature` 32 · `pill` 999 · `stroke/hairline` 1 · `default` 1 · `strong` 1.5 · `brand` 2 · `control/sm md lg` 32 40 48 · `icon/sm md lg xl` 16 20 24 32 · `touch/target` 44 · `mark/min-size` 24 · `mark/clearspace-ratio` 0.23 · `mark/ratio` 1.2258 · `mark/min-gradient-size` retired (not created).

### `Motion` (1 mode)
TIMING `duration/micro…ceiling` 0.08 · 0.12 · 0.2 · 0.3 · 0.45 · 0.6 · 0.8 s · `stagger/product` 0.04 · `stagger/marketing` 0.07; EASING `ease/enter` (0.16, 0.84, 0.44, 1) · `ease/exit` (0.4, 0, 1, 1) · `ease/move` (0.4, 0, 0.2, 1); FLOAT `distance/1…4` 4 8 16 24 · `distance/marketing` 80 · `scale/enter` 0.96 · `scale/overshoot` 1.03.

### `Canvas & Safe Zones` (4 modes: `Reel 9:16`, `Feed 4:5`, `Square 1:1`, `Thumb 16:9`)
`canvas/width` · `canvas/height` · `canvas/margin` · `canvas/reserve-top` · `canvas/reserve-bottom` · `grid/columns` · `grid/gutter` — per mode: Reel 1080·1920·72·**260**·**420**·4·32 · Feed 1080·1350·72·96·168·6·24 · Square 1080·1080·72·96·168·6·24 · Thumb 1280·720·64·0·0·8·24. A frame switched to a mode gets that canvas's safe zones. The Motion Carousel slide uses the Reel mode; the Static Ultra Carousel uses Feed.

Effect styles: `Elevation/1…3` from the neutral-cool shadow ladder (Graphite 6 / 8 / 10 %).

## 03 — Typography: text styles

Existing eight are **retuned in place** (IDs kept) to the audited values; new ones added. `[Ghorab]` styles are created with **Readex Pro Regular as a placeholder family** because KO Ghorab is not in the Figma font environment; each carries the description `PLACEHOLDER FAMILY — must be KO Ghorab; swap family after the licensed font is uploaded to the team`. Nothing else about them is placeholder.

| Style | Font | Size / line | Source |
|---|---|---|---|
| EN/Display/Hero · I ❤ Tech | Montserrat ExtraBold | 72 / 83 (1.15), tracking −4% | `--adel-text-5xl`, `--adel-leading-tight`, `LoveTech` |
| EN/Display/1 | Montserrat Bold | 56 / 64 | `--atc-display1` |
| EN/Display/2 | Montserrat Bold | 44 / 52 | `--atc-display2` |
| EN/Heading/1 | Montserrat Bold | 36 / 44 | `--atc-heading1` |
| EN/Heading/2 | Montserrat SemiBold | 28 / 36 | `--atc-heading2` |
| EN/Heading/3 | Montserrat SemiBold | 22 / 30 | `--atc-heading3` |
| EN/Heading/4 | Montserrat SemiBold | 18 / 26 | `--atc-heading4` |
| EN/Body/L | Readex Pro Regular | 18 / 30 | `--atc-body-large` |
| EN/Body/M | Readex Pro Regular | 16 / 26 | `--atc-body-base` |
| EN/Body/S | Readex Pro Regular | 14 / 22 | `--atc-body-small` |
| EN/Label | Readex Pro Medium | 14 / 20 | `--atc-label` |
| EN/Caption | Readex Pro Regular | 12 / 18 | `--atc-caption` |
| EN/Overline | Readex Pro SemiBold | 12 / 16, tracking +8% | `--atc-overline` (Latin only) |
| AR/Display/Hero [Ghorab] | KO Ghorab (placeholder) | 52 / 73 (1.4) | `--adel-type-ar-hero` |
| AR/Display/Heading [Ghorab] | KO Ghorab (placeholder) | 32 / 46 (1.45) | `--adel-type-ar-heading` |
| AR/Display/Quote [Ghorab] | KO Ghorab (placeholder) | 26 / 39 (1.5) | `--adel-type-ar-quote` |
| AR/Body/L | Readex Pro Regular | 18 / 33 (1.85) | `--adel-leading-body` (ar) |
| AR/Body/M | Readex Pro Regular | 16 / 30 (1.85) | retuned from 16/28 |
| AR/UI | Readex Pro Medium | 14 / 24 | carried over (no site token — review) |
| Social/Cover [Ghorab] | KO Ghorab (placeholder) | 112 / 123 | `--atc-social-cover` (face: Cairo → Ghorab per decision 5) |
| Social/Title | Readex Pro Bold | 76 / 94 | `--atc-social-title` |
| Social/Sub | Readex Pro SemiBold | 54 / 71 | `--atc-social-sub` |
| Social/Body | Readex Pro Regular | 36 / 58 | `--atc-social-body` |
| Social/Support | Readex Pro Regular | 30 / 48 | `--atc-social-support` |
| Social/Label | Readex Pro Medium | 26 / 32 | `--atc-social-label` |
| Social/Spec | JetBrains Mono Medium | 34 / 40 | `--atc-social-spec` |
| Social/Index | Montserrat ExtraBold | 150 / 135 | `--atc-social-index` |
| Tech/Code | JetBrains Mono Regular | 14 / 22 | kept |

Not created: a Caveat style (About sketch layer only; Figma has Caveat Regular/Bold, the site uses 500/600) and an Amiri style (not core). Both are documented as exceptions on the 03 page.

## 02 — Logo & Signature: components

All geometry from `atc-mark-currentcolor.svg` via SVG import; fills bound to `mark/*` semantic variables so the components flip correctly in Dark mode.

| Component | Variants / props | Notes |
|---|---|---|
| `Mark / A` | Tone = Graphite · Signature Blue · White | 180 px master; description carries ratio, floor, clear-space rule |
| `Lockup / AdelTechTalks` | Tone × 3 | mark + "AdelTechTalks" Montserrat ExtraBold at 0.58 × mark height, gap `space/3`, tracking −2% (from `Logo.astro`) |
| `Lockup / Adel (secondary)` | Tone × 3 | mark + "Adel" Montserrat ExtraBold at 0.72 ×, tracking −3% (from `AdelLogo.astro`); documented as secondary |
| `Lockup / I ❤ Tech` | Ground = Light · Dark | Montserrat ExtraBold, tracking −4%, gap 0.21 em, heart 0.76 em from the `LoveTech.astro` path, heart fill `heart/fill` |
| `Tile / App Icon` | Ground = Signature Blue · Graphite | white mark, radius 27/120 of tile; no gradient (retires `atc-appicon-gradient.svg`) |
| `Signature / Reserved slot` | — | dashed empty frame + instruction text; no artwork; stays empty until a scanned signature is supplied |
| Clear-space & minimum-size sheet | — | frame showing the mark, 23%-of-height clear-space guides, 24 px floor, misuse list (no stretch, no redraw, no recolour outside the three roles, no gradient, never Fresh Mint) |

## 00 — Brand Overview: changes

- Page renamed.
- The 23 canvas-level nodes (title, tagline, avoid-line, 9 swatches + labels, typography note) are re-parented into the `Brand Foundations v2.1` section at the same visual position, fixing the empty-section export defect.
- New frame `Brand OS · module index`: the 12 approved modules with status (built in 2A / reserved).
- The typography note text is updated to the audited faces (it already lists them; the wording is kept).

## What is not touched
Canva, Adobe, Supabase/RLS, the CI security check, the website deploy, any signature artwork, and the video skill's hard-coded safe-zone defaults (refactor deferred until this token model is approved).
