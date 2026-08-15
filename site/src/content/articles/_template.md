---
title: The shape of an article
description: A template, not a published piece. Copy it, rename it, write in it.
date: 2026-08-15
topic: building
tags:
  - template
minutes: 3
draft: true
---

**This file is a template and never appears on the site.** `draft: true` keeps it
out of every index, every feed and every sitemap. It exists so the Articles
collection has a shape you can copy, and so the build does not warn about an
empty directory.

## To write an article

Copy this file, give it a new name — the filename becomes the URL, so
`why-i-stopped-using-notion.md` becomes `/articles/why-i-stopped-using-notion/` —
and delete `draft: true` when it is ready to publish.

## The frontmatter

Only four fields are required: `title`, `description`, `date` and `topic`. The
topic must be one of the six ids in `topics` in `src/site.config.ts`:
`ai`, `automation`, `product`, `tech`, `building`, `creator-tech`.

Everything else is optional:

- `cover` and `coverAlt` — a header image, relative to `/public`
- `preview` — one or two sentences shown large, above the body
- `minutes` — roughly how long it takes to read
- `updated` — set it when you materially revise a published piece
- `tags` — free text, shown at the foot
- `related` — slugs of other guides or articles
- `featured` — pins it to the top of the index
- `campaign` — the campaign name to use in links to this piece

## Arabic

An Arabic article is a separate file with `lang: ar` in its frontmatter. Add
`translationOf:` with the English slug and the two are linked. Nothing is
machine-translated — a language only ever shows what was actually written in it.

## What a Guide adds

A Guide is this plus a `download:` block. Everything else about the two is the
same, and they share one template.
