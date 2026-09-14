---
name: creative-design-engine
description: Decide and produce on-brand visual directions — thumbnails, covers, carousels, video scenes — by inspecting the brief, the assets that actually exist, the story beat and the platform, then selecting a composition and creative skills. Use when asked to design a thumbnail, cover, carousel, social graphic or video scene for a brand that has a brand profile. Not a template library: it makes a fresh decision each time.
---

# Creative Design Engine

A **fixed brand system** plus **flexible creative decision making**. The brand profile says what is allowed; this engine decides what to do within it, per job.

## Before anything

Load three inputs. If one is missing, ask for it rather than guessing:

1. **Brand profile** — `templates/brand-profile.example.json` is the schema. Colours, type, spacing, watermark, safe zones, language rules, platforms, content families.
2. **Content brief** — what the piece is, its goal, platform, language, intended viewer response.
3. **Asset manifest** — what imagery exists. **Never infer an asset that is not declared.**

## The procedure

Run the five inspections in `engine/decision-framework.md`, in order:

1. **Assets first** — it is the only input that can veto the others.
2. **Hero** — the strongest visual subject among what exists.
3. **Story beat** — `engine/story-beats.md`.
4. **Platform** — `engine/platform-rules.md`.
5. **Viewer response** — the tie-breaker.

Then: filter compositions by what the assets permit (`engine/composition-strategies.md`), rank with `engine/decision-matrix.md`, pick **one primary creative skill** and at most **one supporting skill** from `skills/`, apply the brand profile, adapt to the platform.

## The output

Two or three directions. Each states:

- hero · story beat · composition strategy · primary skill · supporting skill (if any)
- **one sentence of reasoning**
- what it needs from the shoot that may be missing

Then: **what was rejected and why.** A direction without its alternatives is an assertion; with them it is a decision.

If the assets honestly support only one direction, give one and say so.

## Rules that are not negotiable

- **Never invent media availability.** If it is not in the manifest, it does not exist. Propose what is possible and name the missing asset as a dependency.
- **The brand profile wins every conflict** with a creative preference.
- **One primary skill per scene or slide**, optionally one supporting. Never three.
- **Archetypes are candidates, not a lookup table.** The same content family with different assets must produce different directions.
- **Judge at display size.** A direction is checked at feed size on a phone, not at full size.
- **Say what you cannot do.** A composition built on a placeholder is *composition-approved, media-blocked* — never "finished".

## Adding to it

`docs/HOW_TO_ADD_A_SKILL.md`. A skill that cannot state when it is *wrong* is a decoration, and the engine needs that negative space to choose.
