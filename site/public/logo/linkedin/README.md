# LinkedIn Page logo

What LinkedIn asks for, and what is in this folder.

## The spec

| Slot | Size | Format |
| --- | --- | --- |
| Page logo | **300 × 300 px** square (268 × 268 minimum) | PNG, JPG or GIF, under 8 MB |
| Page cover | 1128 × 191 px | not built here |

LinkedIn takes that one square file and redraws it everywhere: roughly 130px on
the page header, ~48px beside a feed post, ~32px in a comment. So the file has
to survive being shrunk to a thumbnail. That is what decides the variants.

## Upload this one

**`linkedin-logo-300.png`** — the white mark on Purple 600.

Purple 600 is the LG v2.0 default mark colour, and a solid tile has no size
floor: it reads the same at 32px as at 300px. `linkedin-logo-400.png` is the
identical artwork rendered larger — upload that instead if you want the page
header a little crisper, since LinkedIn re-encodes whatever it is given.

## The alternatives

- **`linkedin-logo-impact-*.png`** — the three-stop brand gradient on Impact
  Navy, the same lockup as the app icon. ⚠️ `--atc-mark-min-gradient-size` is
  40px. The mark is 62% of the tile, so once LinkedIn draws this below ~65px —
  which is exactly what the feed does — the gradient is under its floor. Use it
  only if the page is deliberately run as a Dark Impact property.
- **`linkedin-logo-light-*.png`** — Purple 600 mark on white. Correct artwork,
  but it dissolves into LinkedIn's own white chrome, so it has no edges in the
  feed. Alternative, not default.

## Rules that are already baked in

- The tile is **full bleed, no corner radius**. LinkedIn masks and crops the
  square itself; rounded corners here would punch transparent notches into
  whatever sits underneath, including its dark mode.
- The mark geometry is read from `../atc-mark-currentcolor.svg` at build time —
  it is never redrawn, and never scaled non-uniformly.
- Clear space is checked, not assumed: LG v2.0 wants 23% of the mark's height
  on every side (35px at this size), and the layout leaves 74px top and bottom,
  57px either side. The build throws if that ever stops being true.

## Regenerating

    npm run logo:linkedin

Writes the SVG sources and the PNGs into this folder. Commit both.
