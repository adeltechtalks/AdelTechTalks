# `brand/` — the AdelTechTalks machine-readable export layer

**One taxonomy, three mirrors.** Figma decides, Canva produces, this folder exports, the video skill consumes.

| Layer | Owner | Editable? |
|---|---|---|
| Figma file `OD9bQi6eWexQi53tLKoctW`, modules `00–99` | Adel (design) | yes — the visual source of truth |
| `site/src/styles/tokens/*.css` | site engineering | yes — the concrete implementation the site ships; must match Figma |
| `brand/tokens/adel-v2.1.json` and everything else in this folder | **generated** by `brand/scripts/build-tokens.mjs` | **no** — regenerate |
| `.claude/skills/video-ad-editor/BRAND_SYSTEM.md` | **generated** from the export | **no** — regenerate |
| Canva brand kit and templates (Phase 2B+) | rebuilt from the export | mirrors only |

There are no two independently editable sources of truth: a value changes in Figma, is applied to the site tokens, and every downstream file is regenerated.

```
node brand/scripts/build-tokens.mjs           # regenerate
node brand/scripts/build-tokens.mjs --check   # fail if anything is stale
```

## Contents

```
tokens/adel-v2.1.json    colour (primitives · semantic light/dark · archived Edition 1), typography,
                         space, radius, stroke, sizing, elevation, motion, canvases + safe zones,
                         slot ceilings, logo geometry + roles + lockups, heart, signature slot, rules
logo/adel-mark.svg       the one A-mark master (currentColor) + graphite / signature-blue / white
heart/love-tech-heart.svg  the one I ❤ Tech heart path (from LoveTech.astro)
safe-zones/*.svg         overlays per canvas: reel-9x16 · feed-4x5 · square-1x1 · thumb-16x9
fonts/README.md          licence notes — KO Ghorab is not redistributable and is not in this folder
scripts/build-tokens.mjs the generator
```

## Guarantees the generator enforces

- Every value is looked up by its CSS custom-property name. A missing or renamed token is a hard error, so nothing is ever invented.
- The Light semantic tier is verified against what the site resolves to.
- The A-mark path in `site/public/logo/atc-mark-currentcolor.svg` and `site/src/assets/brand/adel-a-mark.svg` must be byte-identical, or the build fails.
- Dark-mode values carry their documented precedent, or `open: true`.

## Not yet wired (deferred by decision)

- The video skill's `08_safe_check.js` still hard-codes platform UI-overlay defaults (150 / 300 / 180). They are a different concept from the brand reserves here and will be read from this export once the token model is approved.
- Figma variables are not yet pulled programmatically; the site CSS is the concrete source the generator reads. A Figma → CSS sync is a later phase.
