# v3.1 interactive prototype

`atc-v31-prototype.html` — self-contained, no build step, no network dependency
beyond Google Fonts. Open it in a browser.

Published copy: https://claude.ai/code/artifact/becad32a-445e-493b-a685-9a9eee36ca4b

**It is a prototype, not a component library.** Nothing in it is production code
and none of it should be lifted into `site/src`. Its job is to make the v3.1
decisions arguable by letting you operate them.

## What is actually interactive

| screen | what you can do |
|---|---|
| Homepage | scroll the four acts; the act strip tracks position; play the inline challenge in place |
| Prompt Arena | play all three formats end to end — Choose and Repair are graded, Create routes through self-assessment |
| Achievement | switch between the three achievement kinds; un-publish and re-publish and watch the URL survive |
| Navigation | open dropdowns by hover or click, Escape to close; switch to Mobile for the accordion |
| Motion | replay each act register; flip Motion to Reduced and replay to see the fallback |
| Publish flow | send seven requests at `/api/achievements/publish` and read the refusals |

Four global toggles apply across every screen: **Viewport** (1280 / 390),
**Language** (EN / AR·RTL), **Member state** (signed out / signed in), and
**Motion** (full / reduced).

## Things it deliberately does not fake

- The homepage renders in its **launch state**. Courses, Resources and the
  achievements wall are absent, not filled with examples.
- Bracketed placeholders — `[PROJECT NAME]`, `[TOOL NAME]` — are facts only Adel
  can supply.
- **Every Arabic string is a spacing placeholder** and the board says so in a
  banner that cannot be dismissed. Production Arabic is authored, never
  translated. KO Ghorab is self-hosted and cannot load here, so Arabic display
  falls back to Readex Pro; it renders in Ghorab in production.
- Member state starts at 235 XP so the first completion crosses the 250
  threshold and the level-up sequence is visible. That is a demo convenience and
  it is the only invented number in the prototype.

## Verified

17 browser checks pass against the built file, covering every flow above plus
horizontal-overflow at 1500 / 1100 / 420px and a clean console.
