# V3.2 — IA + Media Layer Patch

**Status:** **APPROVED**, with the final simplification applied. Planning and
design only — **no production code, no migration, `main` untouched, PR #6 open
and unmerged.**

**Final decisions locked at sign-off:** the navigation below · Prompt Lab with
`/prompts/` preserved · Builds at `/builds/` · Now at `/now/` · Courses inside
Learn · Out in Tech as a content type, not a nav item · **What I've Been Up To**
as the media-layer name. The editorial model that sits underneath all of it is
`V3_CONTENT_ROUTER.md`, which is the durable artifact — this document is the IA
that carries it.
**Patches:** `V3_INFORMATION_ARCHITECTURE.md` · `V3_PRODUCT_BLUEPRINT.md` · `V3_MOTION_SYSTEM.md` · `V3_CONTENT_OS.md` · `V3_IMPLEMENTATION_MASTER_PLAN.md`
**Baseline:** `claude/adeltechtalk-final-design-4nc4fr`. PR 1 is committed and in review; nothing in this patch changes its scope.

---

## 0 · What this patch fixes

The approved v3 direction represents Adel the builder and Adel the teacher very
well. It under-represents Adel the creator — the videos, the current activity,
the technology he encounters outside the studio, the running commentary on what
just changed. A visitor landing on the approved homepage learns what they can
*learn*. They do not immediately learn that the site is **alive**.

The correction is not another section. Three of the four things this patch asks
for already have homes in the repository, and the fourth is a naming change:

1. **The `builds` collection already exists** — `src/content/builds/`, with
   `status`, `stage`, `question`, `heroShot`, `liveUrl`, `tools`, `crossover`
   and `playgroundTool`. "Builds" is already the internal vocabulary. The v3 plan
   invented a route called `/projects/` on top of it.
2. **The `videos` collection already exists** — with `youtubeId`, `chapters`,
   `takeaways`, `promptSlugs` and `duration`, and a frozen rule in its own schema
   comment: *"Nothing is embedded until the reader asks for it — the page ships a
   thumbnail and a link, not an iframe."* The video embedding question is already
   answered; it needs extending to social platforms, not deciding.
3. **The `gear` schema already forbids reviews** — no rating, no score, no price,
   no retailer link, no spec table, and no field to put one in. The Gear Nests
   boundary is enforced by the data model, not by discipline.
4. **The homepage already has a "Right Now" band** doing a weak version of what
   the media layer should do: three static strips that name what Adel is
   building, exploring and testing, with no artefact behind them.

So the patch is mostly **subtraction and renaming**, not addition. The one real
structural change is that the media layer **replaces** Right Now rather than
being added above it.

---

## 1 · Navigation

### Recommended

```
AdelTechTalks   Learn   Prompt Lab   Playground   Builds   Now   About     [Login] [Join Free]
```

**Six destinations, down from seven.** The approved v3 bar was Learn · Prompts ·
Courses · Playground · Projects · What's New · About. Courses folds into Learn
and What's New becomes Now, so the bar gets shorter while the product gets wider.
That is the right direction: a navigation bar that grows every time the product
does is a navigation bar nobody reads.

| item | destination | menu | changes from v3 |
|---|---|---|---|
| **Learn** | `/learn/` | paths · guides · use cases · videos · topics · courses when published | absorbs Courses |
| **Prompt Lab** | `/prompts/` | — | **label only** |
| **Playground** | `/playground/` | Prompt Arena · your achievements | unchanged |
| **Builds** | `/builds/` | building now · shipped · experiments | **label and route** |
| **Now** | `/now/` | — | replaces What's New |
| **About** | `/about/` | — | unchanged |

### Why Courses leaves the top level

Zero courses are published. The frozen nav rule already says a menu entry is
gated on its destination having something behind it — a top-level item pointing
at an empty index breaks the site's own rule on day one. Courses returns to the
bar if and when the course library is the thing a visitor comes for; until then
it is the paid tier of Learn, which is where a visitor would look for it anyway.

### The one collision this creates, and how it resolves

**"Now" means two things** in the approved design: the nav destination proposed
here, and the homepage "Right Now" band. Rather than rename one of them, make the
relationship real: **the homepage media layer is the top of the Now stream.** The
band stops being three static strips and becomes the five most recent real items,
with "See everything →" going to `/now/`. One concept, one name, two fidelities.
That is also what removes a whole section from the page — see §5.

---

