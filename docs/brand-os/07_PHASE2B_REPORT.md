# Phase 2B — Execution report

> ## ✅ STATUS: FINAL APPROVED
>
> Locked by Adel on 2026-09-14. Phase 2B is frozen: Core Components · Static Ultra Carousel · the Liquid Glass corner watermark · the Thumbnail System · the cross-channel cover architecture · the Canva reference findings · the feed-native thumbnail rules · the desk-wizard real-photo test · the Fold-First recomposition architecture.
>
> **Not to be reopened unless a genuine implementation blocker appears.** The one open item is a media dependency, not a design decision: there is no foldable/device photography in the repository, so Fold-First directions A and C remain composition-approved and media-blocked.

**Scope built:** Figma `04 — Core Components` and `05 — Static Ultra Carousel`, plus one real production test carousel.
**Foundation:** Phase 2A, FINAL APPROVED at `b2ce270`. Not reopened or reinterpreted — with one exception, a genuine implementation defect found and corrected (§10.1), reported rather than absorbed.
**Reserved, untouched:** `06 — Motion Carousel`, `07 — Video System`, `08 — Social / Channel`.
**Not touched at all:** Canva, Adobe, Supabase, RLS, the Security Guardrails check, production deployment. PR #24 is not merged; Phase 2B ships as a new stacked draft PR.
**Plan of record:** `06_PHASE2B_PLAN.md`, written before any Figma change.
**Added mid-phase by approval:** the Liquid Glass corner watermark — a small Brand OS rule requested while Phase 2B was in progress. Built, documented in `08_WATERMARK.md`, summarised in §13 below. It changes no approved Phase 2A value.

---

## 1 · Component inventory — 04 Core Components

**34 components: 15 component sets (46 variants) and 19 single components.**

| Family | Components |
|---|---|
| **Brand** (2) | `Brand / Signature strip` · *masters for Mark, lockups, heart and signature stay on `02` — see §1.1* |
| **Text** (8) | `Eyebrow` · `Headline` · `Subheadline` · `Body` · `Caption` · `Metadata` · `Quote` · `Metric` |
| **Cards / Surfaces** (7) | `Base` · `Elevated` · `Image` · `Feature` · `Metric` · `Quote` · `Comparison` |
| **Media** (5) | `Image frame` 4:3 · `Product frame` 1:1 · `Screenshot frame` 16:9 · `Portrait frame` 4:5 · `Video preview` 16:9 |
| **Callouts** (6) | `Callout / Feature` · `Callout / Stat` · `Label / Tag` · `Badge` · `Citation / Source` · `CTA` |
| **Layout helpers** (7) | `Guide / Safe area` · `Guide / Grid` · `Layout / Image-text split` · `Layout / Hero` · `Layout / Comparison` · `Layout / Quote` · `Layout / Product detail` |

### 1.1 Why the Brand family is a reference row, not new masters

The mark, both lockups, the heart and the signature slot are already masters on `02 — Logo & Signature` and already flip by semantic mode. Re-mastering them on 04 would create a **second source of truth for the mark**, which Phase 2A forbids. So 04 adds only what is genuinely new — `Brand / Signature strip`, the per-slide sign-off, which **instances** the one mark rather than redrawing it. Every slide in the test carousel carries that instance, so there is still exactly one mark in the file.

## 2 · Component properties and variants

| Component | Variants | Properties |
|---|---|---|
| `Text / *` (8 sets) | 2 each | `Content` TEXT · `Lang` [EN\|AR] |
| `Label / Tag` | 10 | `Content` TEXT · `Lang` [EN\|AR] · **`Accent` [Core\|Purple\|Coral\|Magenta\|Signal]** |
| `Badge` | 10 | `Content` TEXT · `Lang` [EN\|AR] · **`Accent` [Core\|Purple\|Coral\|Magenta\|Signal]** |
| `Callout / Feature` | 2 | `Title` · `Body` TEXT · `Lang` |
| `Callout / Stat` | 2 | `Figure` · `Label` TEXT · `Lang` |
| `Citation / Source` | 2 | `Content` TEXT · `Lang` |
| `CTA` | 4 | `Content` TEXT · `Lang` · `Style` [Primary\|Secondary] |
| `Brand / Signature strip` | 2 | `Show handle` BOOLEAN · `Lang` |
| Cards, Media, Layout, Guides | single | structural slots, no variants needed |

