# Thumbnail / Video Cover System — execution report

> **✅ FINAL APPROVED** as part of the locked Phase 2B system (2026-09-14). Frozen; not reopened without a genuine implementation blocker.

**Status:** built, rebuilt once after a direction correction, then given a **final visual pass** for competitiveness. Approved Phase 2B extension — **awaiting visual approval**.
**Plan of record:** `09_THUMBNAIL_SYSTEM_PLAN.md`, written before any Figma change.
**Figma:** thirteen `Thumb /` primitives on `04 — Core Components`; ten archetypes, five platform profiles and the production test on `08 — Social / Channel`.
**Changes no approved Phase 2A value.** Six thumbnail-scale text styles were added because the social ramp stops short of feed-cover scale; the export regenerates clean (`--check` passes).
**Not touched:** Canva, Adobe, the video engine, Supabase, RLS, the Security Guardrails check, production deployment. PR #25 stays a draft.

---

## 1 · The correction, and what it actually changed

The first pass was judged against a clean Brand OS aesthetic. That produced covers that were **wrong for the job**: symmetrical layouts, media in rounded cards with hairline borders, subjects sitting politely inside margins, four- and five-word hooks, and a great deal of empty space. They looked like presentation slides. At 168 px in a feed they said nothing.

The corrected brief: **one visual idea, under one second, at feed size, on a phone.** Brand consistency supports the thumbnail; it must not overpower it.

What that changed concretely:

| Before | After |
|---|---|
| media in rounded, bordered cards | `Treatment = Bleed` — no radius, no border, subject bleeds off an edge |
| subject ~30% of canvas, inside margins | dominant subject **40–70%**, cropped close |
| hook at 112 px, sentence case, 4–6 words | **impact tier** at 140 px Montserrat Black, ALL CAPS, **2–5 words** |
| no annotation vocabulary | `Thumb / Annotation` — drawn arrow, circle, underline, strike, handwritten note |
| balanced, centred compositions | asymmetric, overlapping, deliberate tension |
| eight archetypes named after content types | **ten families named after visual patterns** |

What was **kept**, because the correction did not invalidate it: all thirteen primitives' architecture, the five platform profiles and their provenance discipline, the language rule, the watermark integration, and the token binding. The archetype layer was rebuilt; the system underneath it was not.

## 1b · The visual-competitiveness pass

The second review was blunt and correct: legibility was proven, **click-worthiness was not**. The examples still read as design-system demonstrations — split-layout cards, annotation samples, typography tests — rather than thumbnails competing in a feed. The rules that came out of it are now in the export under `thumbnails.composition`:

- **The subject is the hero.** Face, device, screen or transformation carries the majority of visual attention. Subjects bleed off edges, overlap zones and sit **behind** typography. Composed, not boxed.
- **No rigid 50/50 splits** unless the story genuinely is a comparison. A split used as a default is the clearest tell of a template.
- **No panel drawn merely to hold text.** Type sits directly on photography, controlled blur or depth. Contrast is bought with a **global grade over the whole image**, never a local rectangle with a visible edge.
- **Annotation must identify something real** — a feature, a contradiction, a before/after difference, a hinge. Otherwise there is no annotation.
- **Judge in a feed**, at real mobile size, in dark chrome — never alone on a white canvas.

Applying the fourth rule cost two annotations: the circles on Directions A and C were pointing at a **pending media slot**, which is not something real. They were deleted rather than kept for show.

## 2 · Primitives — 13 on module 04

