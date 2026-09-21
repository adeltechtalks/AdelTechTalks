# AdelTechTalks Creative System — Production Contract

## Authority
Figma is the visual source of truth. This skill consumes a synced snapshot of the brand system and approved exported assets. Canva is for fast editable social variants. Adobe can create/refresh motion assets. The video skill remains the production engine that assembles finished edits.

## Brand snapshot
The bootstrap snapshot lives at `brand/adeltechtalks.bootstrap.json`. It contains only known core tokens and proposed typography. Before locking the system, sync the current Figma variables/components into a final `brand/adeltechtalks.json`.

## Non-negotiables
- Never invent a new brand color when an approved token exists.
- Never stretch, redraw, or recolor the logo/signature outside approved variants.
- Arabic layouts are RTL-first; English may live inside the composition without breaking RTL hierarchy.
- Keep product photography/video visually dominant.
- ASMR defaults to no music and no captions.
- Motion should feel precise and premium, not template-heavy.
- Use only cut/match-cut by default for ASMR.
- Brand opener/endcard are micro moments, not long intros.

## Asset flow
Figma/Adobe → approved exports in `assets/` → skill applies them automatically → final MP4.

## Format relationship
The brand system is shared; the edit behavior is not.
- Talking Head: captions + semantic motion are allowed and often useful.
- ASMR: recorded tactile audio is preserved; no default captions/music.
- Motion Carousel: each slide is an independent short motion asset, normally ~5 seconds, with one idea per slide.
- Comparison: visual evidence and clear A/B labeling take priority over decorative motion.
- Product Demo: show real use/proof first, then explain.