**Theme costs zero variants.** Every fill is bound to `Color / Semantic`, which carries Light and Dark. A frame sets the mode once and every nested instance follows. That single decision is why 34 components need 46 variants instead of ~180.

**`Accent` is the only door to the Expressive palette.** A closed list of five, defaulting to `Core` (Signature Blue). An author picks an expressive hue deliberately; nobody can type a free colour.

## 3 · Static Ultra Carousel archetypes — 05

**Canonical canvas 1080 × 1350 (4:5).** Ten archetypes, `Lang = EN | AR`, **20 variants total, not eighty.**

| # | Archetype | Text properties | Boolean |
|---|---|---|---|
| 01 | Cover / Hook | Eyebrow · Headline · Sub | `Show badge` |
| 02 | Big Statement | Statement | — |
| 03 | Product Hero | Eyebrow · Headline · Spec | — |
| 04 | Feature Breakdown | Headline · Feature 1-3 · Body 1-3 | — |
| 05 | Metric / Big Number | Eyebrow · Figure · Label · Note | — |
| 06 | Comparison | Eyebrow · Headline · Label A/B · Note A/B | — |
| 07 | Screenshot / UI | Eyebrow · Headline · Note | — |
| 08 | Quote | Quote · Attribution | — |
| 09 | Explainer | Eyebrow · Headline · Body 1-2 | `Show media` |
| 10 | Takeaway / CTA | Headline · Sub | `Show CTA` |

Where an archetype genuinely has two shapes it gets a **boolean, not a second archetype**: `Show media` switches the Explainer between image-heavy and text-heavy; `Show CTA` lets a takeaway simply land; `Show badge` is the cover's one optional expressive accent.

## 4 · Screenshots

| File | Shows |
|---|---|
| `phase2b_04-core-components.png` | module 04 — all five families in labelled columns |
| `phase2b_05-carousel-system.png` | module 05 — ten archetypes, EN and AR side by side |
| `phase2b_test-carousel-6slides.png` | the real six-slide production test |
| `phase2b_en-light.png` · `phase2b_en-dark.png` | the same archetype, same instance, English, both themes |
| `phase2b_mark-light-dark-verified.png` | mark and signature strip on both grounds after the §10.1 fix |
| `phase2b_darkslide-mark-fixed.png` | the dark statement slide after the fix |

## 5 · Real content test — "Why Fold-First Content Matters"

Six slides, real project content taken from the approved Phase 2A adaptive spec. **No Lorem Ipsum.** Built **Arabic-first with English technical terms as isolated LTR islands**, because Arabic is the brand's default social script and it exercises the harder path.

| # | Archetype | Line | Theme |
|---|---|---|---|
| 1 | Cover / Hook | محتواك متصمّم لشكل شاشة واحد | light + Purple badge |
| 2 | Big Statement | الأجهزة القابلة للطي بتغيّر الكادر | **dark** |
| 3 | Explainer (media off) | 9:16 لسه مهم | light |
| 4 | Feature Breakdown | بيعيد التكوين، مش بيقصّ | light |
| 5 | Metric | **4** — كوادر من نفس المصدر | light |
| 6 | Takeaway / CTA | متصمّم للشاشة اللي بتستخدمها فعلاً | light + CTA |

Slide 2 runs dark deliberately: it gives the sequence rhythm and doubles as light/dark evidence inside real work rather than a swatch board.

## 6 · Token usage confirmation

Audited programmatically across the six test slides:

