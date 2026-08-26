# AdelTechTalks v3 — architecture set

**Status: PROPOSAL. Nothing here is implemented. `main` is untouched and production is unchanged.**
**Revision: v3.1, design phase CLOSED.** Start with the sign-off record, then the
implementation plan. The patch below records what changed from v3 and why.

Baseline: v2.x at `7bb4b45`, live and stable.

## Read in this order

| # | document | answers |
|---|---|---|
| **00** | [**V3_DESIGN_SIGNOFF**](V3_DESIGN_SIGNOFF.md) | **what is approved, what is still pending, and the decisions taken at sign-off** |
| **0** | [**V3_IMPLEMENTATION_MASTER_PLAN**](V3_IMPLEMENTATION_MASTER_PLAN.md) | **the six phases, sixteen PRs, file-by-file map, migration order and cutover** |
| **0b** | [**V3_2_IA_MEDIA_PATCH**](V3_2_IA_MEDIA_PATCH.md) | **navigation naming, the homepage media layer, social video, Out in Tech, the motion-stack decision** |
| 1 | [V3.1_ARCHITECTURE_PATCH](V3.1_ARCHITECTURE_PATCH.md) | what v3.1 changes, and the security defect it corrects |
| 2 | [V3_PRODUCT_BLUEPRINT](V3_PRODUCT_BLUEPRINT.md) | what the product becomes, the current system, and the three launch states |
| 3 | [V3_INFORMATION_ARCHITECTURE](V3_INFORMATION_ARCHITECTURE.md) | nav, routes, the migration matrix, redirects, the four-act homepage |
| 4 | [V3_DESIGN_SYSTEM](V3_DESIGN_SYSTEM.md) | foundations, component families, Figma library, template inventory |
| 5 | [V3_MOTION_SYSTEM](V3_MOTION_SYSTEM.md) | five tiers, the four-act identity, the interactive state machine, reduced motion |
| 6 | [V3_DATA_MODEL](V3_DATA_MODEL.md) | the schema, the `badges` collision, event-sourced XP, migrations, legacy retirement |
| 7 | [V3_API_SURFACE](V3_API_SURFACE.md) | **every server endpoint, what it refuses, what it proves before it writes** |
| 8 | [V3_COMMERCE_AND_ENTITLEMENTS](V3_COMMERCE_AND_ENTITLEMENTS.md) | Stripe, webhooks, the one entitlement table, secret handling |
| 9 | [V3_SECURITY_MODEL](V3_SECURITY_MODEL.md) | server sessions, the RLS matrix, the policy test, §5.1 |
| 10 | [V3_GAMIFICATION](V3_GAMIFICATION.md) | XP, levels, badges, the achievement loop, Prompt Arena |
| 11 | [V3_CONTENT_OS](V3_CONTENT_OS.md) | the internal content pipeline and its output schema |
| 12 | [V3_CANVA_PRODUCTION_SYSTEM](V3_CANVA_PRODUCTION_SYSTEM.md) | Figma as source of truth, Canva as the publishing surface |
| 13 | [V3_IMPLEMENTATION_PLAN](V3_IMPLEMENTATION_PLAN.md) | runtime, component audit, phases, risks, dependencies, QA |

Supporting: [`site/supabase/v3/`](../../site/supabase/v3/) — seven proposed migrations, none run.
Design artifact: https://claude.ai/code/artifact/becad32a-445e-493b-a685-9a9eee36ca4b
Prototype source: [`prototype/`](prototype/) — the artifact's HTML plus its two QA suites.

## The decisions worth arguing about first

1. **No client writes a verification.** Public achievements are published by a
   server endpoint that proves ownership first. This corrects a defect in the v3
   set. *(Patch §1, Security §5.1, API Surface §2)*
2. **The legacy gamification path has a retirement date and a terminal state.**
   Three stages, verifiable preconditions, archived rather than dropped.
   *(Migration 07, Data Model §5)*
3. **A self-assessed score is not evidence.** It earns completion XP and nothing
   else — which locks `prompt-architect` until Phase 4. *(Gamification §7.3)*
4. **BUILD → PLAY → LEARN → SHIP.** The interactive thing comes before the reading
   list, on the page and in the motion. *(Blueprint §2, IA §5, Motion §2.5)*
4b. **The media layer replaces Right Now rather than joining it** — the creator
   dimension arrives without the homepage getting longer, and the Arena stays at
   act two. *(v3.2 §3, §7)*
4c. **`/builds/` not `/projects/`, and `/prompts/` keeps its URL.** A route with
   no history is free to name well; a route with six indexed pages is not.
   *(v3.2 §2)*
4d. **No motion library.** CSS plus the Web Animations API, proven in the
   prototype with zero animation dependencies. *(v3.2 §8)*
5. **Playground opens with three complete challenges and a working loop.** The
   gate is the loop — score, explanation, XP, badge, save, try another, share —
   not the count. *(Gamification §7.1)*
6. **Static-first stays.** A dozen routes opt out of prerendering; everything
   indexed stays a CDN file. *(Plan §1)*
7. **The library does not move under `/learn/`.** *(IA §4)*
8. **`shares` becomes a view.** Those links are on LinkedIn and cannot 404. Still
   the highest-risk migration in the set. *(Data Model §3)*
9. **Entitlements are one table and one resolver**, written only by verified
   webhooks. *(Commerce §1, §5)*
10. **Figma decides, Canva produces.** A fix made in Canva is not a fix.
    *(Canva §1)*

## Open items requiring Adel

- **Authored Arabic** for every new string — marked `‹author›` throughout. Level
  names, nav labels, Preview copy, challenge copy, achievement titles. These block
  release, not implementation.
- **Three complete Prompt Arena challenges**, each with its rubric, its
  per-rule explanations, its XP value and its badge eligibility. Reduced from
  nine at design sign-off; the library expands past nine after launch with no
  code change.
- **Real project screenshots and course content.**
- **Confirmation** that `/gear/*` should 301 to `/projects/` rather than to Learn.
- **A decision** on whether to build the homepage achievements wall now. It will be
  Absent at launch; deferring the component to Phase 4 is reasonable.
