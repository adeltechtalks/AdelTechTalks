# AdelTechTalks Brand OS — Phase 1 Audit

**Status:** AUDIT ONLY. Nothing in Figma, Canva or Adobe was created, edited or moved.
**Date:** 2026-09-14
**Scope:** everything that already carries the AdelTechTalks identity — the repository, the Figma team, the Canva team, Creative Cloud, and the planning documents in Notion and Google Drive — plus a proposed canonical structure for approval.

Read §5 (conflicts) and §7 (decisions) first if short on time. Nothing in §6 is built until §7 is answered.

---

## 1 · What was inspected

| Surface | Access | What was found |
|---|---|---|
| Repository `adeltechtalks/AdelTechTalks` (`main` + 25 remote branches) | full | the live site's token system, two logo components, fonts, share-card generators, the v3 design documents on an unmerged branch |
| `.claude/skills/video-ad-editor/` | **does not exist** — not on any branch, not on disk | see §5.1 |
| Figma — team "Adel Mohamed's team" (Pro), file `OD9bQi6eWexQi53tLKoctW` | read | one page, four sections, no variables, no components |
| Canva — team brand kit "AdelTechTalks" (`kAHQnPVSlSQ`), folders, designs, brand templates | read | one archived carousel guide, empty folder scaffolding ×2, nine loose stock-template experiments |
| Adobe Creative Cloud (files, Lightroom) | read (one call rate-limited) | two PDFs, a 39-photo Lightroom pool; no Express brand kit, no motion projects |
| Descript, HyperFrames | read | zero projects in both |
| OpusClip | plan does not include API access — could not read | skipped |
| Framer | plugin not open in a project — could not read | the `/learn` Framer work is referenced in `docs/framer/` only |
| Tella | not authorized in this session | skipped |
| Notion (AdelTechTalks HQ, Control Center), Google Drive (brand folders) | read | roadmap, the locked Canva brand-kit setup sheet, the Figma-archive task |

Two things could not be verified and need a manual look from Adel:

- **The Canva Brand Kit's actual swatches, fonts and logos.** The Canva API exposes the kit's name and thumbnail only. The locked setup sheet in Drive says what it *should* contain (§3.3), and the thumbnail is consistent with that, but the live contents are unconfirmed.
- **The "Design System v2.1 export"** the site README calls the visual source of truth (`DESIGN_FREEZE.md`, `ui_kits/website/*.jsx`, `assets/photos/adel-studio.jpeg`). It is referenced from code comments on every branch but is not in the repository, Drive or Notion.

---

## 2 · The brand as it exists in the repository

### 2.1 Two colour systems under one roof

The site ships **both** identities, layered by design (`site/src/styles/tokens.css`, load order is load-bearing):

| System | Files | Palette | Status in code |
|---|---|---|---|
| **ATT Content System v1** (Edition 1) | `colors.css`, `typography.css`, `brand.css`, `motion.css` | Brand Purple 600 `#6C41E4`, Signal Blue `#3E7BFA`, Spark Coral `#FF6B57`, lavender Mist/Veil/Haze, violet-tinted inks, five pillar hues, **Dark Impact Mode** (navy `#0B0918`, impact blue/purple/magenta, 3-stop 45° gradient) | still defines every geometry, spacing, motion and social-canvas token; its **colours** are overridden by the bridge |
| **Adel Personal Brand v2.0 / v2.1** | `adel-v2.css`, `adel-type.css`, `bridge-v2.css` | Signature Blue `#2563EB`, Deep Blue `#1746A2`, Ice Blue `#DCEBFF`, Fresh Mint `#2DD4A8` (≤3%), Graphite `#171A1F`, Slate `#667085`, Warm White `#FAFAF8`, White, Soft Gray `#E6E8EC`; published blue/mint/ink ramps; **no gradients**; neutral graphite shadows; radius ladder 6/10/14/18/20/pill | the live default; `bridge-v2.css` re-points every `--atc-*` colour at a v2 value |
| **Legacy · ATT** scope | `legacy-att.css` (`.att-legacy`) | the purple system, opt-in | **never used** by any component on the site — dead weight kept "for ATT content" |

