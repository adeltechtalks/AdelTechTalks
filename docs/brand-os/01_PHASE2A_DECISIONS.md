# AdelTechTalks Brand OS — Phase 2A Locked Decisions

**Status:** LOCKED by Adel on 2026-09-14. These answers close the nine questions in `00_PHASE1_AUDIT.md §7`.
**Scope of Phase 2A:** Figma modules 00–03, canonical tokens/variables, colour, typography, logo/mark rules, signature placeholder architecture, light/dark surfaces, social/video safe-zone tokens, and the machine-readable repo export structure. Nothing else.

---

## 1 · Brand colour system

AdelTechTalks v2.1 Blue is the only active brand system. The values are the nine Tier 1 colours plus the published ramps in `site/src/styles/tokens/adel-v2.css`, taken as-is. No colour value is invented; the three derived neutrals (`sunken`, `border`, `muted`) stay documented as derived, not brand.

| Role | Value | Rule |
|---|---|---|
| Signature Blue | `#2563EB` | primary brand colour, primary action |
| Deep Blue | `#1746A2` | pressed states, text on Ice tint |
| Ice Blue | `#DCEBFF` | tinted surfaces, quiet emphasis |
| Fresh Mint | `#2DD4A8` | accent only, ≤ ~3% of any surface, never a logo colour |
| Graphite | `#171A1F` | primary neutral, primary text, everyday mark |
| Slate | `#667085` | secondary text |
| Warm White | `#FAFAF8` | primary light surface (page canvas) |
| White | `#FFFFFF` | raised surfaces |
| Soft Gray | `#E6E8EC` | hairlines, dividers |

### 1b · Expressive / Creator palette — approved SECONDARY (amended 2026-09-14)

Edition 1 is **not** fully archived. Five families are reclassified as an approved secondary palette for creator-side content. The v2.1 Blue system above stays the **primary** identity for the logo, website/UI, navigation, core layouts and official brand surfaces.

| Family | Values | Note |
|---|---|---|
| Purple | 500 `#855FF2` · 600 `#6C41E4` · 700 `#5A32C4` | 600 was the Edition 1 brand purple; it is now an accent, not an identity colour |
| Spark Coral | 300 `#FFB4A3` · 500 `#FF6B57` · 700 `#CE3A24` | 700 is the text-safe step |
| Magenta | 500 `#DB4A9B` · 700 `#B2317C` | |
| Electric / Signal Blue | 500 `#3E7BFA` · 700 `#1F4BC0` | distinct from Signature Blue `#2563EB`; never used where the brand blue belongs |
| Lavender | mist `#F8F6FF` · veil `#F1EDFE` · haze `#E6DFFC` | atmosphere tints for expressive grounds only |

**May be used intentionally for:** Motion Carousels · Playground / gamification · badges · AI / tech explainers · thumbnails · campaign moments · highlights and creative accents.

**Rules.** They never replace Signature Blue as the primary brand colour. Never used randomly — controlled accents and expressive content colour. One expressive hue leads a piece; a second appears only when the content genuinely has two sides. Never on the mark, the lockups, the I ❤ Tech heart, the signature, or any website/app UI surface. Never a substitute for a status colour. Same values in Figma, Canva and video. Gradients stay retired: the expressive palette is flat colour.

**Still archived, not deleted:** Dark Impact navy/charcoal and the 45° Impact gradient, the violet-tinted neutral ramp and violet shadow ladder, the aurora/dawn gradients, the five-colour content-pillar system, Cairo, the Impact-gradient app icon. These remain in `site/src/styles/tokens/colors.css` and `legacy-att.css` under the `.att-legacy` scope and are shown for reference on Figma `99 — Archive / Edition 1`.

## 2 · Logo and mark

- One geometry: `site/public/logo/atc-mark-currentcolor.svg` (viewBox 220.64 × 180, ratio 1.2258 locked, 24 px floor, clear space 23% of height).
- Colour roles: **Graphite** = everyday default · **Signature Blue** = approved alternate · **White** = reversed on dark or photographic grounds.
- No gradient logo tile. The Impact-gradient app icon is retired to the archive.
- `AdelTechTalks` lockup is primary. The `Adel` lockup is kept as a **secondary** lockup, not retired.

## 3 · Signature

No handwritten signature is created or simulated. A reserved component and asset slot exist and stay empty until a real scanned signature is supplied. A handwriting font is never a stand-in.

## 4 · Dark mode

Graphite-based dark surfaces are approved. Dark Impact gradients are retired from the active system. Dark values are taken from documented precedents in the token files (the graphite navbar, the glass composite, `LoveTech` on dark) and are listed in `02_PHASE2A_FIGMA_PLAN.md`; anything without a precedent is left open in §8 of the report rather than invented.

