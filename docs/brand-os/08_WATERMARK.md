# Liquid Glass Corner Watermark

> **✅ FINAL APPROVED** as part of the locked Phase 2B system (2026-09-14). Frozen; not reopened without a genuine implementation blocker.

**Status: APPROVED Brand OS rule**, added 2026-09-14 after Phase 2A was locked. It changes **no approved Phase 2A value** — every fill, stroke, radius and spacing below is an existing token, and the export regenerates clean (`node brand/scripts/build-tokens.mjs --check`).
**Machine-readable source:** `brand/tokens/adel-v2.1.json` → `watermark`, plus `rules.watermark`.
**Figma:** component set `Watermark / A-Mark` and the `Watermark · placement & scale` spec frame on `04 — Core Components`; a `Show watermark` boolean on all ten archetypes on `05 — Static Ultra Carousel`.
**Not in this rule:** the video engine is untouched. No renderer, template, or format JSON changed.

---

## 1 · What it is, and what it is not

A tiny AdelTechTalks ownership mark for the corner of images and video. It exists so a screenshot, a re-shared slide or a re-uploaded clip still says who made it.

**It is a signature, not a shield.** It does not prevent theft and is never sized, placed or weighted as if it could. Everything below follows from that one sentence: small, one corner, inside the safe zone, never centred, never enlarged, never distracting.

## 2 · The two components

| Component | Use | Plate | Edge highlight | Mark |
|---|---|---|---|---|
| `Watermark / A-Mark / Glass Light` | light media and light grounds | `alpha/white-22` | `brand/white` @ 50% | `brand/graphite` @ 80% |
| `Watermark / A-Mark / Glass Dark` | dark media and dark grounds | `alpha/white-10` | `alpha/white-22` | `brand/white` @ 92% |

In Figma these are the two variants of one set, `Watermark / A-Mark`, with the property `Glass = Light | Dark`. The mark inside is an **instance of the existing `Mark / A` master** — the watermark does not re-master the mark, so there is still one geometry and one source of truth.

The element is the **A-mark**. The full lockup may be supported later; the mark is the default.

### Why this is a variant and not a mode

Everything else in the system takes Light/Dark from the `Color / Semantic` mode, and Phase 2B is explicit that theme is a mode and not a variant. The watermark is the one deliberate exception, for a concrete reason: **it responds to the luminance of the media underneath the corner, which the semantic mode does not know.** A dark photograph sits happily on a light slide, and there the correct watermark is Glass Dark. So the glass tone is a variant, and the mark fill binds to a primitive (`brand/graphite` / `brand/white`) rather than to a `mark/*` semantic, on purpose — otherwise a dark-mode frame would flip a watermark that is sitting on a light photo.

## 3 · Treatment

Frosted translucent plate — `radius/panel`, a **background blur of 20**, and **one** hairline edge highlight at `stroke/hairline`. That is the whole treatment.

Forbidden: heavy glow · gradients of any kind · 3D or chrome · drop-shadow stacks · animation by default · expressive-palette tinting · recolouring the mark outside Graphite / White.

## 4 · Geometry and scale

```
mark height          32  at a 1080 short edge   (2.96% of the short edge)
plate padding        space/3  (12)
plate at reference   63 × 56
radius               radius/panel (18)
edge stroke          stroke/hairline (1)
background blur      20
```

The whole watermark **scales with the canvas short edge** and never shrinks below the 24 px mark floor (`mark/min-size`). It never grows to make a point. Because the geometry is a ratio and the inset is read from a profile, the watermark survives the four adaptive video canvases without a second component.

## 5 · Placement

**Default corner: top-left.** Inset `x = canvas margin`, `y = canvas reserve-top`, read from the canvas or video profile — never hard-coded. Where a canvas has no top reserve (thumbnails, 16:9) `y` falls back to the margin.

Short-form vertical video prefers top-left. **Any other safe corner is allowed** when composition, captions or platform UI need it — that is a judgement the author makes per piece, not a licence to move it anywhere.

Never: centred · outside the safe zone · over a face · over a product detail · over a caption or subtitle band · over platform UI or a player control band · large enough to read as a design element.

## 6 · Where it is used

**Static.** Social images and thumbnails: **on by default**. Static Ultra Carousel: **optional**, and off by default. That is deliberate — a carousel slide already carries the `Brand / Signature strip`, so switching the watermark on everywhere would put two AdelTechTalks marks on one slide, which is exactly the "distracting" failure the rule forbids. Every one of the ten archetypes carries a `Show watermark` boolean so an author can switch it on for an image-led slide, or for any slide exported without the strip.

**Video.** Documented for the Video System as a **default corner overlay** for Talking Head, ASMR / Unboxing, Product Demo, Product Comparison and Motion Carousel. **Specified, not implemented** — the video engine is not modified by this rule. When it is implemented it reads the inset from the active canvas profile like every other dimension, per the adaptive principle in `04_ADAPTIVE_FOLD_FIRST.md §6`.

## 7 · Evidence

| File | Shows |
|---|---|
| `evidence/watermark_light-media.png` | light media stand-in, watermark top-left, Glass Light |
| `evidence/watermark_dark-media.png` | dark media stand-in, same corner and inset, Glass Dark |
| `evidence/watermark_carousel-slide.png` | Static Ultra Carousel cover slide (Arabic, real content) with `Show watermark` on |
| `evidence/watermark_both-variants.png` | both variants on the grounds each is made for |
| `evidence/watermark_placement-spec.png` | the placement, scale and limits spec frame on module 04 |

The two media examples are **tonal stand-ins built from approved tokens**, not photographs — the repository holds no production photography. They are deliberately built with a tonal edge running under the corner so the frosted plate and the edge highlight can be judged where they are hardest: across a boundary. When real photography exists, re-verify.

## 8 · Open items

1. **Full-lockup watermark** — not built. The A-mark is the approved default; a lockup variant is a later decision, not an omission.
2. **Animated entry for video** — none by default, and none designed. If the Video System later wants a fade-in, it is a Motion charter decision, not a watermark change.
3. **Photographic verification** — the light/dark examples use token stand-ins. The treatment should be re-checked against a real photograph with a busy corner before the video engine adopts it.
