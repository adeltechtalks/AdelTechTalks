# Course notes — "Build Your Brand OS with AI"

**Not the course.** Raw material for it, captured while the work was fresh so that writing the course later does not require reverse-engineering the project history.

Structured as: what was built · why each decision went the way it did · the prompts that worked · the mistakes, which are the most teachable part · the limitations · before/after · how someone reproduces it.

---

## 1 · What was built, in order

| Phase | Output | The lesson it carries |
|---|---|---|
| 1 | Audit of an existing, inconsistent brand | You cannot design a system for a brand you have not inventoried. The audit found two competing editions running simultaneously. |
| 2A | Locked foundations — colour, type, logo, dark mode, safe zones, adaptive video profiles, a machine-readable export | Foundations must be **locked and dated** before anything is built on them, or every later decision reopens them. |
| 2B | Components, carousel archetypes, a watermark rule, a thumbnail system | Components are cheap; the expensive part is deciding what *not* to build. |
| 2C | A decision engine and a creative skills library | A fixed system plus flexible decisions beats a template library — templates produce the same output forever. |

## 2 · The decisions worth teaching

**Theme is a mode, not a variant.** The single decision that kept the component count small. Light/dark cost zero variants; language costs one because family, alignment, leading, measure and digits change together. Teaching point: *find the axis that changes structure and the axis that changes only values — they are not the same kind of thing.*

**Everything generated from one source.** Tokens are extracted from the live stylesheet by name; a missing name is a hard error, so nothing can be invented. Every downstream artefact — documentation, overlays, the engine's brand profile — is generated from it. Teaching point: *two hand-maintained sources of truth drift within weeks.*

**Provenance on every number.** Values are marked audited or derived-and-validation-required. Teaching point: *a confidently-stated invented dimension is worse than an admitted gap, because nobody checks it later.*

**Never fabricate media.** No generated faces, no invented product renders. A missing asset is declared as a dependency and the composition stays final. Teaching point: *"looks finished" and "is finished" are different states, and conflating them is how design systems lie.*

**Exportability enforced by a test.** The engine's generic tree is checked for brand values by a script that fails the build. Teaching point: *an architectural intention that is not tested is an architectural intention that rots.*

## 3 · Prompts that actually worked

The instructions that changed the work most were not the long ones. They were:

- *"Show intent before making changes."* Produced a written plan before every build phase, which made later review possible.
- *"This must work at feed size on mobile, not full-size on a canvas."* Reframed the entire thumbnail system; the first version was legible and useless.
- *"Do not make it feel like a presentation card."* The most productive correction in the project.
- *"An annotation must point at something real."* Turned a decorative feature into a rule with teeth — it later deleted two annotations that would have looked better.
- *"Do not turn that finding into a universal rule."* Caught over-generalisation from a single measurement.
- *"Use a real photo if one exists; otherwise label the placeholder."* Forced the honesty that the rest of the system now depends on.

Pattern: **the useful prompts constrain, and name a failure mode.** "Make it premium" changed nothing. "It must not feel like a branded card" changed everything.

## 4 · Mistakes — the teachable core

1. **Optimising for the wrong viewing size.** The first thumbnail pass was judged at full size and was beautiful. At feed size it said nothing. *Fix: judge where the work is seen.*
2. **Annotation as decoration.** Circles placed to demonstrate that circles existed, pointing at empty space. *Fix: a rule that an annotation must identify something real — which then deleted annotations from work that looked better with them.*
3. **Over-generalising one measurement.** A type-fitting constraint measured in one style was written as a universal law. *Fix: scope findings to the conditions they were measured under.*
4. **A silent font fallback.** Handwritten notes in a script the face did not cover fell back silently; the annotation stopped being handwriting and nobody noticed for two rounds. *Fix: declare script coverage, verify once with real copy.*
5. **Building on an invisible defect.** An imported logo carried an opaque wrapper that was invisible on light grounds and wrong on dark. Found only when something was finally placed on dark. *Fix: test both grounds at the moment of import, not at the moment of use.*
6. **Assuming the tool did what was asked.** Bound-variable paints silently dropped their opacity; contrast grades rendered fully opaque and hid the photograph entirely. *Fix: screenshot after every visual change — the return value said success.*
7. **Confusing "the account has Canva files" with "Canva has patterns to teach."** The reference study found no thumbnails at all, and the one substantive file was two editions out of date. *Fix: inspect before concluding; report what was actually found.*

## 5 · Limitations to state honestly in any course

The engine does not render. It cannot judge photographic quality. Motion is specified but unimplemented. Its taste is a set of rules, not taste. It cannot verify a claim, and it will happily design a beautiful cover for a piece that should not be made.

## 6 · Before / after material available

- Thumbnail system, first pass vs corrected — branded cards vs feed-native
- Fold-First directions before and after the visual-competitiveness pass
- A carousel slide before and after word-ceiling enforcement
- The logo on a dark ground, before and after the wrapper fix
- A desk-object thumbnail across three directions from one photograph

## 7 · How someone reproduces the workflow

1. **Audit** what exists. Do not design until the inventory is complete.
2. **Extract tokens** from the live implementation, by name, failing hard on anything missing.
3. **Lock foundations** and date them. Refuse to reopen them without a stated blocker.
4. **Generate everything downstream.** Documentation, overlays, profiles — never hand-maintained.
5. **Build components** only where a real piece of content needs them.
6. **Test with real content** in the real language, at the real display size.
7. **Write the decision layer last**, once you know which decisions actually recur.
8. **Make the separation testable** if you ever want to hand the system to someone else.

The order matters. Most attempts start at step 5.
