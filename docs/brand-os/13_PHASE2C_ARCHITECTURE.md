# Phase 2C — architecture, written before implementation

> ## ✅ STATUS: FINAL APPROVED
>
> Locked by Adel on 2026-09-14. Phase 2C is frozen: the Creative Decision Engine · the 30-skill Creative Skills Library · the 16 composition strategies · the decision matrix · the generic vs brand-specific separation · the `check-generic` enforcement · the exportable public-skill architecture · the Fold-First case study · the documentation structure.
>
> **Seven public-distribution gaps stay documented and NON-BLOCKING:** no external cold-start user test yet · no renderer yet · motion skills documented but not executed · brand-profile schema validation still needed · language coverage tested only for Arabic/English · the denylist leakage check is not exhaustive · the licence/attribution decision is still open. These close with evidence and decisions, not with further design.

**Goal:** a **fixed brand system** plus **flexible creative decision making**. The Brand OS stays canonical and unchanged; a Creative Decision Engine sits above it and decides, per job, what the hero is, what composition to use, and which creative skills to apply.
**Hard requirement:** the engine must be exportable as a reusable Claude skill for other people. AdelTechTalks must be a **reference brand profile**, never hard-coded logic.
**Not in this phase:** no Motion/Video implementation, no Canva production sync, no Phase 2A change, no Supabase/RLS/security change, no merging of existing PRs. Phase 2C ships as a new stacked draft PR.

---

## 1 · The one decision that shapes everything

**The separation between generic engine and brand profile is enforced by a build step, not by discipline.**

Two mechanisms:

1. `brand/scripts/build-tokens.mjs` **generates** `creative-design-engine/examples/adeltechtalks/brand-profile.json` from the canonical token export. AdelTechTalks' values therefore cannot drift from the Brand OS, and they live in `examples/`, never in `engine/` or `skills/`.
2. `creative-design-engine/scripts/check-generic.mjs` **fails** if any brand-specific value — a hex code, a brand font name, the string "AdelTechTalks", a project path — appears anywhere under `engine/`, `skills/`, `templates/` or the package's own docs. Exportability becomes a test that passes or fails, not a claim.

Without those two, "exportable" is an intention that rots on the first edit.

## 2 · Package layout

```
creative-design-engine/
  SKILL.md                     the skill entry point — how an agent uses the engine
  README.md                    what it is, what it is not
  QUICKSTART.md                five minutes to a first direction
  LIMITATIONS.md               what it cannot do, stated plainly

  engine/
    decision-framework.md      the five inspections and the selection procedure
    story-beats.md             10 beats, what each needs and what it must not do
    composition-strategies.md  16 strategies as options, never as templates
    platform-rules.md          platform-shaped behaviour, read from the brand profile
    decision-matrix.md         hero x beat x assets -> composition -> skills
    asset-rules.md             the never-invent-media rule and how assets are declared

  skills/                      30 creative skills, one file each, one schema
  templates/                   brand-profile / content-brief / asset-manifest examples
  examples/
    adeltechtalks/             GENERATED brand profile + the Fold-First case study
    fold-first/  thumbnail/  carousel/
  docs/
    HOW_TO_USE.md
    HOW_TO_BUILD_YOUR_BRAND_PROFILE.md
    HOW_TO_ADD_A_SKILL.md
    COURSE_NOTES.md            reasoning preserved so the course needs no archaeology
  scripts/
    check-generic.mjs          the exportability test
```

## 3 · The engine contract

Three inputs, one output.

**In:** a `content-brief` (what the piece is, the goal, the platform, the language), an `asset-manifest` (what imagery actually exists — declared, never assumed), and a `brand-profile` (colours, type, spacing, watermark, safe zones, language rules, platform profiles, content families).

**Out:** two or three **directions**, each naming its hero, story beat, composition strategy, one primary creative skill and at most one supporting skill — plus a short reason, and an explicit note on what was rejected and why.

The five inspections run in a fixed order, because each narrows the next:

1. **Assets** — what exists. This runs *first*, not fourth, because it is the only input that can veto everything else. An archetype you have no imagery for is not a candidate.
2. **Hero** — the strongest visual subject among what exists.
3. **Story beat** — what this piece is doing: hook, reveal, comparison, curiosity, proof, transformation, explanation, joke, demonstration, CTA.
4. **Platform** — canvas, safe zones and what survives the platform's own crop.
5. **Viewer response** — curious, surprised, informed, amused, impressed, challenged. This breaks ties between compositions that are otherwise equal.

## 4 · What the engine must never do

- **Invent media availability.** If the manifest says there is no product photograph, no direction may assume one. The engine says so and proposes what is possible instead.
- **Treat Phase 2B archetypes as fixed templates.** The ten thumbnail archetypes and ten carousel archetypes are *candidates the engine may select*, not a lookup table from content type to layout.
- **Produce one permanent composition per content type.** Two runs of the same content family with different assets should produce different directions. If they do not, the engine is a template library wearing a costume.
- **Stack effects.** One primary creative skill per scene or slide, optionally one supporting skill. Never three.

## 5 · Skill file schema

Every one of the 30 skills documents the same sixteen fields: name · purpose · best story beats · best content types · static/motion/both · required assets · optional assets · when to use · **when not to use** · composition logic · motion logic · Brand OS rules · platform considerations · Arabic/English considerations · example · anti-patterns · maximum combinations.

`when not to use` and `anti-patterns` are not filler. A skill that cannot say when it is wrong is a decoration, and the engine needs the negative space to choose between candidates.

## 6 · Motion skills: documented, not implemented

Roughly half the library is motion or both. Phase 2C **documents** their motion logic and stops. No renderer, template or video-engine file changes, and the phase stops for approval before any Motion/Video implementation begins.

## 7 · Deliverables

Engine structure · skills inventory · decision matrix · composition inventory · the Fold-First case study · the generic/brand separation and its test · the public export structure · example user commands · documentation inventory · the remaining gaps before public distribution.