| Component | Properties |
|---|---|
| `Thumb / Background field` | `Field = Graphite \| Ice \| Warm \| Expressive` |
| `Thumb / Portrait frame` | `Treatment = Bleed \| Framed \| Cutout`, `Rim light` |
| `Thumb / Product hero` | `Treatment = Bleed \| Framed \| Cutout`, `Rim light` |
| `Thumb / Image mask` | `Ratio = 16:9 \| 1:1 \| 4:5` |
| `Thumb / Subject separation` | `Mode = Scrim \| Outline` |
| **`Thumb / Impact hook`** | `Lang = EN \| AR`, TEXT `Hook`, `Underline` |
| **`Thumb / Annotation`** | `Mark = Arrow \| Circle \| Underline \| Strike \| Note`, TEXT `Note` |
| `Thumb / Hook text` | `Lang = EN \| AR`, `Size = XL \| L` |
| `Thumb / Eyebrow` | `Lang = EN \| AR` |
| `Thumb / Tech label` | TEXT `Term` |
| `Thumb / Platform label` | TEXT `Platform` |
| `Thumb / Feature callout` | `Lang = EN \| AR` |
| `Thumb / Comparison divider` | `Orientation = Vertical \| Diagonal`, `Show VS` |

The two in bold are the ones that made the difference between a branded card and a thumbnail.

**Annotation** is drawn paths, not geometric shapes, plus the approved **Caveat** sketch face for handwritten notes. Always **Spark Coral** from the Expressive palette — never Signature Blue, so an annotation can never be mistaken for a UI element. One marked idea per cover, sitting **on** the subject, not floating in empty space beside it. That last rule came out of a real defect: the first Sketch archetype put its circle in the empty half of the frame, where it circled nothing.

The watermark is **instanced** from `Watermark / A-Mark`, not rebuilt. On a 720 px short edge the 2.96 % rule would give a 21 px mark, so the **24 px floor wins** and it is placed at 0.75 scale — the floor doing exactly its job.

## 3 · Ten feed-native archetypes — module 08

Each is a component set with `Lang = EN | AR` at the audited 1280 × 720 master. **Twenty variants**, because light and dark still come from the semantic mode.

1. **PRODUCT DOMINANT** · 2. **FACE + PRODUCT** · 3. **A/B COMPARISON** · 4. **SCREEN / FEATURE EMPHASIS** · 5. **SKETCH / ANNOTATION** · 6. **BIG CLAIM** · 7. **VISUAL CONTRADICTION** · 8. **PROBLEM / FIX** · 9. **TRANSFORMATION** · 10. **MINIMAL PREMIUM**

Each carries its own failure mode in its component description — the sentence that says when *not* to use it. For example: Minimal Premium only when the subject is strong enough to carry a quiet frame, otherwise it becomes the corporate cover the rest of the system exists to avoid. Visual Contradiction only when the video genuinely challenges the claim, otherwise it is a lie in a thumbnail.

Arabic is a mirror of the composition, not a translation of the layout — and in Problem / Fix and Transformation the **state order flips**, because RTL reads the first state on the right.

## 4 · Platform profiles — composition, not invented sizes

Two masters, both audited in `site/src/styles/tokens/brand.css`: **Thumb 16:9** 1280 × 720 margin 64, and **Cover 9:16** 1080 × 1920 margin 72 with 260 / 420 reserves.

| Platform | Master | Profile adds |
|---|---|---|
| YouTube Thumbnail | 16:9 | duration-pill reserve, bottom-right |
| Facebook Video Cover | 16:9 | centre-safe composition only |
| YouTube Shorts Cover | 9:16 | audited reel reserves + 1:1 centre tile |
| Reels Cover | 9:16 | audited reel reserves + 1:1 grid-preview tile |
| TikTok Cover | 9:16 | right-rail reserve + centre tile |

**No platform-specific pixel size is invented.** Every reserve that is not an audited token is flagged `DERIVED — VALIDATION REQUIRED` in the export and labelled on the canvas, exactly as the fold video profiles are. Where a surface has several valid display crops — Facebook placements, the Shorts and Reels grid previews — the profile documents the **safe composition** rather than asserting one false universal crop.

The 1200 × 630 OG share card built by `site/scripts/build-og.mjs` is recorded as **a different surface**, so nobody later mistakes it for a video cover.