## 2 · Route decisions

The governing rule is **do not rename a route because a label changed**. But its
corollary matters just as much here: **there is nothing to preserve about a route
that does not exist yet.**

| label | route | live today? | decision |
|---|---|---|---|
| Prompt Lab | `/prompts/` | **yes — 6 published prompts, indexed** | **KEEP `/prompts/`.** Label only |
| Builds | `/builds/` | no — only `/vibe-coding/` is live | **USE `/builds/`** |
| Now | `/now/` | no | **USE `/now/`** |
| Learn | `/learn/` | yes | keep |
| Playground | `/playground/` | yes | keep |

### `/prompts/` stays — this one is not close

Six prompt files are published and indexed at `/prompts/*`, in both languages.
Renaming them to `/prompt-lab/` would move real indexed URLs to buy a tidier path
that no visitor types. The nav says **Prompt Lab**; the URL stays `/prompts/`;
the page keeps the approved positioning line *"Prompts I actually use."* No
redirect, no churn, no risk.

### `/builds/` instead of `/projects/` — a correction to the v3 plan

The approved plan said `/vibe-coding/* → /projects/*`. That was a mistake worth
fixing before it ships, because **`/projects/` has no SEO equity to preserve — it
has never existed.** Choosing `/builds/` instead costs *the same single redirect*
and buys three alignments:

- the visible label, the route and the **existing `builds` collection** finally
  agree;
- `BuildStory.astro` and `BUILD_STAGES` in `content.config.ts` already speak this
  vocabulary;
- the homepage act is called **BUILD**, and it will now link to `/builds/`
  instead of to a differently-named noun.

Redirect: `/vibe-coding/*` → `/builds/:splat`, 301, single hop, with its Arabic
twin in the same commit. Slug preserved 1:1. **Exactly the redirect the approved
plan already required** — only the destination string changes.

### `/now/` — new route, and What's New never shipped

`/whats-new/` was a planned route that does not exist, so `/now/` is free. `/now/`
is also a recognised convention for "what someone is doing at the moment", which
is precisely the section's job.

**`/videos/` stays exactly where it is.** The route, the index and the
`[...slug]` template are all live. Video pages remain at `/videos/[slug]` and
*surface* inside Now. Now is a **presentation layer over existing content types**,
not a new silo — which is the same reason `/guides/`, `/use-cases/` and
`/topics/` never moved under `/learn/`.

### Redirects actually required by this patch

```
/vibe-coding            /builds              301
/vibe-coding/*          /builds/:splat       301
/ar/vibe-coding         /ar/builds           301
/ar/vibe-coding/*       /ar/builds/:splat    301
```

**That is the complete list.** No other redirect is created by v3.2. The `/gear`,
`/profile`, `/badge` and `/playground/passport` redirects already in the approved
plan are unchanged.

---

## 3 · The media layer

### It replaces Right Now — it is not added to it

This is the structural decision in the patch, and it is what keeps the homepage
from growing.

**Right Now, as approved**, is three cards: *Now building* `[PROJECT NAME]`, *Now
exploring* `Agentic coding tools`, *Now testing* `[TOOL NAME]`. Written by hand,
carrying no artefact, going stale silently.

**The media layer** answers the same question — *is this person active?* — with
evidence instead of assertion. So it takes the slot rather than sitting above it.

```
BEFORE   Hero → Right Now (3 static strips) → BUILD → PLAY → LEARN → SHIP → Join
AFTER    Hero → What I've Been Up To (5 real items) → BUILD → PLAY → LEARN → SHIP → Join
```

**Same number of sections. Same page length. The creator dimension arrives, and
nothing gets buried** — critically, the Prompt Arena stays at act two, which was
the whole point of the v3.1 reordering.

### Recommended name: **What I've Been Up To**

| candidate | verdict |
|---|---|
| **What I've Been Up To** | **recommended.** First person, warm, unmistakably a person rather than a feed. Matches the voice guide's "curiosity over authority" |
| Lately | strong runner-up. Shorter, sits better on mobile. Less warm |
| Just Dropped | rejected. Creator-native but it is hype register, which the brand rules ban by name |
| Fresh from Adel | rejected. Third person about yourself reads as a brand talking, not a person |

The label is a one-line change in `copy.ts` and is not load-bearing — but it is
the first sentence of the site's personality after the hero, so it should be the
warm one. **Not locked; Adel's call.**

### Card types

