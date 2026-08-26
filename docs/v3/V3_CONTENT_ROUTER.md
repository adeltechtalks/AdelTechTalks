# V3_CONTENT_ROUTER

**Status:** **APPROVED** at the v3.2 final simplification. This is the durable
editorial model — the thing Adel uses when an idea arrives, not a document read
once.
**Governing principle:** *do not make every content idea fit a category tree.*

---

## 1 · The router, in full

Three questions. That is the whole system.

```
①  Is this AdelTechTalks or Gear Nests?
        │
        └── AdelTechTalks
              │
②  Where does it live?  ONE of five destinations
              │
   Teaching someone how to do something?        →  LEARN
   A reusable prompt is the value?              →  PROMPT LAB
   It is playable?                              →  PLAYGROUND
   A real project/build/business is the story?  →  BUILDS
   Current activity — tested, seen, thought?    →  NOW
              │
③  Optionally tag it:   TOPIC  (only if educational)  +  FORMAT
```

**Destination is mandatory and singular. Topic is optional. Format is
descriptive.** Nothing else is a classification axis.

---

## 2 · The five destinations

| destination | the question it answers | route |
|---|---|---|
| **Learn** | *"Teach me how to do this."* | `/learn/` |
| **Prompt Lab** | *"Give me the words that work."* | `/prompts/` |
| **Playground** | *"Let me try it."* | `/playground/` |
| **Builds** | *"Show me the real thing you made."* | `/builds/` |
| **Now** | *"What are you doing this week?"* | `/now/` |

**One destination per piece.** A piece that seems to want two is usually two
pieces — a Now item about testing a tool, and a Learn guide about using it. That
is a feature: the Now item is fast and disposable, the guide is durable, and they
link to each other.

---

## 3 · The four educational topics

**Only four. This list is closed.**

1. **Prompting**
2. **Vibe Coding**
3. **Vibe Designing**
4. **AI Workflows & Automation**

**Not topics, and not to be added:** Vibe Managing · Vibe Building · Business
Vibes · Vibe Everything · Vibe Selling · Vibe Research · Software · AI Tools ·
Gadgets.

### What each one covers

| topic | covers |
|---|---|
| **Prompting** | writing, repairing and reusing prompts; prompt structure; what makes one reliable |
| **Vibe Coding** | websites, apps, software, prototypes — building through conversation and direction with AI |
| **Vibe Designing** | UI, visual design, branding, design systems, creative direction through AI |
| **AI Workflows & Automation** | wiring tools together; automating real work end to end |

### On the word "Vibe"

**Vibe Coding** and **Vibe Designing** are deliberate signature language and
should be visible enough to do brand work. **The word stops there.** AI Workflows
& Automation keeps its plain name — a forced "Vibe Automating" would cheapen the
two places where the word means something. Overusing it turns a distinctive term
into a verbal tic.

### "Building with AI" is not a topic

It is the **story of the whole site** — what Adel does, not a category competing
with the four. Adel builds real things publicly and teaches from them.

```
the build itself is the story         →  BUILDS        (Gear Nests, AdelTechTalks, an app)
the lesson extracted from the build   →  LEARN         + one of the four topics
```

A Gear Nests build update is **Builds**. The lesson *"how I structured the
storefront prompts"* pulled out of it is **Learn → Prompting**. Same work, two
pieces, two destinations, no new pillar.

---

## 4 · Format is not a category

Format describes the **shape** of a piece. It never decides where it lives.

`Video` · `Guide` · `Cheat Sheet` · `Tip` · `Prompt` · `Challenge` ·
`Resource` · `Case Study` · `Note` · `Story`

> A Cheat Sheet is a format. A Tip is a format. A Video is a format.
> **None of them is a section.**

```
Destination: Learn      Topic: Vibe Coding   Format: Cheat Sheet
Destination: Now        Activity: TRY        Format: Video
```

---

## 5 · Now activity types

Five, closed, and they double as the homepage media-card types.

| type | when |
|---|---|
| **WATCH** | a video or short Adel published |
| **BUILD** | progress on something being built right now |
| **EXPERIENCE** | technology met in the real world — *Out in Tech* |
| **TAKE** | something changed, and Adel's interpretation of it |
| **TRY** | a tool or feature actually tested |

**Out in Tech is the EXPERIENCE type**, not a nav item, not a homepage band, and
not a route. `/now/out-in-tech/` may graduate from a filter to a page later, with
no URL churn, if enough real entries exist.

---

## 6 · Tools are never a pillar

There is no Software section and no AI Tools section. **A tool is classified by
the story being told about it**, which means the same tool appears in different
places — and that is correct, not a taxonomy failure.

Worked through with one tool:

| the idea | destination | topic | format |
|---|---|---|---|
| "I'm testing the latest Higgsfield feature" | **Now** · TRY | — | Video |
| "How to create an AI commercial with Higgsfield" | **Learn** | Vibe Designing | Guide / Video |
| "The prompt I use for these Higgsfield shots" | **Prompt Lab** | Prompting | Prompt |
| "How I used Higgsfield building a real campaign" | **Builds** | — | Case Study |

Four destinations, one tool, no category invented.

---

## 7 · Affiliate is metadata

```
affiliate: true | false
```

**An affiliate relationship never decides where a piece lives.** A tool belongs
where its story belongs. There is no Affiliate section, and creating one to host
links would invert the whole model — the destination would start following the
money instead of the story.

