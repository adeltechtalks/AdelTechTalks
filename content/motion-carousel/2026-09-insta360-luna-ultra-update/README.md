# AdelTechTalks — Insta360 Luna Ultra Update Motion Carousel

Six independent 9:16 clips (1080 × 1920, 30 fps, 6–7 s each) plus a stitched preview, rendered from
`remotion-carousel/` (React + Remotion). Everything is editable in code; no binary project files.

## Files
- `carousel-plan.json` — the copy deck, media slots, per-slide scene type and duration (mirrored to `remotion-carousel/src/project.json`).
- `remotion-carousel/src/Carousel.tsx` — the six scenes (hook, zoom, stage, tracking, snapshot, audio_cta) and the shared chrome (index, eyebrow, media card, text block, signature).
- `remotion-carousel/public/media/` — official Insta360 slides + the two REAL-camera slots.
- `remotion-carousel/public/fonts/` — self-hosted Readex Pro, Montserrat, JetBrains Mono (brand faces).
- `exports/slides/01.mp4 … 06.mp4` — the deliverables. `exports/carousel-preview.mp4` — review only.

## The two real-camera slots (not yet filled)
No connected source (Drive, Canva, Lightroom) held a photo or clip of Adel's Luna Ultra or its firmware
screen, so `media/real-01-camera.jpg` (slide 1) and `media/real-06-camera.jpg` (slide 6) currently hold
the official cover render as a placeholder. To make the series personal:
1. Drop the real photo(s) over those two files (any size; the scene crops with `crop` in `Carousel.tsx`).
2. Adjust the `crop` values in the `Hook` and `AudioCta` scenes if the framing needs it.
3. `bash render.sh`.

## Render
```
cd remotion-carousel && npm install
bash ../render.sh        # → exports/slides/*.mp4 + exports/carousel-preview.mp4
npx remotion studio      # live editing
```
Chrome: `remotion.config.ts` points at the Playwright headless shell; on a laptop remove that line.

## Copy rules honoured
Every feature is presented as part of the official update ("جديد في التحديث", "من ضمن الحاجات الجديدة")
— nothing says or implies Adel tested it. Feature names stay in English; Arabic is RTL-first with
mixed lines rendered in an RTL paragraph so English terms sit inside the Arabic sentence.
