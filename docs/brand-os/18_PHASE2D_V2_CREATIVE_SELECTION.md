# Phase 2D V2 — creative selection layer

> ## STATUS — PHASE 2D · CLOSED 14 Sep 2026
> ### ✅ TECHNICAL FOUNDATION VALIDATED
> ### ⏸️ CREATIVE PRODUCTION VALIDATION DEFERRED
>
> **The ASMR format is NOT production-proven.** The creative output of this experiment
> was reviewed and **not approved as production-ready**.
>
> The reason is not only the system. The real-footage test material was not strong enough
> to fairly judge or calibrate a final creative standard, and tuning an engine against weak
> or inconsistent source risks teaching it the wrong editing behaviour. **That footage is
> now a learning sample, not the production benchmark.**
>
> Iteration on this experiment is **stopped**. The architecture below is kept as built and
> is not being redesigned or expanded. The next validation runs on deliberately shot
> material — see `19_PHASE2D_NEXT_CAPTURE.md`.

**Not touched:** Brand OS architecture, tokens, Supabase, RLS, Security Guardrails, Canva, Adobe, deployment. Motion Carousel not started.

## What was wrong

V1 ranked candidates on tactile transient density alone. On a real unboxing that
selected 30 seconds of packaging — sleeve, tray, leaflet — and never reached the
device. Crinkling card is acoustically sharper and denser than a smooth hinge.

**A strong transient is not a strong shot.**

## What changed

### 1. Seven signals, not one

`25_story_plan.py` scores every candidate window on:

| Dimension | Weight | Source |
|---|---:|---|
| narrative importance | 0.26 | beat priority × signature fit |
| visual quality | 0.14 | edge-energy sharpness — blur is disqualifying |
| product visibility | 0.14 | centre structure vs frame (proxy, not detection) |
| action clarity | 0.12 | motion in a usable band — neither frozen nor smeared |
| novelty vs previous | 0.10 | dHash distance |
| tactile / audio value | 0.14 | transient density |
| hero potential | 0.10 | sharp + centred + still |

Audio is now **one input among seven**. A loud clip with a weak visual loses.

### 2. A story model

Nine semantic beats. Each candidate is scored against every beat signature, and the
sequence is assembled from the beats the footage **actually contains**. Beats that are
not present are left out — a weak beat is never added to complete the list.

`box_opening` and `first_reveal` are **reserved**: they carry a selection bonus so they
cannot be displaced by louder packaging.

### 3. Visual analysis

`24_visual_analyze.py` measures what the microphone cannot, with no ML and no model
downloads — ffmpeg frames plus pure Python:

sharpness (blur) · motion (action, stillness) · skin fraction (hand present) ·
centre mass (subject prominence) · luminance (screen-on, reveal) · dHash (duplicates).

`subject_mass` is an honest **proxy** for "product occupies useful frame area", not
object detection: it measures centre structure against the whole frame. A centred box
scores high; so would a centred hand. It is one weighted signal, never a gate.

### 4. Selection is a DP, not a greedy pass

An unboxing is chronological — the seal cannot be peeled after the box is open. Beat
order and time order must agree, and two beats cannot occupy the same seconds. Greedy
selection satisfied neither: it put seal/peel at 104 s ahead of the opening at 90 s, and
let both reserved beats land on the same window.

Selection is now a DP over time-sorted candidates that extends a sequence only with a
candidate starting after the previous ends **and** belonging to a later beat. A
reconciliation pass then fixes what reserve-snapping can reintroduce (overlap, budget
overrun), and a beat shorter than 1.6 s is dropped rather than kept as a sliver.

### 5. Brand cards

The corner watermark alone read as unbranded; a title-heavy Reel is the other failure.
Two short cards, nothing during the edit:

- **opener 0.8 s** — content-family label, product name, mark. Fade plus a 14 px rise.
- **endcard 1.0 s** — a held frame from the final hero beat, darkened and blurred, mark and creator name over it.

Colours come from `brand_profile.color()`; no hex is written into a filtergraph.

**TYPEFACE CAVEAT:** Montserrat is the approved display face and is **not installed in
this environment**, so the cards render in DejaVu Sans Bold. That substitution is printed
in the render audit. These cards are structurally correct and typographically provisional.

### 6. Content brief

`templates/brief.example.json` → `<workdir>/brief.json`:
`product_name` · `product_model` · `content_family` · `optional_hook` · `optional_creator_name`.

## Result on the test footage

| | v1 | v2 |
|---|---|---|
| selector | transient density | seven signals + story model |
| segments | 6 windows, one region | **7 beats, story-ordered** |
| coverage | 30.8–109.4 s (packaging only) | **73.8–203.2 s (whole arc)** |
| device reveal | **absent** | **present** — lift, unfold, screen-on |
| branding | watermark only | opener + watermark + endcard |

Beats selected: sealed hero · seal/peel · **box opening** · **first reveal** ·
accessories · handling · final hero. `product_lift` and `macro_detail` were absent from a
chronologically consistent sequence and were left out rather than forced in.

Output: **1080×1920 H.264 High / yuv420p, 29.03 s**, delivery gate passed.

## Honest limits

- `subject_mass` and `hand` are heuristics, not detection. They will mis-score a centred
  hand as a centred product.
- Beat signatures are hand-authored percentile bands, validated on **one** clip — and that
  clip is now a learning sample, not a benchmark.
- No metric here proves the cut lands well inside a gesture. Listening is still the test.

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
