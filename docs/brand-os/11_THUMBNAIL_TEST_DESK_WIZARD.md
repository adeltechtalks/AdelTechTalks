# Thumbnail System test — desk wizard

> **✅ FINAL APPROVED** as part of the locked Phase 2B system (2026-09-14). Frozen; not reopened without a genuine implementation blocker.

**A quality test of the Thumbnail System against a real, ordinary subject**: a Funko-style wizard collectible on Adel's desk. Not a poster, not a branded card — three YouTube masters that have to survive a feed.
**Source image:** a real photograph supplied by Adel (2256 × 2504, phone capture, letterboxed). **No placeholder anywhere in this test.**
**Platform:** YouTube 16:9 master, 1280 × 720, from the audited `Thumb 16:9` profile. Feed preview at 380 px in dark chrome.

---

## 1 · What the system had to solve

The photograph is portrait, letterboxed with black bars down both sides, and shot with heavy purple/magenta practical lighting. Three constraints came straight out of that:

1. **The bars had to be cropped out.** Usable image is `x 0.085 → 0.915`, so any 16:9 crop rect must be **at least 1542 px wide** and offset so both bars fall outside the frame. Every direction below satisfies that; it is arithmetic, not taste.
2. **A 16:9 crop of a portrait photo cannot hold everything.** With the bars gone it is impossible to show the top of the bookshelf *and* the figure's feet. Each direction therefore decides what it is about and crops for that, rather than compromising into a wide, empty middle.
3. **The lighting was already on-brand.** The scene's purples and magentas sit inside the approved Expressive range, so no tint, no colour overlay and no gradient were added. The only treatment is a **global grade** (0.30–0.34 graphite over the whole frame) for text contrast — never a panel.

## 2 · The three directions

### A — OBJECT DOMINANT · "DESK WIZARD"
The figure runs nearly the full height of the frame and bleeds off the bottom edge; the books and succulent fall away into bokeh behind it. Hook bottom-left on the darkest quarter of the image, watermark in the opposite corner. **No annotation** — the subject is already the whole point, and a circle would only be pointing at the thing that fills the frame.

**Why it works:** one subject, one focal point, maximum scale. It is the most legible of the three at feed size because the face is large enough to survive any crop a platform applies.

### B — STORY / CURIOSITY · "مين بيدير المكتب؟" (who runs the desk?)
Pulls back so the desk reads as a workspace: bookshelf, succulent, wall art, the figure standing among them. The hook asks a question and **the drawn arrow answers it** by landing on the figure — that is the annotation rule working, not an annotation demo.

**Why it works:** the question plus the arrow makes a joke the viewer completes themselves, which is what curiosity actually is. It is also the only direction that sells the *workspace*, not just the object.

### C — FUN / CREATOR · "المدير الجديد" (the new manager)
Playful. The head is circled and labelled **CEO** in the approved Caveat sketch face. Arabic hook, Latin handwritten term — which is the language rule, and also the only kind of handwriting available, since Caveat carries no Arabic glyphs.

**Why it works:** it has a punchline. It is the most social-friendly and the most obviously creator-made rather than produced.

## 3 · Recommendation

**Lead with B.** It is the strongest *thumbnail* rather than the strongest *picture*: the hook poses a question, the arrow answers it, and the workspace context gives the viewer a reason to care about a toy. A and C are both one-note by comparison — A is a beautiful object shot with a label, C is a joke that lands once.

Run **A as the A/B test against it**, because it is the safest at small sizes and the least dependent on reading Arabic. Keep **C for Shorts and social**, where a punchline travels better than a question.

Ranking at 380 px: **B > A > C.** C loses a little because the circle and the handwriting are two elements competing in a small frame.

## 4 · Copy

All three are 2–4 words and none repeats a video title:

| | Hook | Words |
|---|---|---|
| A | DESK WIZARD | 2 |
| B | مين بيدير المكتب؟ | 3 |
| C | المدير الجديد | 2 |

`Funko`, `Desk Setup`, `Desk Tour` and `CEO` stay English in the titles and the handwriting, per the approved language rule.

## 5 · One system constraint this test exercised

`DESK WIZARD` at the full Impact tier (Montserrat Black 140) needs a ~840 px column for the word `WIZARD`, which would have pushed the figure out of its own thumbnail. The hook was set at **96 / 90** instead. This is exactly the `impact-hook-current-style-constraint` behaving as documented: a setting to check per composition, **not** a universal rule that thumbnail columns need short words.

## 6 · Evidence

| File | Shows |
|---|---|
| `evidence/thumb_desk_A_object-dominant.png` | A, full size |
| `evidence/thumb_desk_B_story-curiosity.png` | B, full size |
| `evidence/thumb_desk_C_fun-creator.png` | C, full size |
| `evidence/thumb_desk_feed-preview.png` | all three at 380 px in dark feed chrome |

## 7 · Note

This test used a real subject and a real photograph end to end. It is the first piece of the Thumbnail System proven without a single placeholder, and it did not require the foldable imagery that Directions A and C of the Fold-First test are still waiting on.
