# Phase 2B — Implementation plan

**Written before any Figma change**, as required. The executed result is in `07_PHASE2B_REPORT.md`.
**Foundation:** Phase 2A, FINAL APPROVED at `b2ce270`. Not reopened or reinterpreted; if a genuine implementation blocker appears it is reported, not silently worked around.
**Scope:** Figma `04 — Core Components` and `05 — Static Ultra Carousel` only. `06`, `07`, `08` stay reserved. No Canva, no Adobe, no Supabase, no RLS, no security check, no deployment. PR #24 is not merged; Phase 2B ships as a new stacked draft PR.

---

## 1 · Two decisions that shape everything

**Theme is a mode, not a variant.** Every component binds its fills to `Color / Semantic`, which already carries Light and Dark modes. A slide frame sets the mode once and every nested instance follows. This is why the component count stays small: Light/Dark costs **zero** variants. A component gets a Theme variant only where the *structure* changes, which is nowhere in this set.

**Language is a variant, because it changes more than colour.** EN and AR differ in font family, alignment, line-height ratio, measure and digit handling. That cannot be a mode, so text-bearing components carry `Lang = EN | AR`. Mixed Arabic/English is not a third variant: it is the AR variant containing an isolated LTR island for the Latin term, exactly as the site's `.term` rule works.

Consequence: a component that is themeable and bilingual costs 2 variants, not 4. Nothing in this plan multiplies Theme × Lang × Density.

## 2 · Scale decision

The text components are built at the **social scale** (`cover` 112/123 · `title` 76/94 · `sub` 54/71 · `body` 36/58 · `support` 30/48 · `label` 26/32 · `spec` 34/40 · `index` 150/135), because module 05 and the later video modules are their consumers. Web-scale text belongs to `09 — Web Components`, which is out of scope. This is recorded so nobody later assumes these are UI components.

## 3 · Component inventory to build on 04

Naming follows `Family / Name`. Every fill, size, radius, gap and stroke is a bound token — no raw hex, no magic numbers.

### 3.1 Brand
The mark, lockups, heart and signature slot are **already masters on `02 — Logo & Signature`** and already flip by semantic mode. Re-mastering them on 04 would create a second source of truth for the mark, which Phase 2A forbids. So 04 gets a documented reference row of instances, plus the two genuinely new compositional pieces:

| Component | Properties | Notes |
|---|---|---|
| `Brand / Signature strip` | `Lang`, boolean `Show handle` | the micro sign-off used on every slide: mark + `@AdelTechTalks`, bound to `mark/*` and `text/secondary` |
| `Brand / End card block` | `Lang` | closing lockup + CTA line, for the Takeaway archetype |

### 3.2 Text — 8 components × `Lang = EN | AR`

`Text / Eyebrow` · `Text / Headline` · `Text / Subheadline` · `Text / Body` · `Text / Caption` · `Text / Metadata` · `Text / Quote` · `Text / Metric`

Each carries a TEXT component property for content. EN uses Montserrat display or Readex body per the approved rule (Montserrat when Latin stands alone, Readex the moment Latin sits inside Arabic). AR uses the `[Ghorab]` display styles for display roles and Readex for body, right-aligned, never letter-spaced, Western digits. `Text / Metric` is the one that always uses tabular figures.

### 3.3 Cards / surfaces — 7

`Card / Base` · `Card / Elevated` · `Card / Image` · `Card / Feature` · `Card / Metric` · `Card / Quote` · `Card / Comparison`

Radius `radius/panel` (18) as the default, not a rounder value — the design character brief rules out excessive rounding. Elevation only on `Card / Elevated`, using the `Elevation/*` styles. Fills bound to `surface/raised` / `surface/sunken` / `surface/tint`.

### 3.4 Media — 5

`Media / Image frame` · `Media / Product frame` · `Media / Screenshot frame` · `Media / Portrait frame` · `Media / Video preview`

Fixed aspect boxes with `radius/media`, a hairline border bound to `border/hairline`, and a placeholder state. Product frame keeps the product dominant with generous internal padding; screenshot frame adds a subtle device-neutral inset. No drop shadows except on the elevated card.

### 3.5 Callouts — 6

| Component | Properties |
|---|---|
| `Callout / Feature` | `Lang` |
| `Callout / Stat` | `Lang` |
| `Label / Tag` | `Lang`, `Accent = Core \| Purple \| Coral \| Magenta \| Signal` |
| `Badge` | `Lang`, `Accent = Core \| Purple \| Coral \| Magenta \| Signal` |
| `Citation / Source` | `Lang` |
| `CTA` | `Lang`, `Style = Primary \| Secondary` |

**The `Accent` property is the only controlled door to the Expressive palette.** It defaults to `Core` (Signature Blue). The four expressive options exist so an author picks one deliberately from a closed list, never a random colour. Badges and tags are exactly the surface Phase 2A named for expressive use.

