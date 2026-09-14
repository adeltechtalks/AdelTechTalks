# Decision framework

The engine runs five inspections in a fixed order, then proposes directions. The order matters: each inspection narrows the next, and the first one can veto everything.

---

## 0 · The contract

**In:** a content brief, an asset manifest, a brand profile.
**Out:** two or three directions. Each names a hero, a story beat, a composition strategy, one primary creative skill, at most one supporting skill, and a one-sentence reason. Plus what was rejected and why.

If only one direction is honestly available — usually because the assets allow only one — say so and give one. Padding the list with weak alternatives wastes the reader's judgement.

## 1 · Assets (first, because it can veto)

Read the asset manifest. **Never infer that an asset exists.** No manifest entry, no asset.

| Declared | Consequence |
|---|---|
| portrait | face-led compositions become candidates |
| one product frame | product-dominant becomes a candidate; comparison does not |
| two or more product frames | comparison and before/after become candidates **only if** framing, scale and lighting match |
| transparent cutout | collage, exploded view, floating composition become candidates |
| screenshot / UI | screen-dominant, floating UI, screen-within-screen become candidates |
| video frame | treat as a still with a quality penalty; never assume a frame can be extracted unless the manifest says so |
| environment / B-roll | usable as ground, depth or blur; rarely a hero |
| nothing usable | type-led directions only — say this plainly rather than proposing a layout that cannot be built |

**Two frames of the same subject are not automatically a comparison.** Mismatched scale, angle or lighting makes a comparison dishonest before a word is read. If they do not match, comparison is off the table.

## 2 · Hero

Pick the strongest visual subject **among what exists**: creator/face · product · product A vs product B · screenshot/UI · screen · before/after · transformation · number/metric · idea/concept.

Two rules:

- The hero is what the viewer should look at first, not what the piece is about. A video about a software release whose only asset is a good portrait has a **face** hero and a software subject.
- An idea/concept hero is legitimate, and it is the honest answer when the assets are thin. It leads to type-led work, not to a weak photo stretched to fill a frame.

## 3 · Story beat

What is this piece *doing*: **hook · reveal · comparison · curiosity · proof · transformation · explanation · joke · demonstration · CTA.** Defined in `story-beats.md`.

A piece has one primary beat. Where a second is present it is supporting, and it does not get its own creative skill.

## 4 · Platform

Read the platform profile from the brand profile: canvas, margins, reserves, and — critically — **what the platform's own crop does**. A surface that previews square judges the centre square, not the frame. A surface with a chrome band loses that band.

Vertical is **recomposed**, never a centre-crop of the horizontal master.

## 5 · Viewer response

curious · surprised · informed · amused · impressed · challenged.

This is the tie-breaker, not the starting point. When two compositions are equally supported by the assets, the intended response chooses between them: a comparison that should make the viewer *curious* gets a question and a withheld answer; the same comparison aiming to *inform* gets both sides labelled.

## 6 · Selection

1. List compositions the assets permit (`composition-strategies.md`).
2. Cut any whose media requirement the manifest cannot meet.
3. Rank the survivors by fit with hero + beat (`decision-matrix.md`).
4. For each of the top two or three, choose **one primary creative skill** and at most **one supporting skill** (`skills/`).
5. Apply the brand profile. It is not negotiable and it is not a creative choice.
6. Adapt to the platform.
7. Write the reason, and the rejections.

## 7 · Rules that override preference

- **One primary skill per scene or slide, optionally one supporting.** Never three. Effect stacking is the most common failure in generated design.
- **The brand profile wins every conflict** with a creative preference. If a skill wants a gradient and the profile retires gradients, the skill loses.
- **Composition strategies and archetypes are options, not templates.** The same content family with different assets must produce different work.
- **Say what was rejected.** A direction without its alternatives is an assertion; with them it is a decision.