## 5 · Typography

The audited website typography wins over the bootstrap placeholders.

| Face | Job | Source |
|---|---|---|
| Montserrat 400–800 | Latin display, wordmarks, nav, CTA, index figures | Google Fonts |
| KO Ghorab 400 | Arabic display only, ≥ 24 px, never letter-spaced | self-hosted, licensed to Adel, not redistributable |
| Readex Pro 300–600 | Arabic body/UI, any Latin inside an Arabic sentence, EN long-form | Google Fonts |
| JetBrains Mono 400–500 | technical figures, specs, code, overlines | Google Fonts |
| Caveat 500–600 | About-page sketch layer only, EN only, placeholder for real handwriting | Google Fonts |

- Cairo is Edition 1 / archive.
- Alexandria and Inter (bootstrap) are **not** approved. Tajawal (generic skill example) is **not** brand data.
- Amiri is not core. It survives only as a documented special-purpose exception for the scripture line on the holding page, if that use case stays.
- Font roles are not changed beyond what the audited implementation already does.

## 6 · Safe zones

The audited repository tokens (`tokens/brand.css`) win.

| Canvas | Size | Margin | Top reserve | Bottom reserve | Grid |
|---|---|---|---|---|---|
| Reel / Story 9:16 | 1080 × 1920 | 72 | **260** | **420** | 4 cols · 32 gutter |
| Feed 4:5 | 1080 × 1350 | 72 | 96 | 168 | 6 cols · 24 gutter |
| Square 1:1 | 1080 × 1080 | 72 | 96 | 168 | 6 cols · 24 gutter |
| Thumbnail 16:9 | 1280 × 720 | 64 | 0 | 0 | 8 cols · 24 gutter |

The bootstrap's 150 / 300 / 180 values are not final. The video skill will eventually read safe zones from the shared token export; that refactor waits until the token model in this phase is approved.

## 6b · Adaptive / Fold-First Content System (added 2026-09-14)

An approved requirement, specified in `04_ADAPTIVE_FOLD_FIRST.md`. Four canonical **video** profiles: `verticalStandard` 1080×1920 9:16 · `foldPortrait` 1440×1920 3:4 · `foldLandscape` 1920×1440 4:3 · `youtubeLandscape` 1920×1080 16:9. Fold-first does not replace standard YouTube.

It is an adaptive composition system, not an export-size list: from one source edit, framing, product placement, text position and line length, captions, brand position, safe zones, graphics and motion all adapt. **Never solved by centre-cropping the 9:16 version.** Dimensions are configuration read from a profile, never assumptions baked into the editor. Per-format PRIMARY / SECONDARY / TEXT / BRAND / FOCAL rules are defined for all eight production formats. The Adaptive Device Pack is requested, never forced. The rendering engine is a later phase; Phase 2A delivers the architecture, tokens, profile definitions, component implications and the inventory of hard-coded dimensions to replace. "Fold First" language is a reserved concept, not a badge.

## 7 · Figma plan (approved)

```
00 — Brand Overview
01 — Foundations
02 — Logo & Signature
03 — Typography
04 — Core Components
05 — Static Ultra Carousel
06 — Motion Carousel
07 — Video System
08 — Social / Channel
09 — Web Components
90 — Export Library
99 — Archive / Edition 1
```

Figma is the visual source of truth. Canva mirrors approved production templates. The repo export layer is machine-readable. The video skill consumes that export.

## 8 · Carousel rules

- **Static Ultra Carousel:** canonical 1080 × 1350; supports Arabic RTL, English, mixed, image-heavy, text-heavy, light and dark.
- **Motion Carousel:** a core format. Canonical slide canvas 1080 × 1920; 5–6 independent video slides of about 5 s each; every slide exportable as its own MP4; a stitched preview may be produced. Not a static carousel with generic zoom.

## 9 · Video families

ASMR / Product Unboxing · Talking Head / Reel · Motion Carousel · Product Comparison · Product Demo / Feature Spotlight · Mixed Talking Head + Product B-roll — plus long-form / explainer as a supported routing profile of the Talking Head pipeline (no seventh JSON format required yet).

**ASMR rule:** recorded tactile audio (box opening, peeling, clicks, scratches, packaging, handling) is essential. Never muted. No aggressive denoise, gating, compression, music or captions by default.

## 10 · Canva

Archive, do not delete, the stock-template experiments. No Canva rebuild until the Figma foundations are approved.

## Ownership of `BRAND_SYSTEM.md`

Figma defines the approved visual system. The repository holds one machine-readable canonical export (`brand/tokens/adel-v2.1.json`) that automation consumes. `.claude/skills/video-ad-editor/BRAND_SYSTEM.md` is a **generated rendering** of that export, never hand-edited. There are no two independently editable sources of truth.
