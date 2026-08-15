---
title: 'Turn a vague idea into something buildable'
description: 'The prompt I run before any Vibe Coding session, so the first thing I build is the right thing rather than the fastest thing.'
date: 2026-08-15
lang: en
topic: building
category: building
series: vibe-coding
part: 2
tags: ['vibe coding', 'spec', 'planning']
minutes: 3
prompt: |
  You are helping me turn a rough product idea into a spec I can build from
  today. Do not write any code yet.

  The idea: [DESCRIBE THE IDEA IN TWO OR THREE SENTENCES]
  The person it is for: [WHO, SPECIFICALLY — NOT "USERS"]
  What has to be true for it to be worth building: [YOUR ONE SUCCESS CONDITION]

  Work through this in order and stop at the end of each section so I can
  correct you before you build on top of a wrong assumption.

  1. Play the idea back to me in your own words, in under 80 words. If any part
     of it is ambiguous, say which part and give me the two readings.
  2. List the assumptions you would have to make to build it. Mark each one
     CHEAP TO TEST or EXPENSIVE TO BE WRONG ABOUT.
  3. Propose the smallest version that would genuinely answer my success
     condition. Not an MVP in the abstract — name the screens, the data it
     stores, and what it deliberately does not do.
  4. Tell me what you would build first and why that order, in one paragraph.
  5. Name the one thing most likely to make this harder than it looks.

  Be blunt in step 5. If you think the idea does not clear its own success
  condition, say so there and explain why rather than building it anyway.
variables:
  - '[DESCRIBE THE IDEA IN TWO OR THREE SENTENCES]'
  - '[WHO, SPECIFICALLY — NOT "USERS"]'
  - '[YOUR ONE SUCCESS CONDITION]'
related:
  - gearnest
---

## When I use it

At the start of a build, before a single file exists. The failure mode of Vibe
Coding is not bad code — the code is usually fine. It is arriving at working
software that solves a problem you had not thought hard enough about, which is a
far more expensive mistake because it looks like progress the whole way.

Fifteen minutes on this prompt has repeatedly saved me a weekend of building the
wrong thing well.

## Why it is shaped this way

**It refuses to write code.** The instruction is there because otherwise you get
a plausible file tree in the first reply and you will start editing it, and the
thinking never happens.

**It stops between sections.** A model that is wrong in step 2 will be
confidently wrong in steps 3, 4 and 5 as well, and each step makes the error
harder to see. Correcting it early is the entire value.

**Step 5 gives it permission to disagree.** Without it you get a cheerful plan
for whatever you asked for. With it, you occasionally get told your idea does not
clear its own bar — which is worth more than everything above it.

## What it gets wrong

It over-scopes step 3 almost every time. "The smallest version" comes back with
about twice the surface area I would have chosen. I now read that step assuming
I will cut half of it, and I cut the half that is there to make the demo look
finished.

It is also weak when the success condition is soft. Give it "people should like
it" and the whole output goes vague. The prompt is only as sharp as that one
line, so spend the time there.
