# Phase 2A — Refinement pass

**Status: FINAL APPROVED.** Phase 2A is the locked AdelTechTalks Brand OS foundation. This pass resolved the eight decisions raised at review and confirmed the two required patches. Nothing here begins Phase 2B, Canva or Adobe, and PR #24 is not merged.
**Date:** 2026-09-14.

---

## 1 · KO Ghorab — verified, not uploaded

**Finding: the licence terms are not stored with the project.** There is no EULA, licence file, purchase record or written grant anywhere in the repository. `site/src/assets/fonts/README.md` and `tokens/adel-type.css` both *assert* that the face is "licensed to Adel" and "not redistributable", but neither reproduces the terms, and no separate document exists to check.

A Figma team-font upload places the file on Figma's servers and makes it available to every member of the team. That is a redistribution-shaped use. With no terms to read, the licence **does not clearly permit it**.

**Applied, exactly as instructed:**
- KO Ghorab is **not** uploaded to the Figma team.
- The four `[Ghorab]` styles keep their labelled Readex Pro placeholder family. Sizes and leading stay final; only the family would ever change.
- KO Ghorab **remains the approved Arabic display typeface** and stays in production and export use where the licence does permit it — self-hosted on the site, and in local rendering.
- No other typeface substitutes for it. The placeholder is a label, not a replacement.

**To lift this:** supply the licence document, or a written confirmation from Kotype that team/cloud font hosting is covered. Then the upload is a two-minute change — swap the family on four styles, nothing else moves.

## 2 · Dark semantic values — resolved, derived, contrast-checked

All five previously open values are now defined as **newly introduced v2.1 semantic values**, derived from the approved Graphite / Blue system. Nothing is inherited from Dark Impact or Edition 1. Exactly **one** new primitive was added; everything else is an existing ramp step.

| Token | Dark value | Derivation | Contrast |
|---|---|---|---|
| `surface/sunken` | `neutral/graphite-sunken` **#090D12** | Graphite − the measured canvas→raised step (+14/+13/+13), mirroring the light ladder downward | white 19.48:1 · soft-gray 15.88:1 |
| `surface/tint` | `blue/900` **#0D264F** | the published blue ramp's darkest step — the dark counterpart of Ice Blue, an existing value rather than a new mix | white 14.92:1 · ice-blue 12.34:1 |
| `action/primary-bg` | `blue/400` **#5B8EF4** | see the ladder rule below | graphite text 5.50:1 · 5.50:1 against the canvas |
| `action/primary-bg-hover` | `blue/300` **#8FB9FA** | one step further from the surface | graphite text 8.71:1 |
| `action/primary-bg-pressed` | `blue/200` **#BBD7FF** | two steps further | graphite text 11.86:1 |
| `action/primary-fg` | `brand/graphite` **#171A1F** | the fill is now the light element, so the label inverts with it | as above |

**The ladder rule.** The light system's rule is *each state moves one step further from the surface* — on white that direction is darker. On a Graphite surface that same rule points **lighter**. So the dark ladder is the identical rule mirrored, using the same published ramp.

This is not a stylistic preference. Keeping the light ladder on dark fails the 3:1 UI floor against the canvas:

| If dark kept the light ladder | Text | Against the Graphite canvas |
|---|---|---|
| `blue/500` | white 5.17:1 | **3.37:1** |
| `blue/600` | white 6.64:1 | **2.63:1** ✗ |
| `deep-blue/700` | white 8.63:1 | **2.02:1** ✗ |

And white text on the mirrored ladder fails too (`blue/400` = 3.17:1), which is why the foreground becomes Graphite. The mirrored ladder with a Graphite label is the only option that clears both floors using approved values.

Every value is marked `introduced: "v2.1"` in the export and carries its derivation and measured contrast in both the JSON and the Figma variable description. The `open` flag count in the export is now **zero**.

## 3 · App icon

**Signature Blue is the default tile ground.** Graphite exists as a secondary dark variant. No gradient — the Edition 1 Impact-gradient icon stays retired. The Figma component set is reordered so Signature Blue is the default variant, and the description states the ruling.

## 4 · Legacy pages

The four non-canonical pages are renamed `Legacy / Reference — …` and placed **after** `99 — Archive / Edition 1` by explicit page order rather than by alphabetical accident. They are intact, clearly labelled, and not deleted.

```
00 … 09  ·  90 — Export Library  ·  99 — Archive / Edition 1
Legacy / Reference — Website Explorations
Legacy / Reference — Mobile App
Legacy / Reference — 0 to Hero Product
Legacy / Reference — QA & Handoff
```

## 5 · AR/UI

Removed from the canonical core typography system: no source token backs it and nothing in production uses it. The style is preserved as **`Legacy / AR-UI (reference only)`** so any existing dependency still resolves, with a description saying plainly that it is not a brand standard. Its specimen row moved out of the Arabic group into a Legacy / Reference group on page 03. **Replacement guidance:** Arabic compact UI takes the `EN/Label` size (14/20) with the Arabic body face, Readex Pro.

The canonical core is now **27** text styles.

## 6 · Signature and the video end card

