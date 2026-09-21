# AdelTechTalks — Insta360 Luna Ultra Update Motion Carousel

Six independent 9:16 clips (1080 × 1920, 30 fps, 6–7 s each) plus a stitched preview, rendered from
`remotion-carousel/` (React + Remotion). Everything is editable in code; no binary project files.

## Files
- `carousel-plan.json` — the copy deck, media slots, per-slide scene type and duration (mirrored to `remotion-carousel/src/project.json`).
- `remotion-carousel/src/Carousel.tsx` — the six scenes (hook, zoom, stage, tracking, snapshot, audio_cta) and the shared chrome (index, eyebrow, media card, text block, signature).
- `remotion-carousel/public/media/` — official Insta360 slides + the two REAL-camera slots.
- `sfx/sfx-plan.json` + `sfx/mix.py` — the sound design: a synthesised SFX set (card air, pill pops, headline thud, reveal whoosh, counter riser + chime, tracking lock, shutter click) placed on the motion beats per clip and muxed into `exports/final/*.mp4` after the render (needs `numpy`). Drop a `sfx/bg-audio.mp3` to add a background audio file; it is ducked under the effects automatically.
- `remotion-carousel/public/fonts/` — self-hosted Readex Pro, Montserrat, JetBrains Mono (brand faces).
- Theme: AdelTechTalks light (`brand` block in `carousel-plan.json`): Warm White canvas `#FAFAF8`, white card, Graphite text `#171A1F`, Slate secondary `#667085`, Signature Blue `#2563EB` / Deep Blue `#1746A2` / Ice `#DCEBFF` pills, Mint `#2DD4A8` as the small accent, Soft Gray `#E6E8EC` hairlines.
- `exports/slides/01.mp4 … 06.mp4` — the deliverables. `exports/carousel-preview.mp4` — review only.

## Real-camera media (Adel's own shots)
- `media/real-hero-camera.jpg` — hero: close-up of the Luna Ultra with its screen reading "Updating firmware 11%", the phone soft at the edge (slide 1 opening and the slide 6 closing bookend).
- `media/real-01b-installing.jpg` — the camera screen "Updating firmware 14%" beside the phone's "Install new firmware" sheet at 65% (slide 1 reveal).
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
