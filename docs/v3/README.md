# AdelTechTalks v3 — architecture set

**Status: PROPOSAL. Nothing here is implemented. `main` is untouched and production is unchanged.**

Baseline: v2.x at `7bb4b45`, live and stable. These ten documents plus the SQL
drafts in `site/supabase/v3/` are the artifacts the brief requires *before* any
production-facing code is written.

Read in this order:

| # | document | answers |
|---|---|---|
| 1 | [V3_PRODUCT_BLUEPRINT](V3_PRODUCT_BLUEPRINT.md) | what the product becomes, and what the current system actually is |
| 2 | [V3_INFORMATION_ARCHITECTURE](V3_INFORMATION_ARCHITECTURE.md) | nav, routes, the current→v3 migration matrix, redirects, homepage order |
| 3 | [V3_DESIGN_SYSTEM](V3_DESIGN_SYSTEM.md) | foundations, four component families, Figma library, social templates |
| 4 | [V3_MOTION_SYSTEM](V3_MOTION_SYSTEM.md) | five tiers, named sequences, performance budget, reduced motion |
| 5 | [V3_DATA_MODEL](V3_DATA_MODEL.md) | the schema, the `badges` collision, event-sourced XP, migration order |
| 6 | [V3_COMMERCE_AND_ENTITLEMENTS](V3_COMMERCE_AND_ENTITLEMENTS.md) | Stripe, webhooks, the one entitlement table and its resolver |
| 7 | [V3_SECURITY_MODEL](V3_SECURITY_MODEL.md) | what v2.x lacks, server sessions, RLS matrix, rate limits, review gates |
| 8 | [V3_GAMIFICATION](V3_GAMIFICATION.md) | XP, levels, skill tracks, badges, the public achievement loop |
| 9 | [V3_CONTENT_OS](V3_CONTENT_OS.md) | the internal content pipeline and its output schema |
| 10 | [V3_IMPLEMENTATION_PLAN](V3_IMPLEMENTATION_PLAN.md) | runtime decision, component audit, phases, risks, dependencies, QA |

Supporting: [`site/supabase/v3/`](../../site/supabase/v3/) — six proposed migrations, none run.

## The five decisions worth arguing about first

1. **Static-first stays.** v3 does not become an SSR site. A dozen routes opt out of prerendering; everything indexed stays a CDN file. *(Plan §1)*
2. **The library does not move under `/learn/`.** A tidier path is not worth renaming every indexed editorial URL in two languages. *(IA §4)*
3. **The live `badges` table is renamed now**, not worked around. It means "badges this user earned"; v3 needs the name for the catalogue. *(Data Model §1)*
4. **`shares` becomes a view.** Those links are on LinkedIn and cannot 404. This is the highest-risk migration in the set. *(Data Model §3, Risk 1)*
5. **Entitlements are one table and one resolver**, written only by verified webhooks. No component asks about purchases. *(Commerce §1, §5)*

## Open items requiring Adel

- Authored Arabic for every new string. Marked `‹author›` throughout; these block release, not implementation.
- Level names in Arabic — brand vocabulary, must be authored.
- Real project screenshots, course content, the first challenge set.
- Confirmation that `/gear/*` should 301 to `/projects/` rather than to Learn.
