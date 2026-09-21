# AdelTechTalks — Insta360 Luna Ultra Update Motion Carousel

Six independent 9:16 clips (1080 × 1920, 30 fps, 6–7 s each) plus a stitched preview, rendered from
`remotion-carousel/` (React + Remotion). Everything is editable in code; no binary project files.

## Files
- `carousel-plan.json` — the copy deck, media slots, per-slide scene type and duration (mirrored to `remotion-carousel/src/project.json`).
- `remotion-carousel/src/Carousel.tsx` — the six scenes (hook, zoom, stage, tracking, snapshot, audio_cta) and the shared chrome (index, eyebrow, media card, text block, signature).
- `remotion-carousel/public/media/` — official Insta360 slides + the two REAL-camera slots.
- `remotion-carousel/public/fonts/` — self-hosted Readex Pro, Montserrat, JetBrains Mono (brand faces).
- `exports/slides/01.mp4 … 06.mp4` — the deliverables. `exports/carousel-preview.mp4` — review only.

## Real-camera media (Adel's own shots)
- `media/real-01-camera.jpg` — wide: Luna Ultra sharp in front, the phone soft behind it showing "Firmware downloading" (slide 1 opening).
- `media/real-01b-installing.jpg` — the camera screen "Updating firmware 14%" beside the phone's "Install new firmware" sheet at 65% (slide 1 reveal).
- `media/real-06-camera.jpg` — close-up of the camera with the firmware notes on the phone (slide 6 closing).
Swap any of them by replacing the file; adjust the `crop` values in `Hook` / `AudioCta` if the framing changes.

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
