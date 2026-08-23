# V3_CONTENT_OS

**Status:** proposal. **Revised in v3.1** — §6 phase 3 now targets the Canva
production system described in `V3_CANVA_PRODUCTION_SYSTEM.md`. Internal tooling —
never a visitor-facing feature.

**What it is:** the machinery of Adel's loop — *Build → Test → Learn → Teach → Package*. The first four happen anyway. The Content OS is the fifth: turning one piece of real work into the several assets it should have produced, without doing it by hand each time and without letting the brand drift.

**What it is not:** a content generator. It does not invent Adel's opinion, and it cannot publish. It takes something that happened and structures it.

---

## 1 · The pipeline

```
INPUT → ANALYZE → CLASSIFY → OBJECTIVE → FORMAT → GENERATE → BRAND RULES → PAYLOAD
```

**Input** — an idea, a paragraph, a screenshot, an image, a URL, a product, an AI announcement, or a project update.

**Analyze** — extract what is actually there: entities, claims, dates, sources, whether a real artefact (screenshot, result, repo) exists.

**Classify** — what kind of thing is this? `announcement · tool · technique · result · opinion · question · milestone`.

**Objective** — one of: `Teach · Explain · React · Compare · Build · Promote`. Objective is chosen, not inferred silently, and it drives everything downstream: the same input as *Teach* and as *React* produces genuinely different assets.

**Format** — one or more of: `Reel · Carousel · Cheat Sheet · Prompt Card · What's New · Build Log · Course Asset`.

**Generate** — structure and draft copy for the chosen format, in the chosen language.

**Brand rules** — the gate. Detailed in §3.

**Payload** — a typed JSON object that can populate a Figma or Canva template programmatically, or seed a Markdown file in the content collections.

---

## 2 · Objective → format map

| objective | default formats | the shape |
|---|---|---|
| Teach | Cheat Sheet, Carousel, Course Asset | steps, each with an outcome |
| Explain | Carousel, What's New | what it is → why it matters → what to do |
| React | What's New, Reel | what changed → Adel's take → try it |
| Compare | Carousel, Cheat Sheet | dimensions, honest verdict, "it depends" allowed |
| Build | Build Log, Reel | what I tried → what broke → where it got to |
| Promote | Course Cover, Carousel | the outcome, never the feature list |

---

## 3 · Brand rules — the gate that makes this safe

An automated pipeline is a very efficient way to publish something false at scale. These run on every payload, and a failure **blocks output** rather than warning:

**Truth**
- No claim without a source or a real artefact behind it.
- No screenshot, metric, testimonial, review, rating or subscriber figure that does not exist.
- "Adel's take" must be Adel's — the pipeline may draft a structure and a prompt for it, and it **may not** write the opinion. A `React` payload with a generated take is rejected.
- Status claims ("Now building", "Live") are checked against the actual project state.

**Voice**
- Curiosity over authority. "Here's what I tested" and "here's what surprised me", never guru register.
- No hype vocabulary: *game-changer, insane, revolutionary, 10x, secret, nobody is talking about this*.
- Short sentences. No corporate abstraction.

**Brand**
- The closed badge set only; 1 primary + at most 1 optional secondary marker.
- Tokens only: CS v3.0 palette, no gradients, mint within its ceiling.
- Montserrat / KO Ghorab / Readex Pro / JetBrains Mono. No fifth face.
- Photography-first, real photography only. Headline on a solid band, never a gradient scrim.
- Gear Nests appears only as a project or a teaching example, never as a review.

**Arabic — the hardest gate**
- Arabic output is **authored, never translated**. The pipeline may produce an English payload and an Arabic *brief* — intent, facts, structure — for Adel to author against. It must not emit finished Arabic copy derived from English. This is `ARABIC_VOICE_GUIDE.md`, and it is the rule most likely to be quietly broken by an automated pipeline, so it is enforced structurally: the Arabic payload has an `authoring_required: true` flag and cannot be marked ready while it is set.
- Frozen non-translated terms stay Latin: AI, Vibe Coding, Prompt, Playground, Claude, ChatGPT, Workflow, Automation, GitHub, product names.
- Bidi isolation on every mixed run; Western digits; `الـ` never orphaned from its term.

---

## 4 · The output payload

One schema, versioned, consumed by both the template renderers and the content-collection seeder.

```jsonc
{
  "schema_version": "1.0",
  "id": "wn-2026-08-claude-code-agents",
  "created_at": "2026-08-23T00:00:00Z",

  "source":     { "kind": "announcement", "url": "...", "captured_at": "..." },
  "objective":  "React",
  "format":     "WhatsNew",
  "lang":       "en",
  "authoring_required": false,   // true on every AR payload until Adel writes it

  "badge":      { "primary": "learn", "secondary": "new" },

  "content": {
    "headline":   "...",
    "what_changed": "...",
    "why_it_matters": "...",
    "adels_take": null,          // MUST be filled by Adel. null blocks publish.
    "try_it":     { "label": "...", "href": "/prompts/..." },
    "slides":     [],            // carousel only
    "steps":      [],            // cheat sheet only
    "prompt":     null           // prompt card only
  },

  "media": {
    "photo":      null,          // real asset path, or null → slot collapses
    "screenshot": null,
    "alt":        ""
  },

  "targets": [
    { "template": "WhatsNew",   "size": "1080x1350" },
    { "template": "ReelCover",  "size": "1080x1920" }
  ],

  "checks": {
    "truth":  "pass",
    "voice":  "pass",
    "brand":  "pass",
    "arabic": "n/a",
    "blocking": []               // non-empty → cannot render, cannot publish
  }
}
```

Three fields carry the safety of the whole system: `adels_take` (null blocks a React payload), `authoring_required` (blocks derived Arabic), and `checks.blocking` (blocks everything). A renderer that ignores them defeats the pipeline, so the renderer asserts on them rather than trusting its caller.

---

## 5 · Where it runs

A local Node script under `scripts/content-os/`, run by Adel. **Not a web service, not a public endpoint, and never wired to auto-publish.** It emits a payload; a human reviews it; publishing is the same git commit and PR it is today.

Outputs go to:
- `payloads/*.json` — for template rendering
- `src/content/**/*.md` — a seeded draft with `draft: true` set, always, so nothing can reach the site without a person removing that line.

---

## 6 · Phasing

| phase | scope |
|---|---|
| 1 | schema + brand-rule validator + Markdown seeder. No generation — structure and checks only, which is where most of the value is. |
| 2 | analyze/classify assistance; drafted English structure; Arabic *briefs* only. |
| 3 | programmatic rendering from payloads into the Canva production system — a payload becomes an autofilled Canva brand template, never a hand-composed post. `V3_CANVA_PRODUCTION_SYSTEM.md` §5. Achievement cards are excluded: those are generated by the site from a verification row and never touch this pipeline. |
| 4 | batch: one project update → build log + carousel + reel cover in one pass. |