| Check | Result |
|---|---|
| Solid fills bound to a variable | **46 / 46** after the §10.1 fix (40 / 46 before) |
| Text nodes on an approved style | **28 / 29** — the one exception is the mark's vector, which has no text |
| Raw hex values | **none** |
| Variables used | `text/primary` · `text/secondary` · `text/link` · `text/inverse` · `border/brand` · `action/primary-bg` · `action/primary-fg` · `mark/primary` · `purple/600` |
| Styles used | `Social/Cover [Ghorab]` · `Social/Title` · `Social/Sub` · `Social/Body` · `Social/Support` · `Social/Label` |

Every spacing, radius, stroke and gap in the components is a bound `Space & Shape` variable. No magic numbers.

## 7 · Arabic RTL evidence

- Every text-bearing component carries `Lang = EN | AR`; the AR variant right-aligns, uses the Arabic body face, and is never letter-spaced.
- Structural mirroring works, not just alignment: in `Callout / Feature` and the Feature Breakdown archetype the **accent rule moves to the trailing edge**; in `Brand / Signature strip` the mark and handle swap order; the signature strip anchors to the trailing margin on AR slides.
- Mixed script is handled as designed: `9:16`, `3:4`, `4:3`, `16:9` and `Brand OS` sit inside Arabic sentences as isolated LTR islands with Western digits.
- The whole six-slide test is Arabic — RTL is evidenced in real composition, not a sample string.

## 8 · Light / dark evidence

`phase2b_en-light.png` and `phase2b_en-dark.png` are **the same archetype and the same instance**, differing only by the semantic mode on the frame. Slide 2 of the production test is dark. The mark, text, borders, and the CTA fill and label all flip automatically — including the Phase 2A dark action ladder, where the primary CTA becomes `blue/400` with a Graphite label.

## 9 · Expressive palette usage

Used exactly once in the test carousel: a **Purple badge** on slide 1, reading "شرح تقني" (technical explainer). That is the sanctioned case — a badge marking an AI/tech explainer — chosen from the closed `Accent` list. One expressive hue leads the piece; nothing else in the carousel uses expressive colour. `Label / Tag` and `Badge` carry all five accent options for future use.

## 10 · Issues discovered

### 10.1 Phase 2A defect — the mark carried an opaque white background (FIXED)

**Found:** the token audit flagged six unbound white fills. Traced to the `Mark / A` and `Heart` components: `createNodeFromSvg` leaves an opaque **white wrapper frame** around the imported path. On light surfaces it is invisible. **On dark it rendered the mark as a white rectangle with the letterform knocked out of it** — visible in the first dark slide render.

**Why this was fixed rather than reported and left:** it is a genuine implementation defect, not a design decision. The approved Phase 2A rule is that the mark is one path in three flat colour roles with no background. Clearing the accidental fill **restores the approved intent**; it does not reinterpret it. Left unfixed it would corrupt every dark composition in this and every later phase.

**Fix:** cleared the wrapper fills on all three `Mark / A` variants and on `Heart`. Instances inherit, so the lockups, app-icon tiles and signature strips corrected automatically. Verified: 46/46 fills bound, and the mark renders correctly on both grounds (`phase2b_mark-light-dark-verified.png`).

### 10.2 Word ceilings — two breaches caught, both fixed by cutting words

The production test was audited slot by slot against the enforced ceilings. **Two breaches, both corrected the way the rule requires — fewer words, never smaller type:**

| Slide | Slot | Was | Ceiling | Fix |
|---|---|---|---|---|
| 1 Cover | Headline | 6 Arabic words | 5 | cut to `محتواك متصمّم لشكل شاشة واحد` (5) |
| 5 Metric | Note | 14 tokens | 8 words / 3 spec tokens | cut the ratio enumeration; the figure and label carry the meaning |

Final audit: **21 slots checked, zero breaches.**

### 10.3 The 18-word body ceiling did NOT damage this story

The rule was not changed and did not need to be. Every body line landed at 7–10 Arabic words against the ceiling of 18 — the constraint was never reached. **No evidence was found that the 18-word ceiling harms readability or storytelling.** The Phase 2A decision to defer that review to carousel production testing is supported by this test.

