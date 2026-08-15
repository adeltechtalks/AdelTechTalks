---
# =============================================================================
# COURSE — MODEL ONLY. THERE IS NO /courses ROUTE AND NOTHING HERE PUBLISHES.
# =============================================================================
# Phase 1.1 deliberately did not build the course experience: no player, no
# enrolment, no progress tracking, no LMS, no billing. The brief was explicit
# that unfinished Courses must not be exposed, so /learn names Courses as in
# progress and links nowhere.
#
# What exists is this shape, so that writing the first course is a content job
# rather than a content-model redesign. A course is a PATH THROUGH the library —
# it references guides and videos that already exist instead of duplicating
# them, which is why `ref` holds a slug and not a body.
#
# TO SWITCH COURSES ON LATER:
#   1. Write real course files here (drop the leading _ so they load).
#   2. Build the course routes and the player.
#   3. In site.config.ts, change the `courses` entry in `ecosystem` from
#      { path: null, status: 'building' } to { path: '/courses', status: 'live' }
#      and move its `nav` entry to phase 1.5.
#   The Learn Hub then links it. Nothing else changes.
# =============================================================================

title: 'Ship your first automation'
description: 'One sentence on what somebody can do at the end that they could not do at the start.'
date: 2026-01-01
lang: en

topic: automation
level: intro          # intro · working · deep

# Free unless and until commerce.enabled is true in site.config.ts. While it is
# false, lib/commerce.ts refuses to treat anything as purchasable, so a stray
# 'paid' here cannot lock a reader out of content that is in fact free.
access: free
# price: 49

lessons:
  - { title: 'Why this, and what you will build', kind: 'guide', ref: 'first-workflow' }
  - { title: 'Watch it run end to end',           kind: 'video', ref: '' }
  - { title: 'Now do it on your own machine',     kind: 'exercise' }

draft: true
---

The course overview goes here — who it is for, what they need before starting,
and what they will have working at the end.