**Vertical is recomposed, never resized.** Evidence: `thumb_recomposition-9x16.png` shows the 16:9 source beside its 9:16 cover — the hook moves from beside the subject to stacked above it, the subject grows to full width, the watermark drops to y = 260 to clear the audited reel reserve, and the annotation is redrawn at the new scale rather than scaled up. A centre-crop of the 16:9 would have halved the face and lost the hook.

## 5 · Real production test — three Fold-First directions

Three genuinely different reasons to click the same topic:

| | Archetype | Hook | Subject |
|---|---|---|---|
| **A** | PRODUCT DOMINANT | محتوى Foldable؟ | the device, 44 % of frame, hinge circled |
| **B** | SKETCH / ANNOTATION | بس 9:16؟ | **the real portrait of Adel**, arrow + circle + handwritten أيوه |
| **C** | TRANSFORMATION | نفس الفيديو | 9:16 / 3:4 either side of a hard seam |

**Direction B uses `site/public/photos/adel-hero.jpg` — the real production photograph already in this repository.** No face is generated, synthesised or retouched anywhere in this system. Directions A and C use clearly labelled media placeholders because the repository holds no product photography and no fold footage; inventing a device render would be fabricating evidence.

All three are Arabic-first with English technical terms kept English (`Foldable`), Western digits (`9:16`, `3:4`), dark grounds, and one small corner watermark as the only branding.

## 6 · Mobile feed test — the thing that decided the design

Every archetype rendered at 320 px and 168 px: `thumb_feed-test.png`. This board is not decoration; it is what forced the corrections. Two measured findings came out of it, and both are now rules in the export:

1. **The column rule.** At the impact tier (Montserrat Black 140) a hook column narrower than about **740 px** can only hold words of five characters or fewer. `WORTH IT?` in a 480 px column broke as `WORT / H IT?`. Fixed by widening the column and shortening the copy — never by shrinking the type.
2. **The feed ceiling at the quieter tier.** A four-word hook at Size L stopped resolving at 168 px. Two or three words is the ceiling there. `Lighter than it looks` became `Surprisingly light`.

Both were fixed the way the system requires: **cut words, never shrink type.**

## 7 · Branding restraint

The brand stays recognisable through typography, the approved palette, controlled expressive colour, consistent spacing, and the small Liquid Glass A-mark. **No large logo and no branded frame is forced onto any cover** — it costs attention and buys nothing. One mark per thumbnail; a cover never carries both the watermark and a lockup. Mint stays ≤ 3 %; the Expressive palette enters only as a Background field or through annotation.

## 8 · Evidence

| File | Shows |
|---|---|
| `evidence/thumb_primitives-04.png` | the thirteen primitives, including annotation and impact hook |
| `evidence/thumb_archetypes.png` | all ten archetypes, EN and AR |
| `evidence/thumb_foldfirst-directions.png` | the three Fold-First directions with captions |
| `evidence/thumb_direction-b-real-portrait.png` | Direction B full size, on the real portrait |
| `evidence/thumb_feed-test.png` | every archetype at 320 and 168 px |
| `evidence/thumb_recomposition-9x16.png` | 16:9 source beside its recomposed 9:16 cover |
| `evidence/thumb_profile-youtube.png` · `thumb_profile-tiktok.png` | platform profiles with provenance on the canvas |

## 9 · Future workflow — contract only, not built

Adel supplies video or image, portrait, topic, platform and language, and asks for "a YouTube thumbnail for this video". The system then: **1.** identifies the strongest visual subject · **2.** chooses the archetype · **3.** reframes the image without blind-cropping the focal area · **4.** writes hook copy inside the word ceilings, keeping established terms English · **5.** applies the Brand OS · **6.** applies the corner watermark · **7.** exports the platform version from the correct profile.

**Video-frame extraction is not built and the video engine is not modified.** The contract is documented in `brand/tokens/adel-v2.1.json → thumbnails.workflow`, including what it must never do: fabricate a face, invent a product render, invent a platform dimension, centre-crop a master into a vertical cover, or repeat the video title as the hook.

## 9b · The three finished Fold-First directions