The repository's own brand-architecture note (`site.config.ts` §5, README): *Adel = the site identity; AdelTechTalks = the content/show identity; GearNest = separate business.* The purple system was kept specifically for "AdelTechTalks-branded content — social templates, video covers, the ATT carousel and Content OS templates".

### 2.2 Logos and lockups

| Asset | Location | Notes |
|---|---|---|
| **The A mark** (LG v2.0 geometry, viewBox 220.64×180, ratio 1.2258 locked, legs 1.19° apart, 24px floor, clear space 23% of height) | `site/public/logo/atc-mark-currentcolor.svg`, `-purple600.svg`, `-ink900.svg`, `-white.svg`, `-purple600-256.png` | **canonical geometry** — every other copy is this path |
| Adel "A" mark | `site/src/assets/brand/adel-a-mark.svg` | byte-identical path to the ATC mark → one mark, two names |
| App icon | `atc-appicon-gradient.svg`, `apple-touch-icon.png`, `favicon-32.png` | mark in the 3-stop Impact gradient on navy, radius 27/120 |
| `Logo.astro` | AdelTechTalks lockup: mark + "AdelTechTalks" in Montserrat 800, tones `primary` (Graphite after bridge) / `reversed` (white) / `brand` (Signature Blue) | used in header (reversed on graphite bar) and footer |
| `AdelLogo.astro` | "Adel" lockup: mark + "Adel" in Montserrat 800, tones default / brand / reverse | defined, not used by header or footer |
| `LoveTech.astro` | **I ❤ Tech** — inline SVG heart in Signature Blue, Montserrat 800, `dir=ltr` fixed object; steps to Ice Blue on dark | the master brand expression |
| LinkedIn page logo (unmerged branch `claude/adeltechtalks-linkedin-logo-jeq2w6`) | 300/400 px tiles: white mark on **Purple 600** (primary), Impact gradient on navy, purple on white; build script reads geometry from the canonical SVG | picks purple as the default tile — contradicts v2 (§5.2) |
| Share cards | `scripts/build-og-adel.mjs` (Adel v2: blue/graphite/warm white, own heart path) and `scripts/build-og.mjs` (ATT purple Playground badge cards) | two visual systems in the share layer by design (§27) |
| Handwritten signature | `photography.signature` slot in `site.config.ts` | **empty** — no real signature asset exists anywhere; the codebase explicitly forbids a handwriting font standing in for it |

### 2.3 Typography

| Face | Job (approved) | Where it is loaded | State |
|---|---|---|---|
| **Montserrat** 400–800 | Latin display, wordmarks, nav, CTA, index figures; never inside an Arabic run | Google Fonts via `Base.astro` | live |
| **KO Ghorab** (Kotype) 400 | Arabic display only, ≥24px, never letter-spaced, single weight → hierarchy by size | self-hosted `src/assets/fonts/KOGhorab-Regular.woff2` (licensed to Adel, **not redistributable**), Arabic pages only | live |
| **Readex Pro** 300–600 | Arabic body/UI, and any Latin inside an Arabic sentence; EN long-form | Google Fonts | live |
| **JetBrains Mono** 400–500 | technical figures, specs, code, overlines | Google Fonts | live |
| Caveat 500–600 | About-page sketch layer only, EN only, placeholder until real handwriting exists | Google Fonts, EN pages only | live |
| Cairo 800–1000 | Edition 1 Arabic display; **retired** for the personal brand in DS v2.1 | not loaded by the site; still the display face in the Canva carousel guide and the Canva brand-kit sheet | frozen social assets only |
| Amiri | none approved | `coming-soon.astro` loads it for the Quranic ayah line | **off-system** (§5.4) |

The mixed-script machinery is mature and worth carrying everywhere: `[[term]]` markers → `.term` (bidi-isolated LTR islands), Western digits, `.nums` tabular, `--adel-font-display-sm` falls to Readex Pro below Ghorab's 24px floor, Arabic never letter-spaced or synthesised-bold, Arabic line-height 1.85 body / 1.4 hero.

