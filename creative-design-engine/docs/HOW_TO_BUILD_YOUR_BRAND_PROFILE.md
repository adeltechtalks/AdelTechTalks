# How to build your brand profile

The profile is the fixed half of the system. The engine trusts it completely, so a wrong value is worse than a missing one.

---

## Start smaller than you think

The minimum that works:

- one primary colour, one ink, three surfaces
- a display face and a text face
- **an annotation colour that is neither your primary nor an action colour**
- one platform: canvas, margin, reserves
- language rules and a digit convention

Everything else can be added when a real job needs it.

## The fields people get wrong

**`colour.annotation`** — must be distinct from your primary and from any action colour. If an annotation is your brand colour, viewers read it as interface. This single field prevents a whole class of confusion.

**`typography.sketch.scripts`** — the scripts your handwriting face *actually covers*. Most script faces are Latin-only. Declaring a script it does not cover produces handwriting that silently falls back to something else, and the annotation stops being handwriting without anyone noticing. Verify once with real copy.

**`platforms[].provenance`** — `audited` or `derived`. Mark anything you did not measure as derived. A confidently-stated invented dimension is worse than an admitted gap, because nobody checks it later.

**`composition.subjectScale`** — a range, not a value. This is what stops every output looking identical.

**`archetypes`** — optional, and dangerous. If you list named layouts, the engine treats them as *candidate instances of composition strategies*, never as a lookup from content type to layout. The moment a content type always maps to the same archetype, you have a template library again.

## Generate it, do not maintain it

If your brand already has a machine-readable token export, **generate the profile from it** in your build. Two hand-maintained sources of truth drift within weeks; a generated profile cannot.

Put the generated profile under `examples/<brand>/` — never in `engine/`, `skills/` or `templates/`. Then run:

```
node scripts/check-generic.mjs
```

It fails if brand values leak into the generic tree.

## Tone

`brand.tone` is three adjectives, and they should be *falsifiable*. "Premium, modern, innovative" describes almost every brand and therefore constrains nothing. "Calm, precise, unfussy" rules things out — which is the only thing a tone statement can usefully do.

## Testing it

Run two different briefs with different manifests through the profile. If you get near-identical compositions, the profile is over-specified: it is prescribing layout where it should prescribe values. Loosen it until the same brand produces genuinely different work for genuinely different jobs.