**One genuine constraint did bite, and it is not the body ceiling.** On slide 5 the subject is four canvas profiles, and the `spec-tokens` ceiling is **3**. Four ratios cannot be enumerated on a spec line without breaching it. Worked around by letting the figure `4` and the label carry the meaning. Evidence for the later review — this is a spec-token issue, not a body-word issue, and it is recorded here rather than acted on.

### 10.4 Variant text properties merge across a set

Figma merges same-named TEXT properties across variants in a set, so an AR variant inherits the **EN default string**. It surfaced as an Arabic Takeaway slide showing an English CTA label. Fixed by overriding the nested instance per variant. Consequence to know: **component default strings show English; authors set real copy anyway.** Not a defect in the system, but worth knowing before someone reports it as one.

### 10.5 Overriding a font size does not carry its line-height

The metric figure at 300px kept the style's 135px line box and collided with its label. Fixed with an explicit proportional line-height. Recorded as a rule for later modules: **if you override a size, set the line-height with it.**

### 10.6 Arabic cover leading is tight (observation, not changed)

At `Social/Cover` 112/123 the ratio is 1.10, while the system's own Arabic display rule elsewhere uses 1.4 (`--adel-type-ar-hero-line`). On a three-line Arabic cover the shadda nearly touches the line above. It is legible and the approved token was **not** changed. Flagged for the same production-testing review as the spec-token ceiling.

## 11 · Repo files changed

| File | Change |
|---|---|
| `docs/brand-os/06_PHASE2B_PLAN.md` | **new** — the implementation plan, written before any Figma change |
| `docs/brand-os/07_PHASE2B_REPORT.md` | **new** — this report |
| `docs/brand-os/08_WATERMARK.md` | **new** — the Liquid Glass corner watermark rule |
| `docs/brand-os/evidence/phase2b_*.png` | **new** — 7 screenshots |
| `docs/brand-os/evidence/watermark_*.png` | **new** — 5 watermark screenshots |
| `brand/scripts/build-tokens.mjs` | the watermark rule block and its markdown section |
| `brand/tokens/adel-v2.1.json` | regenerated — adds `watermark` and `rules.watermark` |
| `.claude/skills/video-ad-editor/BRAND_SYSTEM.md` | regenerated — adds the watermark section |

The component work of Phase 2B changed no token, generator or skill file. The three generated/generator files above changed only for the watermark rule, and `--check` passes.

## 12 · Open questions

1. **KO Ghorab is still the labelled placeholder.** Every Arabic display slot in this phase renders in Readex Pro. The archetypes are final in size and layout; only the family would change. Carried from Phase 2A validation item 1.
2. **The `spec-tokens` ceiling of 3** cannot express the four canvas profiles (§10.3). Review alongside the deferred body-ceiling question.
3. **Arabic cover leading** (§10.6) — confirm 112/123 is intended for three-line Arabic covers, or revisit in the same review.
4. **Media placeholders are empty frames.** The archetypes are proven with real copy but not with real photography — there is no approved product or studio imagery in the repo yet. A second pass with real images is worth doing before the first published carousel.
5. **No export pipeline yet.** The carousel is design-complete; producing final PNG/JPG slides for publishing is not part of this phase.
6. **Module 09 Web Components** still holds pre-2A website content and has not been reconciled with these components. Out of scope here.

---

## 13 · Liquid Glass corner watermark (added mid-phase)

Full rule: `08_WATERMARK.md`. Summary of what was built and what it costs:

| | |
|---|---|
| Figma components | one set `Watermark / A-Mark`, variants `Glass = Light \| Dark`, on module 04 |
| Spec frame | `Watermark · placement & scale` — placement, scale, variant choice and the "never" list |
| Archetype integration | a `Show watermark` BOOLEAN on **all ten** archetypes, default **off**, slot positioned top-left at margin / reserve-top |
| New colour values | **none** — plate, edge and mark bind to `alpha/white-22`, `alpha/white-10`, `brand/white`, `brand/graphite` |
| New tokens | none. Geometry is a ratio plus existing `space/3`, `radius/panel`, `stroke/hairline`, `mark/min-size` |
| Video engine | **untouched** — the rule is specified for the Video System, not implemented |

Three design decisions worth recording:

