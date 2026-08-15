---
title: 'Cut scope without cutting the point'
description: 'For the week before a deadline, when something has to go and everything feels essential.'
date: 2026-08-05
lang: en
topic: product
category: product
tags: ['product', 'scope', 'shipping']
minutes: 2
prompt: |
  I am going to miss a deadline unless I cut something. Help me cut the right
  thing rather than the easy thing.

  What I am shipping: [THE THING, IN ONE SENTENCE]
  The deadline and why it is real: [DATE, AND WHAT HAPPENS IF IT SLIPS]
  Everything currently in scope: [LIST IT ALL — INCLUDE THE SMALL ITEMS]
  The one thing this has to do to be worth shipping at all: [THE CORE PROMISE]

  For every item in scope, sort it into exactly one of:

  · LOAD-BEARING — the core promise breaks without it
  · VISIBLE — noticed if missing, but the promise still holds
  · INVISIBLE — nobody outside the team would notice this week

  Then:

  1. Give me the cut list, INVISIBLE first, with the honest cost of each cut.
  2. Name anything I have put in scope that is not serving the core promise at
     all. This is usually the real answer and it is usually something I am
     attached to.
  3. Tell me which single VISIBLE item, if cut, buys the most time for the least
     damage — and what I would tell someone who noticed it was missing.
  4. If the LOAD-BEARING set alone still does not fit the deadline, say so
     directly instead of finding something else to cut.

  Do not propose doing anything faster or in parallel. The question is what
  leaves the release, not how to work harder.
variables:
  - '[THE THING, IN ONE SENTENCE]'
  - '[DATE, AND WHAT HAPPENS IF IT SLIPS]'
  - '[LIST IT ALL — INCLUDE THE SMALL ITEMS]'
  - '[THE CORE PROMISE]'
---

## When I use it

The week before a date I do not control, once it is clear the whole list is not
going to happen. Also useful much earlier, when a scope has quietly doubled and
nobody has said so out loud.

## Why it is shaped this way

**Three buckets, not five.** Any more and everything lands in the middle one.
The forced choice between "the promise breaks" and "it holds" is what produces a
decision rather than a ranked list.

**It bans working harder.** Left open, every answer includes "parallelise this"
or "timebox that". Those are real options, but they are not this question, and
allowing them lets you avoid cutting anything.

**Point 4 is the important one.** Sometimes the honest answer is that the
irreducible core does not fit, and the decision is about the date rather than
the scope. A prompt that cannot return that answer will invent a cut instead.

## What it gets wrong

It classifies generously — things land in LOAD-BEARING that are not, especially
anything described with the word "core" in your own input. Try writing the scope
list in neutral language and the sorting improves noticeably.

It also has no idea what your team finds cheap. An item it calls a small cut may
be three days of work in your codebase, so the cut list is a proposal to price,
not an order to follow.
