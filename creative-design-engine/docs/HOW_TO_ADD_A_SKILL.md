# How to add a skill

---

## Does it deserve to exist?

A creative skill is a **repeatable compositional move with a clear failure mode**. Before adding one:

- Can you say precisely **when it is wrong**? If not, it is a style, not a skill.
- Is it distinct from the existing thirty? Two skills differing only in taste should be one skill with a note.
- Does it serve a story beat? A move that serves no beat is decoration.

The bar is deliberately high. A library of a hundred skills is a library nobody selects from.

## The schema

Copy any file in `skills/`. Sixteen fields, all required:

name · purpose · best story beats · best content types · static/motion/both · required assets · optional assets · **when to use** · **when NOT to use** · composition logic · motion logic · Brand OS rules · platform considerations · Arabic/English considerations · example · anti-patterns · maximum combinations

## The two that carry the weight

**When NOT to use it** and **anti-patterns** are why the engine can choose. A candidate list where every option says "use me" is a list the engine must guess from. Write these first — if they are hard to write, that is the answer about whether the skill should exist.

## Keep it brand-neutral

Refer to values as *"from the profile"* — never name a colour, a face or a size. `node scripts/check-generic.mjs` enforces this.

Wrong: *"the annotation is Spark Coral"*.
Right: *"the annotation uses the profile's annotation colour, which must not be its primary or action colour."*

## Required assets are a contract

The engine removes a skill from consideration when the manifest cannot meet its `required` list. Be exact. "A product frame" and "a product frame with enough resolution to bleed off an edge" filter very differently, and the second one is the honest requirement.

## Wire it in

Add it to the relevant rows of `engine/decision-matrix.md`. A skill the matrix never reaches will never be selected.

## Motion skills

Document the motion logic fully even where no renderer exists. The specification is the deliverable; an editor can execute from it. Say plainly if it has never been produced.