### 3.6 Layout helpers — 7

`Guide / Safe area` · `Guide / Grid` · `Layout / Image-text split` · `Layout / Hero` · `Layout / Comparison` · `Layout / Quote` · `Layout / Product detail`

The guides are non-exporting overlays bound to the Feed 4:5 tokens (margin 72, reserve top 96, bottom 168, 6 columns, 24 gutter). The four layout components are auto-layout skeletons with slots, so an archetype composes them rather than hand-placing frames.

## 4 · Archetypes to build on 05

Canonical canvas **1080 × 1350 (4:5)**, the approved Static Ultra Carousel size. Ten masters:

1. Cover / Hook · 2. Big Statement · 3. Product Hero · 4. Feature Breakdown · 5. Metric / Big Number · 6. Comparison · 7. Screenshot / UI · 8. Quote · 9. Explainer · 10. Takeaway / CTA

Each is a component with:
- `Lang = EN | AR` (mixed is AR with an LTR island)
- TEXT properties for every copy slot
- a boolean where the archetype genuinely has two shapes, for example `Show media` on the Explainer to switch image-heavy against text-heavy

Light and dark come from the semantic mode set on the frame, so no archetype doubles for theme. Ten archetypes × 2 languages = **20 variants total**, not eighty.

Slot ceilings are enforced as designed, not decorative: cover headline 5 Arabic words, slide title 6, body 18, support 8.

## 5 · Real content test

**No Lorem Ipsum.** One 6-slide carousel, *Why Fold-First Content Matters*, drawn from the approved Phase 2A adaptive spec — real project content, not invented marketing.

Built **Arabic-first with English technical terms as LTR islands**, because Arabic is the brand's default social script and it exercises the harder path: RTL layout, the Ghorab placeholder, mixed-script isolation and Western digits in aspect ratios. One slide is additionally produced in English so both directions are evidenced side by side.

| Slide | Archetype | Line |
|---|---|---|
| 1 | Cover / Hook | محتواك لسه متصمّم لشكل شاشة واحد |
| 2 | Big Statement | الأجهزة القابلة للطي بتغيّر الكادر |
| 3 | Explainer | 9:16 لسه مهم. بس مش لازم يكون التكوين الوحيد |
| 4 | Feature Breakdown | المحتوى الجاهز للطي بيعيد التكوين — مش بيقصّ |
| 5 | Comparison | مصدر واحد يتأقلم مع 9:16 و 3:4 و 4:3 و 16:9 |
| 6 | Takeaway / CTA | متصمّم للشاشة اللي بتستخدمها فعلاً |

The word ceiling is observed, not bent. If real copy shows the 18-word body ceiling materially hurting readability, that is **documented as evidence** — the rule is not changed in this phase.

## 6 · Design character

Premium, modern, technology-forward, editorial, creator-led, visually confident. Concretely, in this system that means:

- **Type carries the page.** Large display type, real hierarchy, generous whitespace. The cover is one idea at 112px, not a paragraph.
- **Asymmetry over centring.** Editorial composition, off-centre focal weight, deliberate negative space.
- **Restraint in surfaces.** One radius step (`panel` 18) as default, one elevation, hairline borders. No stacked rounded cards.
- **No gradients, no noise, no decorative shapes.** Phase 2A retired gradients; nothing reintroduces them.
- **The idea or product stays dominant.** Media frames get the larger share; text supports.
- **Mint stays ≤ 3%**, expressive hues only through the `Accent` property.

Explicitly avoided: generic template look, corporate deck feel, dense text walls.

## 7 · Responsive future

Nothing here may block later adaptation to 9:16, 3:4, 4:3 and 16:9, and none of those canvases is implemented now. The rules that keep that door open:

- Layout components are **auto-layout with fill/hug**, never absolute pixel placement, so a different canvas reflows rather than breaks.
- Spacing, radius and type come from **tokens**, so a canvas change is a token change.
- Guides read the canvas tokens rather than hard-coded numbers.
- No archetype hard-codes 1080 or 1350 inside a child; only the master frame carries the canvas size.

## 8 · Evidence to produce

Component inventory · properties and variants · archetype inventory · screenshots of 04, 05 and the test carousel · token usage confirmation · Arabic RTL evidence · light/dark evidence · expressive palette examples · usability and word-ceiling findings · repo files changed · open questions.

## 9 · Known constraint carried in from Phase 2A

The `[Ghorab]` text styles still carry the labelled **Readex Pro placeholder family**, because the KO Ghorab licence terms are not stored with the project. Every Arabic display slot in Phase 2B therefore renders in the placeholder. Sizes, leading and layout are final; only the family would change when the licence is confirmed. This is a known validation item, not a Phase 2B defect.
