# Thumbnail / Video Cover System — implementation plan

**Written before any Figma change**, as this project has done for every phase. The executed result is `10_THUMBNAIL_SYSTEM_REPORT.md`.
**Status:** an approved extension of Phase 2B. Phase 2B is **not restarted**; the 34 components already on `04` are not disturbed.
**Scope:** new thumbnail primitives on `04 — Core Components`, and the full Thumbnail System on `08 — Social / Channel`. Nothing else moves.
**Not touched:** Canva, Adobe, the video engine, Supabase, RLS, the Security Guardrails check, production deployment. PR #25 stays a draft.

> **Direction correction, received mid-build and applied.** The first pass of this plan optimised for a clean Brand OS aesthetic and produced covers that read as branded cards: symmetrical, card-framed, small subjects, long hooks, too much empty space. The corrected brief is that a thumbnail must communicate **one visual idea in under one second at feed size on a phone**, and that brand consistency supports the thumbnail rather than overpowering it. Sections 3, 4, 5 and 6 below were rewritten against that. The primitives, platform profiles and infrastructure were kept; the archetype layer was rebuilt. Full account in `10_THUMBNAIL_SYSTEM_REPORT.md` §1.

---

## 1 · The goal, stated as a constraint

The system takes **a supplied image** — a portrait of Adel, a product photograph, a still, a screenshot, or eventually a frame pulled from a video — and produces a branded, platform-ready cover. It is built for publishing, so every decision below is made for the 168 px-wide version a viewer actually sees in a feed, not for the 1280 px version in Figma.

One rule governs the whole system: **one idea, instantly.** If a thumbnail needs a second look to be understood, the archetype is wrong, not the type size.

## 2 · Platform dimensions — what is established, and what is not

The instruction is to use official dimensions **only where already established in the project or clearly documented**. Two canvases are established in `site/src/styles/tokens/brand.css` and already carry audited safe zones:

| Master canvas | Size | Margin | Grid | Source |
|---|---|---|---|---|
| **Thumb 16:9** | 1280 × 720 | 64 | 8 cols · 24 | `--atc-social-thumb-*` — audited |
| **Cover 9:16** | 1080 × 1920 | 72 | 4 cols · 32 | `--atc-social-reel-*` — audited |

A third established surface exists and is **not** part of this system: the **1200 × 630 OG share card** built by `site/scripts/build-og.mjs`, which is what LinkedIn and Facebook render for a *link*. It is noted here so nobody later confuses it with a video cover.

**No platform-specific pixel size is invented.** The five platform profiles are therefore **composition profiles over the two established masters**, not five new canvases:

| Platform | Master | What the profile adds |
|---|---|---|
| YouTube Thumbnail | Thumb 16:9 | duration-pill reserve, bottom-right |
| Facebook Video Cover | Thumb 16:9 | centre-safe area — the surface has several display crops |
| YouTube Shorts Cover | Cover 9:16 | audited reel reserves + centre tile |
| Reels Cover | Cover 9:16 | audited reel reserves + centre tile (grid preview) |
| TikTok Cover | Cover 9:16 | audited reel reserves + right-rail and caption reserves |

Every reserve that is **not** one of the audited token values is flagged **DERIVED — VALIDATION REQUIRED** in the export and labelled as such on the canvas, exactly as the fold profiles are in `04_ADAPTIVE_FOLD_FIRST.md`. Where a surface has several valid crops — Shorts and Reels grid previews, Facebook's placements — the profile documents the **safe composition** (what must survive any of them) instead of asserting one false universal crop.

## 3 · Primitives on 04

Prefixed `Thumb /` so they sort together and never collide with the existing 34 components. Eleven, not thirty:

