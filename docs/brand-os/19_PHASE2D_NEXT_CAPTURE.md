# Phase 2D — capture guide for the next ASMR validation

> ## STATUS
> ### ⏸️ CREATIVE PRODUCTION VALIDATION DEFERRED
>
> Written to be used **before** the next shoot, not after it. The engine is not
> being tuned further against the previous sample.

## Why this document exists

The first real-footage test was one long continuous take. The pipeline could be
made to work against it, but it could not be **judged** against it: where the
material is inconsistent, a weak edit and a weak source are indistinguishable.
Tuning harder against that footage would have taught the system the wrong
editing behaviour and called it calibration.

So the next validation starts one step earlier — at capture.

## The shot list

Each is a **deliberate take**, not a moment hoped for inside a longer one.

| # | Shot | What the editor needs from it |
|---|---|---|
| 1 | Sealed product hero | still, sharp, product filling useful frame area |
| 2 | Packaging detail | close, deliberate, one surface at a time |
| 3 | Seal / peel | the tactile sound carried cleanly, hands steady |
| 4 | **Actual box opening** | the whole action in one clean take |
| 5 | **First reveal** | the moment the product becomes visible |
| 6 | Product removal | the lift, unhurried, product staying in frame |
| 7 | Accessories | contents shown individually, not swept past |
| 8 | Macro detail | static camera, sharp, one detail per take |
| 9 | Product handling | rotation, texture, the object being understood |
| 10 | Feature / movement | the thing this product does that others do not |
| 11 | Powered-on hero | the screen or light, framed, exposed for the display |
| 12 | Clean final hero | still, composed, the shot the edit can close on |
| 13 | *Optional* dedicated cover photo | see below — this unlocks compositions the video cannot |

### Lead-in and tail

Every important action needs **clean lead-in and tail**: roughly a second of quiet
before the first contact and a second after the sound has fully decayed. The
editor reserves 120 ms before each transient and 450 ms after it, and it will not
cut inside that reserve — if the take has no room, the edit has no room either.

### Prefer deliberate takes over one long take

A continuous take gives the selector no clean boundaries, so every beat has to be
inferred from within a single stream. Twelve deliberate takes let the story model
match a beat to a take instead of to a guess.

## Capture conditions worth holding steady

| | Why |
|---|---|
| **Record the original file** — not a messaging re-encode | the previous sample arrived at 64 kbps, which discards exactly the quiet high-frequency detail ASMR is made of |
| **Consistent framing and distance per beat** | the novelty signal reads a framing change as a new shot |
| **Stable camera for hero and macro shots** | sharpness is weighted heavily; motion blur is disqualifying |
| **Lighting consistent across takes** | a luminance jump mid-edit reads as an error |
| **No music, no narration over the takes** | the format keeps the recorded sound and adds nothing |

## The optional cover photo

The previous test could not offer a creator-led cover at all: the footage was
hands-only and there is no face detection, so every creator-dependent composition
was correctly reported **unavailable** rather than guessed.

One dedicated photograph — creator with the product, cleanly separable from the
background — unlocks the creator-led compositions in the packaging engine. Without
it the covers remain product-led, which is a valid direction but the only one.

## What happens on the next test

Treated as a **calibration session**, not a demonstration:

1. Shoot to the list above.
2. Run the pipeline unchanged — analysis, calibration, beat selection, render, package.
3. Review the output against the standard AdelTechTalks intends to publish.
4. **Teach the system from the choices that were right**, and only then adjust.

The order matters. The system does not already know the final style, and the
previous sample is explicitly not the benchmark for it.

## What is NOT being changed in the meantime

No threshold tuning against the old footage · no V2 edit redesign · no new ASMR
heuristics · no Motion Carousel · no Canva production sync · no Supabase, RLS or
Security Guardrails work · no PR merged.