When the real scanned signature arrives it becomes an **optional end-card variant** a job may choose. It is never applied automatically and never becomes mandatory branding on every video; the default end card carries the mark or lockup. It follows the canvas profile's brand zone at micro scale, in every profile.

Nothing is created or simulated until the real scan is supplied. The reserved slot stays empty, and its Figma description now records the optional-variant rule.

## 7 · Amiri

Unchanged and reconfirmed: a documented special-purpose **scripture exception** for the holding-page ayah, where the existing use case requires it. Explicitly **not** part of the core typography system. No style was created for it.

## 8 · Heart path

The mismatched heart path in `site/scripts/build-og-adel.mjs` is **left untouched in this phase**, as instructed. Tracked as a later site-cleanup PR: the share-card generator draws its own path while `LoveTech.astro` draws the master at `brand/heart/love-tech-heart.svg`; the fix is to have the generator read the master. No site code was touched in Phase 2A.

---

## Patch #1 — Expressive / Creator palette (confirmed in place)

Delivered in the previous pass and unchanged by this refinement. Purple, Spark Coral, Magenta, Electric / Signal Blue and Lavender are an approved secondary palette with named tokens and defined roles, in their own `Color / Expressive` Figma collection and their own export block. Signature Blue remains primary. None of the five was moved into 99 — page 99 now tags each swatch either "→ EXPRESSIVE (approved)" or "ARCHIVED". Core and Expressive are shown as two separate boards on `01 — Foundations`.

## Patch #2 — Adaptive / Fold-First canvas system (confirmed in place)

Delivered in the previous pass. Four canonical machine-readable video profiles — Standard Vertical 1080×1920, Fold Portrait 1440×1920, Fold Landscape 1920×1440, YouTube Landscape 1920×1080 — each carrying width, height, aspect, safe zones, content margins, preferred brand zones, caption region, text limits and focal/content-preservation rules. The Feed, Square and Thumbnail profiles are kept in their own static-canvas collection. Recomposition behaviour is documented for Talking Head, Talking Head + B-roll, ASMR / Unboxing, Product Demo, Product Comparison, Motion Carousel and long-form explainer, including how the wider fold canvas supports speaker + product, speaker + supporting visual, side-by-side comparison, product + callout and wider motion compositions. It is a recomposition system, not resize or crop. No videos generated.

**Motion Carousel canonical canvas confirmed as 1080 × 1920.** This was a real discrepancy: `formats/motion-carousel.json` still declared `default_canvas` 1080×1350. Corrected — the format file now carries `canonical_canvas` bound to the `verticalStandard` profile, keeps 1080×1350 only as an explicitly-requested alternate, records the fold editions, and points at the profile source. The Static Ultra Carousel remains 1080×1350 as a separate format. Slides stay 5–6 independently exportable videos of about 5 seconds each with genuine motion composition, never animated static zooms.

## Repo / skill alignment

The machine-readable export already carries `canvasProfiles`, `adaptiveLayouts`, `devicePack` and `adaptiveMigration`. The skill's format contract now references the profile rather than restating a size. The migration inventory lists all sixteen hard-coded call sites with what each must read instead. **No video-engine refactor was performed** — the architecture is ready for it and nothing blocks it.

---

## Validation / follow-up items — none blocking approval

Phase 2A is approved with these open. The first three are the items named at final approval; each is closed by evidence rather than by a design decision.

1. **KO Ghorab licence** — Readex Pro stays the labelled Figma placeholder until the original licence terms or written vendor permission confirm that team/cloud font upload is allowed. KO Ghorab remains the approved **production** Arabic display typeface throughout.
2. **Fold / adaptive safe zones — DEVICE VALIDATION REQUIRED.** The architecture is approved. The fold-landscape and youtube-landscape control bands and the fold-portrait reserves keep their derived working values and are validated on real devices during production testing. No final measurement is invented.
3. **Body word ceiling — DEFERRED.** The enforced slot rule is unchanged at 18 Arabic words on every profile. Raising it for wide canvases is revisited during Static Ultra Carousel and Motion Carousel production testing.

### Still to settle (lower priority)

4. **Focal splits** (62/38 portrait, 55/45 landscape, 58/42 YouTube) — compositional starting points, not measured.
6. **Default large-screen YouTube profile** — `foldLandscape` or `youtubeLandscape` when both would serve.
7. **Frame rate per profile** — all four are 30 fps; confirm, or allow 60 fps for landscape demo footage.
8. **Adaptive Device Pack default subset** — when a job names no profiles, produce nothing by default, or standard + YouTube?
9. **Expressive palette coverage** — whether any family beyond the five should join, and whether badges are the one component where an expressive hue is the default rather than an option.
10. **Figma → CSS sync direction** — the generator reads the site CSS today; a later phase should either export Figma variables to CSS or verify the two against each other in CI.
11. **Legacy sections on page 00** (Typography & Language, Badge Taxonomy, Visual Direction) — keep as pre-2A reference or move to 99 in Phase 2B.
12. **Security guardrails CI** — unrelated to this work and out of scope by instruction, but it will keep PR #24 red until the `shares` decision is made. Detail in the PR comment.