Five, each with a required real artefact. **A card type with nothing behind it
does not render** — the same publication-gate rule as everywhere else.

Five, closed, and they are the same five as the Now activity types in
`V3_CONTENT_ROUTER.md` §5 — one vocabulary, not two.

| type | shows | requires | links to |
|---|---|---|---|
| **WATCH** | latest short / reel / video | a real published video | `/videos/[slug]`, or the platform for shorts |
| **BUILD** | what is being built right now | a `builds` entry updated in the last 60 days | `/builds/[slug]` |
| **EXPERIENCE** | a real-world tech experience — *Out in Tech* | a photograph Adel took | the `/now/` entry |
| **TAKE** | something that changed, interpreted | **`adels_take` non-empty** | the `/now/` entry |
| **TRY** | a tool actually tested | a use case or guide | the piece |

**Every card should lead deeper into the ecosystem**, not dead-end: video → the
prompt, the build or the lesson behind it · build → its case study · experience →
the story · tool → the workflow or the learning · news → Adel's take. A card with
nowhere to go is a card that spent the visitor's click.

**Staleness is a rendering rule, not a reminder.** A BUILD card whose entry has
not been updated in 60 days does not render — "Now building" pointing at a
four-month-old commit is a claim the system should not be able to make.

**Layout.** One prominent card (most recent, larger, image-led) plus four
compact. Mixed types, most recent first. Feels like a person's week, not a grid.
On mobile it is a horizontal rail with the frozen `rail-hint` affordance.

**Not an infinite feed.** Five items, capped by design. It is a homepage
signal that the site is alive, not a content directory — the full stream is
`/now/`, one click away.

**Volume gate.** Renders at **three** real items; below that the section is
absent and the hero flows straight into BUILD. At launch this is the section most
likely to be thin, and an honest absence beats three placeholder tiles.

---

## 4 · Social video strategy

### The problem

Adel's reach is on platforms; his *audience* has to end up somewhere he owns. A
video that lives only on Instagram converts attention into someone else's asset.

### The chain

```
social video  →  a page on AdelTechTalks that adds something the platform cannot
              →  the exact prompt / build / challenge / path it came from
              →  Join Free
```

**The middle step is the whole strategy.** A page that merely re-embeds the video
is worse than the platform version. The AdelTechTalks page must carry what a
60-second vertical cannot: the prompt in full and copyable, the build it came
from, the challenge that drills it, what to do next.

### Worked example

A short about building a website with AI:

| slot | resolves to |
|---|---|
| the video | thumbnail → platform (shorts) or `/videos/[slug]` (long form) |
| the exact prompt | `/prompts/[slug]` — **copyable**, which the platform cannot do |
| the build | `/builds/[slug]` |
| a challenge | a Prompt Arena challenge on the same skill |
| the path | `/learn/build-a-website/` |
| a resource | when one exists |
| **Join Free** | keep the prompt, the XP, the progress |

Every one of those links is `related_*` front matter on one video entry. **No new
system** — it is the existing `promptSlugs` field generalised.

### The rule that stops this becoming a link farm

**A video entry renders only the relations that exist.** Three empty slots and
one link is a page that wastes the visitor's click. If a video has no prompt, no
build and no challenge behind it, it does not get an AdelTechTalks page — it
stays a social post and appears in Now as a WATCH card linking out. That is
honest, and it is cheap.

---

## 5 · Video / media content model

**Extend the existing `videos` collection. Do not create a parallel one.**

It already carries `youtubeId`, `chapters`, `takeaways`, `promptSlugs`,
`duration` and the whole shared `editorial` base (title, description, date, lang,
topic, tags, cover, minutes, featured, draft, homepage, related). Roughly two
thirds of the requested fields already exist.

### Proposed additions — *not to be implemented in this patch*

```
platform        'youtube' | 'instagram' | 'tiktok' | 'linkedin' | 'x' | 'native'
externalUrl     the canonical post URL — required for non-YouTube
format          'short' | 'long' | 'clip'
thumb           a real captured frame; REQUIRED — publication gate
related_build      slug   ─┐
related_prompts    slug[]  │  all optional; a slot with nothing behind it
related_challenge  slug    │  does not render
related_path       slug    │
related_resource   slug   ─┘
adels_take      optional; when present the card may appear as MY TAKE
```

`youtubeId` becomes optional, required only when `platform === 'youtube'`.
`featured`, `draft` and `homepage` already exist on the editorial base and need
no duplication.