### 2.4 Social canvases, slot ceilings and motion tokens already defined

`tokens/brand.css` and `tokens/typography.css` already carry a full social spec — this is the seed of the Static Ultra Carousel and the Motion Carousel safe zones:

| Canvas | Size | Margin | Top / bottom reserve | Grid |
|---|---|---|---|---|
| Feed 4:5 | 1080×1350 | 72 | 96 / 168 | 6 cols, 24 gutter |
| Square 1:1 | 1080×1080 | 72 | 96 / 168 | 6 cols, 24 gutter |
| Reel / Story 9:16 | 1080×1920 | 72 | **260 / 420** | 4 cols, 32 gutter |
| Thumbnail 16:9 | 1280×720 | 64 | 0 / 0 | 8 cols, 24 gutter |

Social type scale is **authored in Arabic** (cover 112/123 · title 76/94 · sub 54/71 · body 36/58 · support 30/48 · label 26/32 · spec 34/40 mono · index 150/135 Montserrat); Latin steps down ÷1.08. Slot ceilings are enforced in Arabic words (cover 5, title 6, body 18, support 8, spec tokens 3, chips 3×3) and the remedy on breach is always fewer words, never smaller type.

Motion: durations 80–800ms, `--atc-ease-enter/exit/move`, stagger 40/70ms, reduced-motion is a full replacement. The v3 motion system (approved on the design branch) adds Cinematic 500–900ms, "one memorable interaction per section", no confetti, no looping idle motion, and a no-library decision (CSS + WAAPI) for the website. Remotion is named as the off-site renderer for reels and share videos.

### 2.5 Photography and real assets on hand

- `public/photos/adel-hero.jpg` (800×1000) and `-mobile.jpg` — the only real photographs in the repo. About, studio and desk-detail slots are empty and collapse by rule.
- Lightroom (Adobe) holds ~39 photos including a July 2026 shoot (`2Q4A06xx`, `2Q4A07xx`) and phone HEICs — a candidate photography library, unreviewed.
- Canva uploads: three phone photos (HEIC/JPG), untagged.

### 2.6 Planning documents that already govern this work (unmerged branch `claude/adeltechtalk-final-design-4nc4fr`)

These are proposals, signed-off in places, and **not on `main`**:

