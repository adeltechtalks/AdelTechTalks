# Asset rules

The one rule everything else follows: **never invent media availability.**

---

## Declaring assets

An asset manifest lists what exists, one entry per usable frame:

```json
{ "id": "portrait-01", "kind": "portrait", "path": "...", "notes": "close, eye contact, mixed lighting",
  "quality": "production", "usableFor": ["face-dominant", "face+product"] }
```

`kind`: portrait · product · products · cutout · screenshot · ui · video-frame · environment · broll · graphic · none
`quality`: production · usable · reference · placeholder

## Rules

1. **No entry, no asset.** The engine may not propose a direction requiring imagery the manifest does not list.
2. **A placeholder is not an asset.** It may appear in a composition being reviewed, clearly labelled, but a direction built on one is **composition-approved, media-blocked** — never "finished".
3. **Two frames are not a comparison** unless scale, angle and lighting match. State the mismatch rather than cropping around it.
4. **Never duplicate one frame into a two-frame composition.** A comparison between a picture and itself is a lie.
5. **A video frame is a still with a quality penalty.** Assume nothing about extraction unless the manifest declares the frame exists.
6. **Say when the honest answer is "no image".** Type-led directions are legitimate work, not a fallback.

## When assets are thin

Prefer strategies that need one frame or none: hero object with a hook, editorial type, number impact, poster mode. Name the missing asset as a dependency so it can be sourced, and keep the composition final so only the image is pending.

## Quality notes that change the choice

A photo's *content* constrains the composition as much as its existence:

- Text over an image needs a region that is calm and tonally consistent.
- Annotation needs an identifiable focal point.
- A cutout needs a subject separable from its ground.
- A full-bleed subject needs resolution to survive the crop without upscaling.

Record these in `notes`. A photo that cannot give a composition what it needs is the wrong photo for it — not a reason to weaken the composition.