| Component | Properties |
|---|---|
| `Thumb / Background field` | `Field = Graphite \| Ice \| Warm \| Expressive` |
| `Thumb / Portrait frame` | `Treatment = Framed \| Cutout`, `Rim light` |
| `Thumb / Product hero` | `Treatment = Framed \| Cutout`, `Rim light` |
| `Thumb / Image mask` | `Ratio = 16:9 \| 1:1 \| 4:5` |
| `Thumb / Subject separation` | `Mode = Scrim \| Outline` |
| `Thumb / Hook text` | `Lang = EN \| AR`, `Size = XL \| L` |
| `Thumb / Eyebrow` | `Lang = EN \| AR` |
| `Thumb / Tech label` | — (always LTR) |
| `Thumb / Platform label` | — (always LTR) |
| `Thumb / Feature callout` | `Lang = EN \| AR` |
| `Thumb / Comparison divider` | `Orientation = Vertical \| Diagonal`, `Show VS` |

The watermark is **not** rebuilt — `Watermark / A-Mark` from the watermark rule is instanced.

**Cutout is a supported treatment, not a claim.** `Treatment = Cutout` expects a transparent PNG supplied by the author. The repo holds no cutout asset and background removal would mean reaching for Adobe or Canva, which are out of scope, so the production examples use `Framed` and separation is achieved compositionally (scrim, field, bounded zone). This is stated in the report rather than quietly papered over.

## 4 · Archetypes on 08

Eight, each a component set with `Lang = EN | AR`, built on the **Thumb 16:9** master — **16 variants, not forty**:

1. Talking Head · 2. Product Hero · 3. Talking Head + Product · 4. Comparison / VS · 5. Explainer / Tech News · 6. Bold Hook · 7. Minimal Premium · 8. Screenshot / UI Feature

Light and dark still come from the semantic mode, so no archetype doubles for theme. Archetypes are compositions; platform templates are canvas + safe overlay + a recomposition of an archetype. A 9:16 cover **recomposes** an archetype the way the fold profiles recompose a video — it is never a centre-crop of the 16:9 master.

## 5 · Text rules

Hook copy is **2–6 words**, and it is a *hook*, not the video title repeated. Slot ceilings enforced as designed: hook 6 words, eyebrow 3, callout 5, tech label 2.

Arabic follows the approved language rule already in the system: the sentence stays Arabic, and recognised platform, product, creator and technical terms stay in English as isolated LTR islands — YouTube Shorts, Foldable, AI, Motion Design, Reels, Claude, Figma, Insta360. No literal Arabic translation of an established term is forced.

## 6 · Creative direction

High-end tech, modern, creator-led, editorial, visually bold, and **recognisable at 168 px**. Concretely: one focal subject, one hook line, huge type, real negative space, flat colour, and depth from scrim and shadow rather than effects.

Explicitly out: generic clickbait styling, emoji, default red arrows, random glow, gradients (retired system-wide), clutter, sentence-length copy, and eight templates that are the same card in different colours.

Mint stays ≤ 3%. Expressive hues enter only through a controlled property, as everywhere else.

## 7 · Real production test

Three examples, real content, no Lorem Ipsum:

1. **Fold-First / Foldable** — Talking Head, using `site/public/photos/adel-hero.jpg`, the real production portrait already in the repo. **Adel's face is not fabricated or generated anywhere in this system.**
2. **AI / Vibe Designing** — Bold Hook, Arabic-first with English technical terms.
3. **Product / Tech** — Product Hero. No product photography exists in the repo, so this one uses a **clearly labelled media placeholder** rather than an invented render.

Each is evidenced at full size and at mobile size.

## 8 · Future workflow — contract only

The interface Adel will eventually use is documented as a **contract**, not built: inputs (video / image / portrait / topic / platform / language), the seven steps the system performs, and what it must never do. **Video-frame extraction is not built** and no video-engine file changes.

## 9 · Evidence to produce

Component inventory · platform profile inventory · archetype inventory · three real examples · mobile-size readability · light/dark · Arabic-English mixed copy · watermark · module 08 screenshots · open questions.