### Embedding — the policy already exists

The `videos` schema comment states it: *"Nothing is embedded until the reader
asks for it — the page ships a thumbnail and a link, not an iframe."* v3.2
extends that frozen rule to social platforms.

| source | approach |
|---|---|
| YouTube long-form | **click-to-load facade.** Real thumbnail + play affordance; the iframe is injected only on click |
| YouTube Shorts | facade, or link out |
| Instagram / TikTok | **thumbnail linking out.** Their embeds load heavy third-party JS, break on privacy settings, and cannot be made to respect the performance budget |
| LinkedIn / X | thumbnail linking out |
| Native (rare) | self-hosted `<video>` with `preload="none"` and a poster |

**Recommendation: hybrid, facade-first, and no third-party frame on first load
anywhere.** This is not a new constraint — it is the existing one, and it is what
protects the ≤20 KB marketing-route JS budget from a single Instagram embed.

**The site does not become a video host.** It hosts thumbnails and context.

---

## 6 · Out in Tech

### Recommendation: **B + C — a content type surfaced through Now and the media layer. No route of its own, no navigation item.**

| option | verdict |
|---|---|
| A · standalone route | **rejected for now.** Zero entries exist. A seventh nav item pointing at an empty index breaks the nav-gating rule, and "Out in Tech" as a top-level peer of Learn and Playground overstates it |
| B · content type / filter under Now | **recommended.** `/now/?type=experience` today; `/now/out-in-tech/` the moment volume justifies a landing page |
| C · homepage / editorial series | **recommended alongside B.** It is the EXPERIENCE card in the media layer |
| D · combination | this is B + C |

### Why this is the simplest scalable answer

An Out in Tech entry is *already* an editorial entry with a photograph and a
point of view. It needs no new collection, no new route and no new template — it
needs a **type** on a Now entry and a card style. If it grows to twenty entries
and people start asking for it by name, `/now/out-in-tech/` graduates from a
filter to a page, and **every existing URL keeps working** because the entries
were never anywhere else.

That is the difference between architecture that scales and architecture that
anticipates: this one costs nothing now and costs nothing later.

### What it is, and is not

**Is:** Adel experiencing technology in the real world — a Samsung store, an
Apple experience, Tesla tech, IMAX and display technology, creator events, AI
conferences, installations, launches, behind-the-scenes.

**Is not:** a Gear category, a review destination, or an unboxing shelf.

**Publication gate: a real photograph Adel took.** No stock, no press images, no
AI-generated scenes. Same gate the `gear` collection already enforces, for the
same reason — this is the content type most likely to be faked by accident, so
the gate is the schema's job and not a note in a document.

---

## 7 · Homepage hierarchy

### Recommended

```
1  Hero                        never collapses
2  What I've Been Up To        the media layer — ABSORBS Right Now      ≥3 items
3  ── BUILD  ── What I'm building                                       ≥1 build
4  ── PLAY   ── Prompt Arena, playable in place                         launch gate
5  ── LEARN  ── outcome paths → Prompt Lab → Something changed          per-block
6  ── SHIP   ── Keep what you learn                                     never
7  Footer
```

### How this differs from the brief's starting direction, and why

The brief proposed: Hero → Right Now → Media Layer → four acts → Out in Tech →
Prompt Lab → Something changed → Member. That is **nine top-level sections**, and
it separates things that belong together.

Three changes:

**1 · Media layer absorbs Right Now, rather than following it.** They answer the
same question. Keeping both means asking it twice, once with evidence and once
without. *(Saves one section.)*

**2 · Out in Tech does not get its own homepage band.** It is the EXPERIENCE card
inside the media layer. A dedicated band would need three real experiences to
render honestly, and there are zero. *(Saves one section.)*

**3 · Prompt Lab and "Something changed" stay inside LEARN**, where the approved
design already put them. Promoting them to top level would flatten the four acts
into a list of eight things — which is exactly the "content directory" the brief
says to avoid. *(Saves two sections.)*

**Net: seven sections, same as approved.** The creator dimension is added and the
page does not get longer.

### Preserving BUILD → PLAY → LEARN → SHIP

The acts are untouched: same order, same batons, same spine, same act registers.
The media layer sits **before the spine starts**, in the hero's gravitational
field — it is *evidence for the hero's claim*, not a fifth act.

That is the cleanest way to hold both stories at once:

> **The media layer proves the person is real. The four acts explain what you can
> do with that.**

The spine begins at BUILD, exactly as approved. A visitor who scrolls past the
media layer meets the identical approved narrative. A visitor who never scrolls
past it still learns the site is alive this week — which is the thing the
approved homepage could not say.

### What must not happen

- The media layer must not become a blog grid. Five items, mixed types,
  most-recent-first, one prominent.
- It must not push the hero's primary CTA below the fold on mobile.
- It must not be seeded. Below three real items it is **absent**.

---

## 8 · Motion stack

### Website runtime — recommendation: **CSS + the Web Animations API. Nothing else.**

| candidate | verdict | reasoning |
|---|---|---|
| **CSS transitions / animations** | **adopt** | already the entire v2.x motion layer. Covers reveals, staggers, the spine draw, hover, focus, the timer ring, XP fills |
| **Web Animations API** | **adopt** | already used in the prototype for one-shot sequences (badge unlock). Native, zero bytes, sequencing and cancellation for free |
| **CSS scroll-driven animations** | **adopt where supported**, with an `IntersectionObserver` fallback | the spine and act progression are exactly what it exists for |
| **Motion / Framer Motion** | **reject** | React-first. This is Astro with **no UI framework at all**. Adding one to animate four sections would be the single largest architectural regression available |
| **GSAP** | **reject** | ~30–50 KB for scroll storytelling that is a drawn line, three opacity fades and a stagger. It would consume up to twice the entire ≤20 KB marketing-route JS budget on its own |
| **Rive** | **reject for now** | a runtime plus authored `.riv` files. Genuinely good for a complex animated mascot or an interactive illustration. There is no such artefact in the approved design, and the badge unlock is deliberately *one ring and no particles* |
| **Lottie** | **reject** | same reasoning, worse performance |

**Every motion requirement in the approved design is met natively:**

| requirement | mechanism |
|---|---|
| scroll storytelling — spine, act nodes | CSS scroll-driven animation + `IntersectionObserver` |
| BUILD → PLAY → LEARN → SHIP transitions | CSS transitions, one register per act |
| baton draw and fade | CSS `transform: scaleY()` + opacity |
| Prompt Arena interactions | CSS state classes |
| timer ring | CSS transition on `stroke-dashoffset` |
| XP gain, level, badge unlock | WAAPI one-shot sequences |
| media cards | CSS hover, `rail-hint` |
| navigation | CSS, already shipped |
| reduced motion | one media query replacing the whole layer |

**This was proven, not assumed:** the published prototype implements every one of
those interactions — including the ten-item motion reference and the full
gamification sequence — in CSS and WAAPI, with **zero animation dependencies**.

> **Do not add a motion library. The design does not need one, and the
> performance budget cannot pay for one.**

Revisit only if a future design introduces character animation or an interactive
illustration — and then evaluate Rive specifically, for that artefact only.

### Media production — Remotion

**Recommendation: adopt as a Content OS capability. Never as a website
dependency.**

| dimension | position |
|---|---|
| where it runs | Adel's machine / CI, at authoring time |
| what it produces | MP4, WebM, PNG — files |
| what the website sees | a finished file, exactly like any other asset |
| runtime coupling | **none.** Not in `package.json` for `site/`. Lives under `tools/` or its own workspace |

Good fits: branded Reel and Short templates · animated explainers · dynamic
motion graphics · share assets · data-driven video (an achievement card as a
five-second animation).

**The boundary, stated once so it is not eroded:** Remotion renders *at build
time into files*. If a proposal requires Remotion's runtime in the browser, the
answer is no — that is a video player, and the site does not become one (§5).

**Not a launch blocker.** Content OS phase 3 or later.

---

## 9 · Future Content OS — create once, distribute everywhere

Documented, **not implemented**, and not a launch blocker.

```
one real thing Adel did
        │
        ├─→ website entry            Now / build / video / prompt      (git, today)
        ├─→ Reel / Short             Remotion template                 (later)
        ├─→ carousel                 Canva brand template              (spec'd)
        ├─→ story asset              Canva                             (spec'd)
        ├─→ thumbnail                Remotion or Canva                 (later)
        ├─→ share card               generated from tokens             (today, for achievements)
        └─→ newsletter item          existing newsletter               (today)
```

