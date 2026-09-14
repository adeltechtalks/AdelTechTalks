# /screen-within-screen

**Show content displayed on a device inside the frame, so context and content are visible at once.**

| | |
|---|---|
| Mode | Both |
| Best story beats | demonstration, proof, transformation |
| Best content types | device reviews, format explainers, app demos, cross-device stories |
| Required assets | a device frame and the content that appears on it |
| Optional assets | a hand, an environment |
| Max combinations | one supporting skill — usually `/feature-callout` |

## When to use it
It matters that the content is on *that* device — format, size and context are part of the argument.

## When NOT to use it
The device is irrelevant to the point. A device frame used as decoration shrinks the content for nothing.

## Composition logic
The screen contents must be legible at the final display size; if they are not, the device frame is costing more than it buys. The device is large enough that its screen is the real subject.

## Motion logic
Content plays inside the screen while the device stays still. Moving both competes.

## Brand OS rules
Device frames stay neutral and real. No invented product renders — if no device imagery exists, say so.

## Platform considerations
Costly at feed size: a screen inside a frame inside a feed thumbnail is three levels of shrinking. Prefer `/floating-ui` there.

## Arabic / English considerations
On-screen language may differ from the copy language; do not fake a localised screenshot.

## Example
A phone held in frame, the same composition visible on its screen in a different aspect ratio.

## Anti-patterns
A tiny screen inside a large bezel · a fake device outline · stacking a third screen inside the second.
