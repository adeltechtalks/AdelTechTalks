
---

# Content package

The output is no longer one video. `27_package.py` reads the same plan the edit
came from and packages the content for each surface.

## The cover uses the edit's understanding

Candidate frames are the **middle of every selected beat** — not the first frame,
not a random grab. Each is scored on clarity · product visibility · story
relevance · curiosity · text-space · separation, and text is placed in the band
with the least edge energy, measured per frame, so type never lands on the busiest
part of the image.

## Composition is decided, not templated

Three directions were generated for this content:

| | Direction | Basis |
|---|---|---|
| A | Product hero | strongest frame, panel names the product |
| B | Curiosity — reveal withheld | **recommended**; hook asks what the frame withholds |
| C | Bold concept — typography led | for feeds where the product reads small |

Compositions needing the creator — creator only, creator + product, reaction —
were **not selected, because they are unavailable**: this script has no face
detection and the footage is hands-only. The rationale says so and recommends a
dedicated thumbnail photograph rather than guessing. A/B comparison and
before/after were rejected for a real reason too: one device, one state.

## Surfaces are recomposed, not cropped

Blur-padding a portrait frame into 16:9 leaves a narrow strip between two grey
panels — the subject reads tiny and the layout is a fallback, not a design. So
each aspect gets its own composition:

| Surface | Size | Provenance | Layout |
|---|---|---|---|
| `youtube-thumbnail` | 1280×720 | AUDITED | asymmetric — subject holds the right 56%, type panel left |
| `shorts-cover` | 1080×1920 | AUDITED | full bleed, type in the quiet band |
| `reels-cover` / `tiktok-cover` | 1080×1920 | DERIVED — shares the 9:16 master | full bleed |
| `feed-4x5` | 1080×1350 | DERIVED — VALIDATION REQUIRED | reframed within the portrait frame |
| `square-1x1` | 1080×1080 | DERIVED — VALIDATION REQUIRED | reframed within the portrait frame |

No platform size is invented as audited — the Phase 2B rule, unchanged.

Hook type is fitted to the panel width rather than a fixed scale, after the first
pass ran "WORTH IT?" out of the panel and under the subject.

## Fixed language, variable layout

`creative-design-engine/engine/visual-language.md` states the principle: a channel
is recognised by its **treatment**, not its **layout**.

| Fixed | Varies |
|---|---|
| mark — same corner, same scale ratio | which beat becomes the hero |
| accent label, coral rule | whether there is a hook at all |
| hook in caps with a dark border | scrim depth, text band, type scale |
| type placed in the quietest band | the composition itself |

> If two pieces differ only in their photograph, the layout has become the
> identity. If two pieces share no treatment, there is no channel.

## New skill — `/creator-floating-ui-ecosystem`

Skill 31 in the exportable library. A person anchors the frame while real UI
cards carry the substance — for software, AI tools, apps, workflows and technical
explainers. Documented with all sixteen fields, including the two that carry the
weight: **when NOT to use it** (a physical product that could carry the frame; no
separable creator asset; fewer than two cards with real meaning) and its
**anti-patterns** (decorative panels with invented labels, cards over the face,
glow as style rather than depth).

**It is explicitly not the default.** The brand-neutral check still passes at 48
files — nothing brand-specific entered the exportable tree.
