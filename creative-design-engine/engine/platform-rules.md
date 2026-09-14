# Platform rules

Generic platform behaviour. Concrete canvases, margins and reserves come from the **brand profile**, never from this file.

---

## What a platform profile must declare

```
canvas width / height · margin · safe reserves (top/bottom/side)
grid · centre-safe tile · provenance (audited or derived)
```

**Provenance is not optional.** Any value not taken from a measured source is marked derived and validation-required. A confidently-stated invented dimension is worse than an admitted gap.

## The four behaviours that actually change composition

1. **Chrome reserve.** Platform UI covering part of the frame — a duration pill, a caption band, a right-hand action rail. Content may bleed through; nothing that must be read may sit inside it.
2. **Preview crop.** Many surfaces show a *different shape* in a grid or feed than the one you upload — typically a square. **Anything that must survive lives inside the centre-safe tile.** This is the most commonly missed rule and the most expensive.
3. **Display size.** The real judgement happens at feed size on a phone, not at full size on a desktop. Every direction is checked there.
4. **Orientation.** A vertical version is **recomposed** — subject, crop, text, placement, safe zones all re-decided. It is never a centre-crop of the horizontal master, for the same reason a photograph is not improved by cropping it in half.

## Multiple valid crops

Where a surface has several display behaviours, **document the safe composition** — what must survive any of them — rather than asserting one universal crop. One false crop applied everywhere is worse than an honest constraint.

## Static, carousel and motion

- **Static** — one frame does all the work; the beat must resolve instantly.
- **Carousel** — each slide must read alone, because slides are re-shared individually. One idea per slide.
- **Motion** — the first frame is still a thumbnail and is judged as one. Motion adds a reveal *over time*; it does not rescue a composition that fails as a still.