The payload schema in `V3_CONTENT_OS.md` §4 is already the right shape for this —
it has `targets[]`, brand-rule gates, and the three fields that carry the safety
of the whole system (`adels_take`, `authoring_required`, `checks.blocking`). v3.2
adds one obligation to it:

**Every derived asset must trace to a `source_entry` slug in the content
collections.** A Reel with no website entry behind it is a post, not a
distribution — and the whole point of the loop is that attention lands somewhere
Adel owns.

Tooling stays as specified: Claude for structure and drafting, **never for
Adel's take** · Remotion for motion · Figma as the source of truth · Canva as the
publishing surface · git for the content itself.

---

## 10 · Gear Nests boundary — reconfirmed

**AdelTechTalks must not become Gear Nests 2.0.** Unchanged, and now doubly
enforced because v3.2 adds a content type that could drift there.

On AdelTechTalks, technology appears **only** when attached to a workflow, an AI
feature, a creator workflow, a build, a real-world experience, a lesson or a
technology story.

**Belongs to Gear Nests, never here:** unboxings · full product reviews · spec
comparisons · buying guides · scores and ratings.

**Gear Nests may appear on AdelTechTalks as** a Build, a case study, a
build-in-public project, or an example of building a real business with AI —
which is exactly how the published `gearnest` use case already behaves
(`featured: false`, `homepage: false`).

**Out in Tech is the type most at risk of drifting into review territory**, so it
carries the same schema-level protection the `gear` collection already has: no
rating, no score, no price, no retailer link, no spec table, **and no field to
put one in.** An Out in Tech entry whose H1 is a product name is a review with a
different hat on; the H1 is the experience or the question.

---

## 11 · Impact on the Implementation Master Plan

**PR 1 is unchanged.** It is committed, in review as PR #6, and this patch does
not touch its scope.

| PR | change | net effect |
|---|---|---|
| 2 · CI harness | none | — |
| 3 · tokens + motion | **confirms no motion library.** Adds media-card tokens | none on scope |
| 4 · `src/server/*` | none | — |
| 5 · migrations + shims | none | — |
| 6 · RTL foundations | media-card RTL: the rail reverses; thumbnails do not mirror; durations stay Western digits | small |
| **7 · homepage shell** | **`home/Exploring.astro` becomes the media layer instead of the Now trio.** Section count unchanged | **neutral** |
| **8 · Projects → Builds** | route is `/builds/`, redirect target changes, label is Builds | **smaller** — route now matches the existing collection |
| 9 · Learn + Prompts | nav label becomes Prompt Lab. **Route unchanged** | trivial |
| **10 · What's New → Now** | `/now/` instead of `/whats-new/`; Now presents existing types as well as its own entries | slightly larger |
| 11–13 · Playground | none | — |
| 14–16 · member, achievements, commerce | none | — |

### Content schema changes

| collection | change | PR |
|---|---|---|
| `videos` | `platform`, `externalUrl`, `format`, `thumb` (gate), `related_*`, optional `adels_take`; `youtubeId` becomes conditional | 10 |
| `now` | **new** — `type` (`take` / `experience` / `note` / `tool`), `adels_take` **required for `take`**, `photo` **required for `experience`**, `source_url`, `related_*` | 10 |
| `builds` | **no change** — it already has everything | 8 |
| `prompts` | no change | 9 |

**One new collection, not four.** WATCH reads `videos`, BUILD reads `builds`, TRY
reads guides and use cases. Only *takes* and *experiences* have no home today.

### SEO

Net new redirect surface: **four lines** (`/vibe-coding` and its Arabic twin →
`/builds`). Everything else in the approved SEO plan is unchanged. `/prompts/`,
`/videos/`, `/learn/`, `/playground/` and the whole library keep their URLs.

`/now/` and `/builds/` join the sitemap with `emptyIndexFilter` applied, so they
are excluded until they have content — the mechanism already in `astro.config.mjs`.

### Analytics — six additions

```
media_card_shown      { type, position }        does the layer get seen
media_card_clicked    { type, position }        which card type earns the click
video_play_clicked    { video_slug, platform }  facade → play conversion
outbound_social       { platform, video_slug }  attention leaving to a platform
now_entry_opened      { entry_slug, type }      replaces whats_new_opened
related_link_clicked  { from_type, to_type }    **does the social→owned chain work**
```

`related_link_clicked` is the one that matters: it measures whether §4 is real.
If short-form attention never clicks through to a prompt, a build or a challenge,
the loop is decorative and the strategy needs rethinking rather than more videos.