Disclosure is clear wherever required, rendered from the flag rather than
remembered per piece.

---

## 8 · The Gear Nests boundary — question ① in practice

**Gear Nests, never AdelTechTalks:** unboxings · full product reviews · spec
comparisons · buying guides · scores and ratings.

**AdelTechTalks covers technology when the story is** an AI feature · a workflow ·
a creator workflow · a lesson · a build · a real-world technology experience · a
technology story.

The everyday test, short enough to use while an idea is still forming:

> **Is the product the subject, or is the work the subject?**
> Product → Gear Nests. Work → AdelTechTalks.

Gear Nests may appear on AdelTechTalks as a **Build**, a case study, or an example
of building a real business with AI. It is never a section here.

**The `gear` schema already enforces this**: no rating, no score, no price, no
retailer link, no spec table, and no field to hold one. Out in Tech inherits the
same protection, and its H1 is the experience or the question — never a product
name.

---

## 9 · Sanity check — twelve examples, no new pillar

The test the model had to pass before being approved: **if any of these needs a
new category, the model is wrong and gets simplified rather than extended.**

| # | idea | site | destination | topic | format / activity |
|---|---|---|---|---|---|
| 1 | Higgsfield feature test | ATT | **Now** | — | TRY · Video |
| 2 | Higgsfield AI commercial tutorial | ATT | **Learn** | Vibe Designing | Guide / Video |
| 3 | Prompt cheat sheet | ATT | **Learn** | Prompting | Cheat Sheet |
| 4 | Vibe Coding website tutorial | ATT | **Learn** | Vibe Coding | Guide / Video |
| 5 | Vibe Designing brand identity tutorial | ATT | **Learn** | Vibe Designing | Guide / Video |
| 6 | Claude Browser productivity tip | ATT | **Now** | AI Workflows & Automation | TRY · Tip |
| 7 | AI automation workflow | ATT | **Learn** | AI Workflows & Automation | Guide |
| 8 | Gear Nests build-in-public update | ATT | **Builds** | — | Case Study |
| 9 | Samsung Store technology experience | ATT | **Now** | — | EXPERIENCE · Story |
| 10 | AI news with Adel's interpretation | ATT | **Now** | — | TAKE · Note |
| 11 | Traditional camera unboxing | **Gear Nests** | — | — | — |
| 12 | Full gadget review | **Gear Nests** | — | — | — |

**Twelve for twelve, no new pillar.** Two never reach the router at all — they
are answered by question ①, which is the cheapest possible place to answer them.

### The two that needed a tie-break, recorded so they stay consistent

**#3 — a prompt cheat sheet is Learn, not Prompt Lab.** The test is *what is the
primary value?* A sheet of techniques teaches; a copyable prompt is the tool
itself. If the piece is one prompt someone will paste, it is Prompt Lab. If it is
a reference *about* prompts, it is Learn → Prompting → Cheat Sheet.

**#6 — a tip is Now, not Learn.** A single observation someone acts on in thirty
seconds is current activity. It earns a topic tag because it is genuinely about
workflows, but it does not become a guide. **Not everything with a lesson in it is
Learn** — if it were, Now would empty out and the site would stop looking alive.

### Two things this check proves about the model

1. **Topic is genuinely optional.** Five of the ten AdelTechTalks examples carry
   none, and nothing is lost — forcing a topic onto a Samsung Store visit would
   be classification for its own sake.
2. **The same tool lands in four different destinations** (§6) without
   contradiction, because destination follows the story rather than the subject.

---

## 10 · Content model implications

**Two reconciliations the repository forces.** Both are simplifications, and both
are flagged here rather than discovered during implementation.

### 10.1 `topic` and the four educational topics are different axes

`src/content.config.ts` already has:

```ts
const TOPICS = ['ai','automation','product','tech','building','creator-tech']
```

Six values, **in use by published content** (`building` ×6, `product` ×3,
`automation`, `creator-tech`) and driving **indexed `/topics/[topic]` URLs**.

The four educational topics are **not** a replacement for that enum. They are a
different question: *which skill does this teach?* versus *what is this about?*

**Recommendation: add a new optional `skill` field; leave `topic` alone.**

```ts
skill: z.enum(['prompting','vibe-coding','vibe-designing','ai-workflows']).optional()
```

Collapsing `TOPICS` into the four would move live indexed URLs to buy tidiness —
the same mistake `/projects/` nearly was. `topic` keeps its discovery routes;
`skill` carries the educational axis and the XP tracks.

### 10.2 The XP skill tracks reduce from five to four

`V3_GAMIFICATION.md` §4 lists `prompting · coding · design · automation ·
business`. The approved topics are four, and **Business Vibes is explicitly
excluded**. A fifth XP track with no educational topic behind it would be a track
nobody could ever earn against.

```
prompting · vibe-coding · vibe-designing · ai-workflows
```

`business` is dropped. The tracks and the topics are now the same four things,
which is what makes "strongest in Prompting, nothing yet in Vibe Designing"
mean something.

### 10.3 New front-matter fields

| field | applies to | required? |
|---|---|---|
| `skill` | any collection | optional — **never forced** |
| `format` | any collection | optional; defaults from the collection |
| `activity` | `now` only | required — one of the five types |
| `affiliate` | any collection | defaults `false` |

**No new collection.** `now` was already the single addition in v3.2, and these
are fields on what exists.
