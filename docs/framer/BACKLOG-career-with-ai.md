# Backlog — "Career with AI"

**Status: LOGGED ONLY. Not implemented anywhere.**
Recorded during the `/now` redesign pass. `/now` was not changed for it, and no
top-level navigation item was created.

---

## What it is

A practical content **series / collection**: how to use AI to improve your
career — find opportunities, build the skills you need, and prepare for the
future of work.

### Example content

- Build or improve your CV with AI
- Tailor a CV to a specific job description with AI
- Find jobs using AI
- Find internships using AI
- Prepare for interviews with AI
- Use AI to identify career gaps
- Use AI to build a personalised learning roadmap
- Best / fastest-growing AI jobs
- Qualifications needed for specific AI roles
- Courses to prepare for AI careers
- Certifications and free AI certificates
- Build a portfolio with AI
- Build a personal website using Vibe Coding
- Automate parts of the job-search process
- Career transition into Product / AI / Tech roles

---

## Architecture intent

**Career with AI is NOT a fifth core Learn skill.** The four core Learn skills
are unchanged:

- Prompting
- Vibe Coding
- Vibe Designing
- AI Workflows & Automation

Career with AI is a **series / collection that pulls content from those
skills** rather than sitting beside them:

| Piece of career content        | Core skill it draws on     |
| ------------------------------ | -------------------------- |
| CV prompt                      | Prompting                  |
| AI-built portfolio website     | Vibe Coding                |
| Portfolio / resume presentation| Vibe Designing             |
| Automated job search           | AI Workflows & Automation  |

---

## Where the content surfaces

| Kind of content | Home |
| --- | --- |
| **Current / fast-moving** — top AI jobs right now, new career trends, newly available certifications, current internships and opportunities, major changes in AI hiring | `/now`, when appropriate |
| **Evergreen education** — tutorials and guides | `/learn`, primarily |
| **Downloadable material** — prompts, templates, CV checklists, career roadmaps, certificate lists | `/resources` |

---

## When to build it

After `/now` is complete. Career with AI gets incorporated properly while
`/learn` and `/resources` are designed — not before, and not by bolting a
collection onto `/now`.

## DECIDED — the grouping model

Settled while building `/learn`. **Career with AI is a cross-cut, not a
grouping.** A record joins it by carrying a reserved, namespaced value on the
**existing `tags` field**:

    series:career-with-ai

Nothing was added to the TYPE table, the TOPIC table, the record schema, or
the shared Worker contract.

**Why a namespaced tag and not a topic or a type**

- A series pulls *from* the four skills, so it cannot be a fifth skill — and
  on `/learn`, topic **is** the skill.
- A record keeps its real type and its real topic. A CV prompt is still a
  `Prompt` on `Prompting`; the series is an extra membership, not a
  reclassification. One record can sit in a series and a skill at once.
- `tags` already exists in the record, in the Framer array control, and in the
  Worker reader. A record with no series tag is entirely unaffected.
- The `series:` namespace cannot collide with a display tag, and the UI strips
  the prefix, so it never leaks into a label.
- A future series (Creator With AI, Build a Business With AI, AI at Work, AI
  for Students) is **one array entry** — no code, no schema, no migration.

Implemented in the `LearnHub` Framer component as `SERIES_PREFIX`,
`inSeries()` and `displayTags()`. The `SERIES` array drives the presentation,
so the section was never hardcoded to a single collection.

## Current state

The series renders as a **developmental shell**: it names itself, states its
purpose, and shows what it draws from each of the four skills — with an
"In development" mark, because no career content is written yet. The mark
disappears on its own as soon as a record carries the tag. Nothing claims a
library that does not exist.
