# Phase 2B — Execution report

**Scope built:** Figma `04 — Core Components` and `05 — Static Ultra Carousel`, plus one real production test carousel.
**Foundation:** Phase 2A, FINAL APPROVED at `b2ce270`. Not reopened or reinterpreted — with one exception, a genuine implementation defect found and corrected (§10.1), reported rather than absorbed.
**Reserved, untouched:** `06 — Motion Carousel`, `07 — Video System`, `08 — Social / Channel`.
**Not touched at all:** Canva, Adobe, Supabase, RLS, the Security Guardrails check, production deployment. PR #24 is not merged; Phase 2B ships as a new stacked draft PR.
**Plan of record:** `06_PHASE2B_PLAN.md`, written before any Figma change.

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
| `docs/brand-os/evidence/phase2b_*.png` | **new** — 7 screenshots |

**No token, generator or skill file changed.** Phase 2B is Figma work plus documentation; the brand export is untouched and still verifies clean.

## 12 · Open questions

1. **KO Ghorab is still the labelled placeholder.** Every Arabic display slot in this phase renders in Readex Pro. The archetypes are final in size and layout; only the family would change. Carried from Phase 2A validation item 1.
2. **The `spec-tokens` ceiling of 3** cannot express the four canvas profiles (§10.3). Review alongside the deferred body-ceiling question.
3. **Arabic cover leading** (§10.6) — confirm 112/123 is intended for three-line Arabic covers, or revisit in the same review.
4. **Media placeholders are empty frames.** The archetypes are proven with real copy but not with real photography — there is no approved product or studio imagery in the repo yet. A second pass with real images is worth doing before the first published carousel.
5. **No export pipeline yet.** The carousel is design-complete; producing final PNG/JPG slides for publishing is not part of this phase.
6. **Module 09 Web Components** still holds pre-2A website content and has not been reconciled with these components. Out of scope here.
