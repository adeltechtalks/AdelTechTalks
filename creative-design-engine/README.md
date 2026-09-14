# Creative Design Engine

**A fixed brand system plus flexible creative decision making.**

Most "brand systems" for AI end as template libraries: content type in, same layout out. This is the opposite. The brand profile is fixed and non-negotiable. Everything above it — hero, composition, creative treatment — is decided per job from the brief, the assets that actually exist, the story beat and the platform.

## What it is

- A **decision framework** — five inspections, in an order where the first can veto the rest.
- A **library of 30 creative skills**, each documenting not just what it does but **when it is wrong**.
- A **composition vocabulary** of 16 strategies, selected from rather than filled in.
- A **brand profile schema** so the same engine serves any brand.

## What it is not

- Not a template library.
- Not a renderer. It decides and specifies; something else executes.
- Not a replacement for judgement. It makes the reasoning explicit so a human can disagree with it.

## Layout

```
SKILL.md          how an agent uses it          engine/    the decision framework
QUICKSTART.md     five minutes to a direction   skills/    30 creative skills
LIMITATIONS.md    what it cannot do             templates/ brand profile, brief, manifest
docs/             guides and course notes       examples/  worked case studies
scripts/          the exportability test
```

## The separation, and why it is enforced

`engine/`, `skills/` and `templates/` contain **no brand-specific values**. Any brand's configuration lives in its own profile.

This is checked, not promised:

```
node scripts/check-generic.mjs
```

It fails if a brand name, hex value, font name or project path appears anywhere in the generic tree. Without that test, "exportable" is an intention that rots on the first edit.

## Start here

`QUICKSTART.md`, then `docs/HOW_TO_BUILD_YOUR_BRAND_PROFILE.md`.