| | Pattern | Hook | Media | State |
|---|---|---|---|---|
| **A** | FACE + FOLDABLE | مش 9:16 بس | **real photograph**, close crop, global grade | composition approved · device pending |
| **B** | TRANSFORMATION | 9:16 بيقص | **real photograph, no placeholder at all** | **finished** |
| **C** | DEVICE-DOMINANT | FOLD ≠ CROP | **real photograph** blurred as environment; device pending | composition approved · device pending |

**Direction B is the only fully finished one, and it is the strongest.** Its idea needs no placeholder because the idea *is* the crop: the real photograph runs full-bleed, the 9:16 region is outlined in white, everything outside it is graded back, and two drawn arrows point outward at what a vertical crop throws away. Handwritten `9:16` and `3:4` label the two regions. It reads before the text does, which is the whole test.

**A and C are composition-complete and media-blocked.** Both use the real photograph — A as the hero at close crop, C blurred into an environment so the frame has depth instead of a flat field. Neither pretends: the device is a **dashed, labelled `FOLDABLE — IMAGE PENDING` slot**, not a grey box dressed as a product.

### The one remaining media dependency

**There is no foldable / device photography in this repository.** That is the single blocker on final visual approval for A and C. Everything else on those two frames — crop, grade, type, hook, watermark, safe zones — is final. When a device image exists, dropping it into the slot finishes both, and the annotation that was removed comes back pointing at the hinge.

Sourcing that image is a real decision, not a design one: it needs either Adel's own photograph of the device or a licensed product shot. Inventing a render would have made these look finished while proving nothing.

## 9c · Feed test, in feed chrome

`evidence/thumb_final_feed-test.png` places all three at **380 px wide in a 412 px dark feed column**, with channel avatar, two-line title, view count and duration pill — the context they actually compete in. Findings:

- **B reads instantly.** The white crop boundary survives the size reduction better than any other element in the system.
- **A reads instantly** on the face; the dashed pending slot is the only thing that looks unfinished, which is accurate.
- **C is legible but hollow** at feed size — a large empty slot is exactly as weak as it should look until the device image arrives.

The reference thumbnails supplied for this review were used as the **quality bar for visual behaviour** — subject scale, readability, annotation, comparison tension, copy length. They are deliberately **not reproduced inside the brand file**: third-party creators' artwork does not belong in AdelTechTalks' component library, and no creator's composition or identity was copied.

## 9d · Two corrections recorded

1. **The 740 px finding is not a universal rule** and is no longer written as one. It is stored as `impact-hook-current-style-constraint`: a property of the **current** Impact Hook style only — Montserrat Black 140 / 128 / -3 % tracking, Latin uppercase — that disappears the moment the font, size, weight, tracking or column changes. A setting to check, not a law.
2. **The sketch face has no Arabic glyphs.** Caveat is Latin-only, so an Arabic "handwritten" note was silently falling back to a non-handwritten face — the annotation was not annotation at all. In Arabic compositions the handwritten note now carries **digits or an established Latin term** (`9:16`, `3:4`, `AI`, `Foldable`). This is why Direction B's handwriting works and reads as genuinely drawn.

## 10 · Open questions

1. **No product, device or fold photography exists in the repository — the one remaining media dependency.** Directions A and C and seven of the ten archetypes are composition-complete and image-blocked. Type, annotation, grade, watermark and safe zones are final. This is the item that stands between the system and full visual approval, and it is a sourcing decision rather than a design one.
2. **Cutout is supported but not manufactured.** `Treatment = Cutout` expects a transparent PNG from the author. Background removal would mean Adobe or Canva, both out of scope here.
3. **Every derived platform reserve still needs device validation** — the duration-pill band, the TikTok right rail, and the 1:1 centre tiles. They are working values, flagged as such, never presented as measured.
4. **KO Ghorab remains a placeholder** in the Arabic impact style, carried from Phase 2A validation item 1.
5. **Annotation is currently five marks.** Whether a sixth (bracket, or a scribbled box) earns its place should be decided from real production use, not added speculatively.