1. **Glass tone is a variant, not a mode.** This is the one deliberate exception to "theme is a mode" (§2). The watermark follows the luminance of the media under the corner, which the semantic mode cannot know — a dark photo on a light slide takes Glass Dark. The mark fill therefore binds to a primitive, not to `mark/*`, so a dark-mode frame cannot flip a watermark sitting on a light photograph.
2. **The mark is instanced, not re-mastered.** The watermark contains an instance of the existing `Mark / A` master, so there is still one geometry. The nested vector's fill is overridden to a primitive — the only override, and the reason for it is decision 1.
3. **Default off on the carousel.** A Static Ultra Carousel slide already carries the `Brand / Signature strip`. Turning the watermark on by default would put two AdelTechTalks marks on every slide, which is the "visually distracting" failure the rule itself forbids. The boolean exists so an author switches it on for an image-led slide or a slide exported without the strip. On standalone images, thumbnails and video it is on by default.

**Evidence produced:** light media example, dark media example, a real Static Ultra Carousel slide with it switched on, both variants side by side on the grounds they are made for, and the placement spec frame — `evidence/watermark_*.png`.

**Honest limitation:** the light and dark "media" are tonal stand-ins built from approved tokens, because the repository holds no production photography. They were built with a tonal edge running under the corner so the frosted plate is judged where it is hardest, but a real photograph with a busy corner is still the test that matters. Listed as open item 3 in `08_WATERMARK.md`.

---

## 14 · Thumbnail / Video Cover System (approved extension)

Full account: `09_THUMBNAIL_SYSTEM_PLAN.md` and `10_THUMBNAIL_SYSTEM_REPORT.md`.

Thirteen `Thumb /` primitives on module 04, ten feed-native archetypes and five platform profiles on module 08, three real Fold-First directions, and a 9:16 recomposition. Built, then **rebuilt once mid-flight** after a direction correction: the first pass optimised for a clean Brand OS aesthetic and produced branded cards that said nothing at feed size. The corrected system is built for one visual idea in under one second on a phone — dominant subjects at 40-70% of the canvas, bleed instead of cards, a 2-5 word impact hook, and a hand-drawn annotation layer.

Two measured findings became rules: at the impact tier a hook column narrower than ~740 px only holds words of five characters or fewer, and at the quieter tier a four-word hook stops resolving at 168 px. Both were fixed by cutting words, never by shrinking type.

No approved Phase 2A value changed. Six thumbnail-scale text styles were added; the export regenerates clean.

---

## 15 · Canva reference findings (approved study)

Full account: `12_CANVA_REFERENCE_FINDINGS.md`. Reference only — Canva overrode nothing and the Figma Brand OS remains canonical.

**What was actually inspected:** the connector exposes the account's own content, not Canva's public gallery — 0 brand templates, 1 brand kit, 11 designs. No claim is made about the public template library, because it could not be reached and inventing one would have been research theatre.

**The finding that mattered:** there is not one 16:9 thumbnail or video cover in the account. Everything is 9:16. Only one design is substantive — a DJI Osmo Pocket 4P carousel build guide — and it is an **Edition 1** document (Cairo, Purple 600, Ink ramp, Mist/Veil, Dark Impact, 45° gradient), all archived by Phase 2A. The other ten are untouched stock templates still carrying "Matthew Collins" and "reallygreatsite.com".

**Adopted:** per-archetype media requirements (and the honesty of naming which archetype to use when the shoot is thin) · a pre-export checklist · stating what a photograph must *provide* · an Instagram Video Cover profile, exposed by the account's 9:16-only reality · tool limits for the eventual rebuild.

**Converged independently:** the guide's word ceilings with "always fewer words, never smaller type", and per-direction trade-offs that say when *not* to use each. Both already in this system — evidence the rules are sound, not a borrowing.

**Rejected:** every Edition 1 colour and type value · the Origin Corner shape signature · a glass panel on every slide · generic template energy · Canva as a source of truth.

**Changed here:** six additive items, no approved value touched, no archetype replaced, nothing in the visual language moved.