- `V3_DESIGN_SYSTEM.md` — identity unchanged (blue/graphite, I ❤ Tech, lockup); proposes a Figma master library `00 Brand … 08 Motion` and a **ten-template social inventory** (AI News, Adel's Take, Prompt Card, Six-slide Carousel, Cheat Sheet, Build Update, Workflow Diagram, Achievement Card [site-generated only], Reel Cover, Course/Resource Cover).
- `V3_CANVA_PRODUCTION_SYSTEM.md` — *Figma is the source of truth, Canva is the publishing surface*; Canva templates are build outputs with locked layers, a version stamp (`ATT-T03 v2.1`) and a rebuild-not-patch rule; Canva may not add colours, fonts, gradients, stock people, AI images or numbers that are not real; every template ships an Arabic page, empty by default.
- `V3_MOTION_SYSTEM.md` — approved; five tiers; premium bar "Tech-savvy · Cinematic · Tactile · Premium · Fast".
- `V3_CONTENT_OS.md` — payload schema (`adels_take` null blocks, `authoring_required` blocks derived Arabic, `checks.blocking`), Remotion loop *create once → distribute everywhere*, every asset traces to a `source_entry`.
- `V3_DESIGN_SIGNOFF.md` — architecture, design direction, motion, RTL layout **approved**; **Arabic copy and typography pending native review**; design artifact lives at a claude.ai artifact URL, not in Figma.

---

## 3 · The brand as it exists in the tools

### 3.1 Figma — `OD9bQi6eWexQi53tLKoctW` ("fresh source-of-truth file", created 2026-08-18)

- **One page**, `00 — Brand System`. The Notion task planned three (`00 Brand System`, `01 Website UI`, `02 Product & Archive`) under a Starter-plan page limit; the team is now on **Pro**, and only page 00 was ever made.
- Four sections: **Brand Foundations v2.1** (nine colour swatches drawn as plain rectangles; typography note), **Typography & Language** (EN hero/H1/H2/body, AR body, technical samples; a note that KO Ghorab is unavailable in the Figma font environment), **Badge Taxonomy** (10 primary: Vibe Coding · Gear · Learn · Prompt · Use Case · Guide · Playground · Build · Review · Workflow; 8 secondary: NEW · TESTING · LIVE · PART 01 · ON THE GO · AI-POWERED · CURRENT · FEATURED; usage rules), **Visual Direction, Motion & Voice** (photography-first, editorial composition, Liquid Glass 10–15%, ~300ms motion, brand boundaries, Egyptian-Arabic voice).
- The file states the ruling in its own words: *"Avoid: Purple / Lavender / Coral / Magenta / gradients. Fresh Mint is restrained. AI is cross-cutting, not the whole brand."*
- **No variables, no colour or text styles, no components, no logo artwork, no social frames, no motion.** The swatches are rectangles, so nothing downstream can bind to them.
- Structural defect: the Brand Foundations section is empty — its swatches and labels sit at canvas level beside it, so the section renders blank on export.
- The "I ❤ Tech" sample uses the emoji heart, not the drawn Signature Blue heart.
- Libraries attached: Material 3, Simple Design System, Apple iOS/macOS/watchOS/visionOS kits — none are brand libraries and none should be.

### 3.2 Canva — team, brand kit `AdelTechTalks` (`kAHQnPVSlSQ`)

| Item | State |
|---|---|
| Brand Kit | exists; contents not readable by API. The locked setup sheet (Drive, 2026-07-27) specifies the **Edition 1 purple kit**: 12 swatches (Purple 600, Signal Blue 500, Spark Coral 500, White, Mist, Veil, Ink 900 + text-safe Purple 700, Blue 700, Spark 700, Ink 500, Ink 200), slots Heading = **Cairo**, Sub/Body = Readex Pro, Montserrat + JetBrains manual-only, 7 logo variants (Primary, Light, Dark, Mono, AppIcon, Favicon, Watermark). Prohibited there: navy, charcoal, magenta, gradient stops, pure grey |
| Brand templates | **none** published |
| `AdelTechTalks — Brand & Content/` (created 2026-08-18) | `01 — Brand System` · `02 — Social Templates` · `03 — Video & Thumbnails` · `04 — Newsletter & Lead Magnets` · `05 — Website & UI Exports` · `06 — 0 to Hero Product` · `07 — Media Library` · `99 — Archive` — **all eight empty** |
| `Gear Nests — Brand & Content/` | `01`–`05` folders, separate business — leave untouched |
| `Archive — pre-reset 2026-08-18/` | **Canva Carousel Template Guide — DJI Osmo Pocket 4P (9:16)** (23 pages: 1 spec page + three directions A/B/C × 7 slides; purple Edition 1, Cairo/Readex/Mono/Montserrat, brand bar at y 1424–1480, `01 / 07` index, Origin Corner, `@adeltechtalks` + A mark end card) · **Purple Bright Content Hub Notion Header** (stock template, off-brand) · `Brand/` with 13 empty subfolders (`Logos … Archive`, the July 27 scaffolding) |
| Loose root designs (Aug 22 – Sep 8, 2026) | nine Canva stock mobile-video templates — *Unboxing Time* ×2, *Green Modern Business*, *Black & White Simple Text*, *Slice of Life reel*, *Travel Day in the Life*, *Day in My Life vlog* — still carrying placeholder copy ("Matthew Collins", "reallygreatsite.com"), pixel/yellow styling; one Arabic morning-greeting post; one untitled 1024×835 design holding the **A mark in graphite** (the only on-brand artwork outside the archive) |
| Uploads | three untagged phone photos |

Reading: Canva was scaffolded twice (July 27 purple tree, August 18 reset tree), the reset tree was never populated, and recent video experiments started from Canva stock templates rather than brand masters. The one finished brand artefact — the carousel guide — is on the retired purple system.

### 3.3 Adobe Creative Cloud

- Files: `AdelTechTalks_GearNests_Brand_CheatSheets.pdf` (2026-08-23, a one-page printable strategy sheet: "Adel Tech Talks — You are the product", pillar split 60–70 / 15–20 / 10–15, website structure, funnel; **not a visual-identity document**) and `BOI GEAR NESTS LLC.pdf` (GearNest business paperwork, out of scope).
- Lightroom: ~39 photos (see §2.5).
- No Adobe Express brand kit, no Firefly boards, no Premiere/After Effects projects, no motion assets. Creative Cloud currently holds **no brand assets**.

### 3.4 Motion tooling

Descript: 0 projects. HyperFrames: 0 projects. Framer: not connected in this session (the `/learn` Framer build is documented only in `docs/framer/BACKLOG-career-with-ai.md`). Tella: not authorized. **There are no existing motion assets, templates or project files anywhere.**

### 3.5 Notion and Drive (governance)

- Notion **Adel — Digital & Brand Control Center**: brand tree *Adel → AdelTechTalks / Gear Nests / Tovi Nest / future*; device split (iPad = Canva + Figma cockpit); AdelTechTalks recorded as "Personal media + practical AI education business. Keep execution separate from Gear Nests."
- Notion **AdelTechTalks — HQ / Action Queue**: the Figma-archive task (done 2026-08-18) with the file link and page plan.
- Drive **AdelTechTalks — Master Roadmap**: Milestone 0 *Foundation / Brand System* marked **DONE** ("brand, IA, design system, bilingual system frozen"). Milestone 5 *Publishing Operating System / Studio* planned.
- Drive `atc-canva-brandkit-setup-LOCKED.md` (2026-07-27): the purple kit spec above.

---

## 4 · Consolidated inventory

| Category | Canonical (keep) | Duplicates / variants found | Gaps |
|---|---|---|---|
| **Mark** | `atc-mark-currentcolor.svg` path | `adel-a-mark.svg` (identical), purple/ink/white SVG copies, PNG 256, app-icon gradient, LinkedIn tiles ×12 on a branch, Canva untitled design | no Figma component, no clear-space/misuse sheet, no mono/watermark variants, no SVG in Canva kit (unverified) |
| **Wordmarks** | `AdelTechTalks` lockup (`Logo.astro`) | `Adel` lockup (`AdelLogo.astro`, unused) | no vector lockup file; wordmark exists only as live type |
| **I ❤ Tech** | `LoveTech.astro` SVG heart, Signature Blue | second heart path in `build-og-adel.mjs`; emoji heart in `coming-soon.astro` and in Figma | no single exported lockup |
| **Signature** | — | — | **no real handwritten signature exists**; Caveat is a sketch placeholder only |
| **Colour** | Adel v2.1 nine values + ramps (`adel-v2.css`, Figma swatches) | ATT purple (tokens, legacy scope, Canva sheet, carousel guide, badge share cards, LinkedIn branch) | no Figma variables; **no approved dark surface set** (Dark Impact is purple-era and "not fully specified") |
| **Type** | Montserrat · KO Ghorab · Readex Pro · JetBrains Mono (+ Caveat sketch) | Cairo (Edition 1, Canva slot), Amiri (holding page), Orbitron (briefly used on the holding page, then replaced) | Ghorab not in Figma/Canva — must be uploaded as a brand font in both (licence permits use; file must not be redistributed) |
| **Social grid** | `--atc-social-*` canvases, reserves, slot ceilings; carousel guide anatomy page | — | not in Figma; 5-slide motion timing not defined |
| **Motion** | v2 charter tokens + v3 motion system | — | no motion assets, no lower-thirds, no end card, no video safe-zone spec |
| **Templates** | v3 ten-template inventory (spec only) | Canva carousel guide (purple, reference only); Canva stock video experiments | zero built templates in either tool |
| **Photography** | hero portrait ×2 | Lightroom pool, Canva uploads | no tagged library, no About/studio/desk shots placed |
| **Video skill** | — | — | `.claude/skills/video-ad-editor/` absent entirely |

---

## 5 · Conflicts and defects to resolve before anything is built

### 5.1 The production engine does not exist
`.claude/skills/video-ad-editor/SKILL.md` and `BRAND_SYSTEM.md` are not on any branch and not on the machine. The Brand OS can still be designed, but the export contract in §6.4 is written from the brief, not from an existing skill, and the skill must be created (Phase 3) before finished video outputs are possible.

### 5.2 Two identities answer to the name "AdelTechTalks"
- Figma (canonical by rule): *AdelTechTalks — Brand Foundations v2.1* = blue/graphite, "avoid purple".
- Repo comments, the Canva brand-kit sheet, the carousel guide, the badge share cards and the LinkedIn logo branch: AdelTechTalks content = Edition 1 purple, with Adel's personal site on blue.
These cannot both be canonical. Recommendation in §7.1.

### 5.3 One mark, three default colours
Purple 600 (LG v2.0, LinkedIn tile, Canva sheet "Primary"), Graphite (§8 v2.0, `--atc-mark-primary` after the bridge), and the Impact gradient (app icon). Same geometry throughout, so this is a colour-role ruling, not a redraw.

### 5.4 Off-system fonts on the public holding page
`coming-soon.astro` loads Amiri (Quranic ayah) and renders the heart as an emoji. If the ayah stays, Amiri needs to be a documented, scoped exception ("scripture only"); otherwise it violates the four-face rule.

### 5.5 Two heart glyphs
`LoveTech.astro` and `build-og-adel.mjs` draw different paths; the OG comment claims they are the same. One path must be exported as the master and both must read it.

### 5.6 Figma is a moodboard, not a system yet
No variables, styles or components; the foundations section is structurally empty; page plan unrealised. Everything the Canva production contract needs (locked masters, version stamps) has nothing to bind to.

### 5.7 Canva holds the old kit and stock experiments
The kit (per its sheet) is purple + Cairo; the new folder tree is empty; recent video tests started from third-party templates with placeholder copy. Under the rule "Canva mirrors Figma", the kit must be rebuilt after Figma is approved, and the stock experiments should be archived so they never become the de-facto style.

### 5.8 No dark mode for video-dominant surfaces
Product video and unboxing thumbnails need a dark ground. The only dark spec is Dark Impact (purple-era, gradient-based, explicitly "not fully specified"); v2.1 forbids gradients. A graphite dark set has a precedent (the navbar: Graphite 0.94, Ice Blue text, Signature Blue indicator) but is not written down as a mode.

### 5.9 Arabic in the tools
KO Ghorab is licensed and installed on the site but absent from Figma and Canva; the carousel guide flags Canva RTL as "unverified"; the v3 sign-off marks Arabic copy/typography as pending native review. Every Arabic template must be proofed in the real face before approval.

### 5.10 Governance drift
Three different folder taxonomies exist (Canva July-27 `01 Logos…13 Archive`, Canva Aug-18 `01 Brand System…99 Archive`, v3 doc `00 Brand…08 Motion`), none matching the other. The Brand OS needs one.

---

## 6 · Proposed canonical Brand OS structure (for approval)

Principle: **one taxonomy, three mirrors.** Figma decides, Canva produces, the repo exports; the video skill consumes the export. Numbering is shared so a person can move between tools without translating.

### 6.1 Figma — file `OD9bQi6eWexQi53tLKoctW`, one page per module

```
00  Brand Foundations      colour VARIABLES (Light + Dark modes), type styles EN/AR,
                           spacing, radii, elevation, glass budget, motion tokens
01  Logo & Signature       A-mark component (roles: Graphite · Signature Blue · White · Mono),
                           AdelTechTalks lockup, I ❤ Tech lockup (drawn heart), clear space,
                           minimum sizes, misuse, app icon, favicon, watermark, LinkedIn/profile tiles,
                           Signature slot — reserved, empty until Adel's real handwriting is scanned
02  Typography EN / AR     Montserrat scale, Ghorab/Readex Arabic scale, mixed-script rules,
                           social type scale, longest-string proofs
03  Components             badge taxonomy (from the existing section), chips, buttons, brand bar,
                           index counter, spec row, comparison row, CTA end card, glass panel,
                           lower-third, title card
04  Static Ultra Carousel  4:5 and 9:16 masters (cover · content · spec · verdict · end card),
                           safe-zone overlays, AR page per master
05  Motion Carousel        5–6 slide storyboards at 1080×1920, per-slide ~5 s timing sheet,
                           in/hold/out choreography, export spec for the video skill
06  Video Formats          ASMR / Unboxing · Talking Head / Reels · Product Comparison ·
                           Product Demo / Feature Spotlight — cover frames, title cards,
                           safe zones with product video dominant, no-caption zones for ASMR
07  Channel & Banners      YouTube banner, LinkedIn cover + logo, X header, TikTok/IG profile,
                           OG share cards (Adel + Playground badge)
08  Website Components     header, footer, hero, cards, entry list, newsletter — mapped 1:1 to
                           src/components (Code Connect in a later phase)
09  Exports & Handoff      the asset manifest the video skill reads (§6.4)
99  Archive                ATT Edition 1 (purple/Cairo/Dark Impact), the Canva carousel guide as
                           reference, explorations — visible, never linked from 00–09
```

### 6.2 Canva — mirrors Figma, never leads it

```
Brand Kit "AdelTechTalks"   rebuilt from 00: nine v2.1 swatches (+ text-safe ramps), fonts
                            Montserrat / Readex Pro / JetBrains Mono + KO Ghorab uploaded,
                            logo variants exported from 01. Purple kit values removed.
AdelTechTalks — Brand & Content/
  01 — Brand System         exported logo/lockup PNG+SVG, colour reference page, type reference
  02 — Social Templates     Static Ultra Carousel brand templates (EN + AR page each), version-stamped
  03 — Video & Thumbnails   reel covers, thumbnails, motion-carousel frame templates for quick edits
  04 — Newsletter & Lead Magnets   (unchanged)
  05 — Website & UI Exports (unchanged)
  06 — 0 to Hero Product    (unchanged)
  07 — Media Library        tagged real photography + product stills only
  99 — Archive              carousel guide (purple), the nine stock-template experiments, the
                            Notion header — moved here, not deleted
```

Gear Nests tree stays separate and untouched.

### 6.3 Repository — `brand/` as the exportable layer

```
brand/
  tokens/adel-v2.1.json      generated from src/styles/tokens (single source), consumed by the
                             video skill, Canva rebuilds and future Framer/website work
  logo/                      the one mark + lockups (SVG masters, PNG at fixed sizes)
  heart/                     the one I ❤ Tech heart path
  fonts/README.md            licence notes (Ghorab not redistributable; Google faces by CDN)
  safe-zones/                9:16 / 4:5 / 16:9 overlays as SVG
docs/brand-os/               this audit, then the approved rulings, then per-format specs
.claude/skills/video-ad-editor/
  SKILL.md                   production engine (to be created in Phase 3)
  BRAND_SYSTEM.md            a rendered view of brand/tokens + rules, never hand-maintained
  assets/                    copies of brand/ exports the skill can read offline
```

### 6.4 The export contract the video skill will need (draft)

- Tokens: colour (light + dark), type scale (EN/AR), motion durations/easings, safe zones per canvas.
- Assets: mark (four colour roles) SVG+PNG, AdelTechTalks lockup, I ❤ Tech lockup, end-card, lower-third, title-card components as transparent PNG sequences or SVG.
- Rules the skill enforces, not just documents: product footage occupies the dominant area; ASMR keeps the recorded mic track **on** and applies no music, captions, denoise, gating or heavy processing unless asked; motion carousel slides are independent ~5 s videos with their own in/hold/out; no gradients; Arabic layouts RTL-first with LTR islands for Latin terms; Western digits; Ghorab ≥24px.

### 6.5 Preserve · consolidate · replace · create

| Decision | Items |
|---|---|
| **Preserve** | the A-mark geometry and its floors · the v2.1 nine-colour palette and ramps · the four-face type system and every Arabic rule · `LoveTech` heart in Signature Blue · social canvases, reserves and slot ceilings · the v2 motion charter and the approved v3 motion system · badge taxonomy · the v3 Canva production contract (version stamps, rebuild-not-patch, prohibitions) · hero photography · Gear Nests separation |
| **Consolidate** | mark files → one master with four colour roles · two wordmark components → AdelTechTalks lockup canonical, Adel lockup documented as a secondary lockup or retired (§7.3) · two heart paths → one · three folder taxonomies → §6.1 · purple/blue → one ruling (§7.1) · carousel guide anatomy → Figma 04 (re-skinned) · Canva kit → rebuilt from Figma |
| **Replace** | Cairo → KO Ghorab on every social/video surface · Amiri/emoji heart on the holding page → system faces and drawn heart (or a documented scripture exception) · Dark Impact gradient mode → a Graphite dark mode with no gradient (§7.4) · LinkedIn purple tile → the approved mark role · stock Canva video templates → brand masters |
| **Create** | Figma variables/styles/components · Static Ultra Carousel masters · Motion Carousel storyboards and timing · four video-format kits · channel banners · website component library page · `brand/` export layer · `video-ad-editor` skill · signature system (only when the real handwriting arrives) |

---

## 7 · Decisions needed before Phase 2

1. **Colour ruling.** Confirm that AdelTechTalks (the content brand, social and video included) runs on the v2.1 blue/graphite system that Figma already states, and that Edition 1 purple / Dark Impact moves to `99 Archive`. This is the recommended path: it matches the canonical tool, the live site, the roadmap's "brand frozen" milestone and the v3 sign-off. The alternative — keeping purple for content and blue for the site — means two brand kits, two template sets and two video looks under one name.
2. **Mark default colour.** Graphite as the everyday mark, Signature Blue as the brand alternative, White reversed, Mono for print. App icon and profile tiles: white mark on Signature Blue, or on Graphite? (Recommendation: Signature Blue tile, no gradient.)
3. **Wordmark.** Is the "Adel" lockup still needed anywhere, or is "AdelTechTalks" the only lockup? (Recommendation: AdelTechTalks primary; Adel kept as a documented personal sign-off lockup only.)
4. **Dark mode.** Approve a Graphite-ground set (Graphite canvas, `#25272C`-class raised surface, Ice Blue text, Signature Blue accent, Mint ≤3%) as the video/thumbnail dark mode, no gradient. Or specify Dark Impact properly and keep it purple — not recommended under decision 1.
5. **Holding page exception.** Keep Amiri strictly for the ayah as a "scripture" exception, or drop it.
6. **Signature.** Confirm the signature system waits for a scanned real signature (no font stand-in), and whether it is part of the video end card.
7. **Figma page plan.** Approve the 00–99 module list in §6.1 (Pro plan, no page cap).
8. **Video formats.** Confirm the six production families and the Motion Carousel spec: 5–6 independent slides, ~5 s each, 1080×1920, product footage dominant, no template-style transitions.
9. **Canva reset.** Approve moving the nine stock-template designs, the Notion header and the carousel guide into `99 — Archive`, and rebuilding the Brand Kit from Figma once 00–01 are approved.

---

## 8 · What Phase 2 would do (not started)

1. Figma `00`: create colour variables (Light/Dark), type styles, spacing/radius/motion variables; fix the Brand Foundations section; bind the existing swatches.
2. Figma `01`: build the mark and lockup components from `atc-mark-currentcolor.svg` and the one heart path; clear-space and misuse sheets; export set.
3. Figma `02`–`03`: type scales EN/AR with Ghorab uploaded; badge and content components.
4. Repo `brand/`: token export script reading `src/styles/tokens`; consolidate logo files; single heart path; holding-page font fix.
5. Show every change as a before/after in the PR before touching Canva or Adobe.
6. Only then: Canva kit rebuild → template masters (04–07) → video-format kits → the `video-ad-editor` skill (Phase 3).
