---
title: 'Pressure-test a product decision before you defend it'
description: 'A prompt that argues against the thing you already decided, so the first person to find the hole in it is you.'
date: 2026-08-12
lang: en
topic: product
category: product
tags: ['product', 'decisions', 'review']
minutes: 3
prompt: |
  I have made a product decision and I want it attacked before I take it to
  anyone else. Your job is to find what is wrong with it, not to help me feel
  better about it.

  The decision: [WHAT YOU DECIDED, IN ONE SENTENCE]
  The reasoning: [WHY — THE HONEST VERSION, NOT THE PRESENTABLE ONE]
  What I am optimising for: [THE METRIC OR OUTCOME THAT MATTERS]
  What I am knowingly trading away: [WHAT YOU ACCEPTED LOSING]

  Give me, in this order:

  1. The strongest version of my own argument — stronger than I made it. If you
     cannot make it stronger, say so, because that is itself a signal.
  2. The three most serious objections, ordered by how much damage they do if
     they turn out to be right. For each: the objection, what would have to be
     true for it to hold, and how I could check that this week.
  3. The failure mode nobody in the room will raise, because it makes them look
     slow or difficult to raise it.
  4. What I would need to see to reverse this decision. Be specific enough that
     I would recognise it if it happened.

  Do not soften anything in section 2 or 3. If the decision looks sound after
  all of that, say that plainly in one line at the end — but only if you mean it.
variables:
  - '[WHAT YOU DECIDED, IN ONE SENTENCE]'
  - '[WHY — THE HONEST VERSION, NOT THE PRESENTABLE ONE]'
  - '[THE METRIC OR OUTCOME THAT MATTERS]'
  - '[WHAT YOU ACCEPTED LOSING]'
---

## When I use it

After I have decided and before I have told anybody. That window is short and it
is the only point where changing my mind is free.

It also works well the day before a review, on a decision you are confident
about. Confidence is exactly when you stop looking.

## Why it is shaped this way

**It steel-mans first.** A critique that has not understood the argument is easy
to dismiss, and dismissing it feels like winning. Making the model state your
case better than you did removes that escape route before the objections land.

**It asks for the unspoken objection.** Section 3 is the one that earns the
prompt. Every team has a failure mode that everybody can see and nobody wants to
be the one to name, and a model has no career to protect.

**It defines the reversal condition.** Writing down what would change your mind
is what separates a decision from a position. It is also the part everybody
skips.

## What it gets wrong

It will generate three objections whether or not there are three. On a genuinely
sound decision, the third one is often filler — read the ordering as real and
the count as arbitrary.

It is also only as good as the honest reasoning you feed it. Give it the
presentable version of why you decided something and you will get a critique of
the presentable version, which is useless to you.
