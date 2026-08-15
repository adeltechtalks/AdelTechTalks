---
title: 'Get oriented in a codebase you have never seen'
description: 'What I run on day one in unfamiliar code, to get a map instead of a summary.'
date: 2026-08-08
lang: en
topic: building
category: research
tags: ['code', 'onboarding', 'research']
minutes: 3
prompt: |
  I need to get oriented in this codebase quickly. I am not looking for a
  summary of what it does — I need a map I can act on.

  What I am trying to do in it: [THE CHANGE OR TASK YOU ACTUALLY HAVE]
  My level with this stack: [E.G. "FLUENT IN TYPESCRIPT, NEW TO THIS FRAMEWORK"]

  Answer in this order, and cite the file path for every claim you make:

  1. The entry points. Where does execution actually start, for each way this
     thing can be run?
  2. The three or four files that hold the real logic. Not the biggest files —
     the ones where changing something changes behaviour everywhere else.
  3. The seams. Where is the boundary between layers, and what crosses it?
  4. The path my specific task will touch, in order, from entry point to the
     line I will probably be editing.
  5. Two things that would surprise someone reading this for the first time —
     a convention that is not obvious, or a place where the code does the
     opposite of what its name suggests.

  If you cannot verify something from the files, say "not verified from the
  code" rather than inferring it from the naming. A confident wrong map costs
  me more than no map.
variables:
  - '[THE CHANGE OR TASK YOU ACTUALLY HAVE]'
  - '[E.G. "FLUENT IN TYPESCRIPT, NEW TO THIS FRAMEWORK"]'
---

## When I use it

First hour in a repository I did not write, when there is a real task attached.
Without the task in the prompt you get a README in prose form. With it, you get
a route through the code.

## Why it is shaped this way

**It asks for a map, not a summary.** A summary tells you what the project is,
which you already know. A map tells you where to go, which is the thing you are
missing.

**It demands file paths.** This is the single highest-value line in the prompt.
Citations are checkable, and a claim that has to name a file is much harder to
hallucinate than a claim that floats.

**It asks for the surprising thing.** Point 5 catches the conventions that are
obvious to everyone who already works there and invisible in the code — the ones
that cost a newcomer an afternoon.

**It gives an out.** "Not verified from the code" is offered explicitly, because
otherwise the gap gets filled with a plausible guess and you cannot tell which
parts of the map are real.

## What it gets wrong

Point 2 skews toward large files. Size and importance are correlated but not the
same, and the file that decides everything is often small. Read that section as
a starting set, then check what imports what.

It also struggles with codebases where the interesting behaviour lives in
configuration or in generated code rather than in the source. When the answer
looks thin, that is usually why.
