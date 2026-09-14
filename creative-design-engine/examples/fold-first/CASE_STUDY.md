# Case study — Fold-First content

**The first formal run of the Creative Decision Engine.** Real brief, real asset manifest, real decisions — including the ones that were rejected and the one that is still blocked.

Brand profile: `../adeltechtalks/brand-profile.json` (generated from the brand's token export).

---

## 1 · The brief

| | |
|---|---|
| Subject | Content designed for one screen shape no longer matches the screens people use |
| Content family | explainer |
| Goal | make a viewer who has never thought about aspect ratio care about it |
| Viewer response | **curious** — not informed; being told the fact does not create the want |
| Platform | YouTube 16:9 master, recomposed to 9:16 |
| Language | Arabic-first, established technical terms in Latin |
| Deliverables | thumbnail set, one vertical cover |

## 2 · Assets — inspected first, because they veto

| Declared | Quality | Consequence |
|---|---|---|
| Creator portrait, studio, close, mixed practical lighting | production | face-led compositions available |
| Environment (the same studio frame, usable blurred) | production | depth and ground available |
| **Foldable device imagery** | **absent** | device-dominant available only as a pending slot |
| Product cutouts | absent | collage, exploded view unavailable |
| Screenshots / UI | absent | screen-dominant unavailable |

**One asset drove everything: there is no device photography.** Every direction below is shaped by that, and no direction pretends otherwise.

## 3 · Hero

**The creator**, for two of three directions — because the portrait is the only production-quality subject that exists.

The third direction takes **transformation** as its hero, which turned out to be the important move: it is the only hero available that needs *no* asset the brand does not have, because the transformation can be performed on the portrait itself.

## 4 · Beat per scene

| Scene | Beat | Why |
|---|---|---|
| A | curiosity | poses the format problem as a question |
| B | transformation | performs the crop loss rather than describing it |
| C | reveal | the device is the payoff — and the one that is blocked |

## 5 · The decisions

### Direction A — Face + pending device · `/product-hero` (no supporting skill)

Hero: creator. Composition: Face Dominant with a device slot. The portrait runs nearly full height and bleeds off the bottom; the hook sits on the darkest region; contrast is a **global grade**, not a panel.

**No supporting skill, deliberately.** `/sketch-overlay` was the obvious candidate and was **cut**: the only thing left to annotate was the pending device slot, and *an annotation must identify something real*. A circle around an empty slot is the failure mode the skill itself warns about.

### Direction B — Transformation · `/before-after-morph` (static form: the crop boundary made visible)

Hero: transformation. The real photograph runs full-bleed, the narrow crop region is outlined, everything outside it is graded back, and two drawn marks point outward at what a vertical crop throws away.

**This is the only fully finished direction, and the strongest.** It needs no asset the brand lacks, because the argument is about cropping and can be made *on the asset that exists*. The idea reads before the text does.

### Direction C — Device dominant · `/product-hero` (blocked)

Hero: device. The environment is blurred behind a dominant device slot, so depth is real and the composition is judgeable — but the slot is dashed and labelled, not a grey box dressed as a product.

**Composition-approved, media-blocked.**

## 6 · What was rejected, and why

| Rejected | Why |
|---|---|
| `/split-compare` between two devices | needs two matched device frames; neither exists |
| `/exploded-view` of a device | needs component frames; none exist |
| `/floating-ui` | needs a screenshot; none exists |
| `/cutout-collage` | needs cutouts; background removal is a production step, not an assumption |
| `/device-morph` (motion) | correct for this story, but motion is not in scope and it needs the same absent device imagery |
| `/sketch-overlay` on A and C | nothing real left to point at once the device is a pending slot |
| Minimal Premium | the response is curiosity, not admiration |
| A fabricated device render | would have made two directions *look* finished while proving nothing |

## 7 · What the run taught the system

1. **A hero that needs no missing asset beats a better hero that does.** Direction B outranks A and C not because transformation is a superior hero, but because it is the only one the brand can finish today. The engine now weights *buildability* before *quality of idea*.
2. **The annotation rule has teeth.** It removed two annotations from directions that would have looked more finished with them.
3. **"Composition-approved, media-blocked" is a real, useful state** — and it names the purchase order: one device photograph unblocks two directions.
4. **The sketch face had no glyphs for the primary language.** Caught here, now a declared field in the profile schema.

## 8 · Recommendation

Lead with **B**. A/B it against **A**, which is the safest at small sizes and least dependent on reading the primary language. **C** waits on one photograph.