All six follow the existing privacy rules: no PII, slugs not titles, no `user_id`
in any payload.

### Performance

The media layer is **the highest-risk addition in v3.2** — it is images, above
the fold, on the most-visited route.

| budget | position |
|---|---|
| initial JS, marketing routes ≤20 KB | **unchanged.** Facade thumbnails need no JS until clicked |
| **no third-party frame on first load** | **new, and binding.** One Instagram embed would exceed the entire route budget by itself |
| media thumbnails | ≤40 KB each, AVIF/WebP, explicit `width`/`height`, `loading="lazy"` below the first card |
| LCP ≤2.0s | the prominent card's image is a **candidate LCP element** — `fetchpriority="high"`, and it must not displace the hero photograph |
| CLS ≤0.05 | every thumbnail reserves its aspect ratio |

**One new gate:** the homepage must be measured with the media layer at **full
five items with real images**, not in its empty state. The empty-state gate
already exists and stays; this adds its opposite, because this is the one section
whose *full* state is the performance risk.

---

## 12 · Decisions for Adel

| # | decision | recommendation | reason | impact | approval? |
|---|---|---|---|---|---|
| 1 | **Final navigation** | `Learn · Prompt Lab · Playground · Builds · Now · About` + Login / Join Free | Six destinations, one fewer than approved, while the product gets wider. Every label names a thing rather than a category | `copy.ts`, `nav-menus.ts`, PR 7 | **yes** |
| 2 | **Prompt Lab vs Prompts** | **Prompt Lab** as the label, **`/prompts/` as the route** | Six published prompts are indexed at `/prompts/*` in both languages. The label carries the experiment meaning; the URL carries the equity. No redirect | label only | **yes** |
| 3 | **Builds vs Projects** | **Builds**, and **`/builds/` as the route** | `/projects/` has never existed, so there is nothing to preserve. `/builds/` aligns the label, the route and the **`builds` collection that already exists**. Same single redirect either way | changes the redirect target in PR 8 | **yes** |
| 4 | **Now vs What's New** | **Now**, at **`/now/`** | `/whats-new/` never shipped. Now holds takes, experiences, videos and current activity — What's New could only hold news. The homepage band becomes the top of this stream | PR 10 | **yes** |
| 5 | **Media section name** | **What I've Been Up To** (runner-up: *Lately*) | First person, warm, unmistakably a person. *Just Dropped* is hype register, which the brand rules ban | one `copy.ts` key | **yes — voice call** |
| 6 | **Out in Tech architecture** | **Content type surfaced through Now + the EXPERIENCE card. No route, no nav item** | Zero entries exist. `/now/out-in-tech/` graduates from a filter to a page when volume justifies it, with no URL churn | schema only | **yes** |
| 7 | **Courses top-level?** | **No.** Fold into Learn | Zero courses published. A top-level item pointing at an empty index breaks the site's own nav-gating rule | removes one nav item | **yes** |
| 8 | **Website motion stack** | **CSS + Web Animations API. No GSAP, no Rive, no Motion, no Lottie** | Every approved interaction is already built this way in the prototype with zero animation dependencies. GSAP alone would consume up to 2× the entire marketing-route JS budget | none — confirms current course | no, unless you disagree |
| 9 | **Video embedding** | **Hybrid, facade-first. No third-party frame on first load** | Already the frozen policy in the `videos` schema; v3.2 extends it to social. One Instagram embed would blow the route budget | PR 10 | no — existing rule |
| 10 | **Route changes required** | **Four lines only:** `/vibe-coding` + Arabic twin → `/builds` | Everything else keeps its URL. `/now/` and `/builds/` are new routes with no predecessor | `public/_redirects`, PR 8 | **yes — confirms #3** |

**Genuinely needs your call: 1, 3, 4, 5, 6, 7.** Items 2 and 10 follow from 1 and
3. Items 8 and 9 are recommendations to *keep doing what the repo already does*
and need approval only if you disagree.

---

## 13 · What is still pending, unchanged

Everything in `V3_DESIGN_SIGNOFF.md` §2.7 stands: **Arabic final copy and
typography remain PENDING NATIVE FINAL REVIEW.** v3.2 adds Arabic strings for six
nav labels, the media section title and five card-type labels — all of which join
that queue rather than shipping provisional.

The three Prompt Arena challenges, the KO Ghorab review and the real project
screenshots remain the launch-gating content dependencies.
