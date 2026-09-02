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

## Notes for whoever picks this up

- The existing content model already carries what a collection needs: every
  record has a **type**, a **topic** and free-form **tags**. A series is most
  likely a view over that model — the same "one list, many groupings" approach
  `/now` uses — rather than a new content store.
- Do not add a `career` value to the TYPE or TOPIC tables without deciding
  first whether the series is a grouping (topic/type) or a cross-cut (tag).
  Those are different answers with different consequences for `/now`'s
  sections and for the shared Worker contract.
