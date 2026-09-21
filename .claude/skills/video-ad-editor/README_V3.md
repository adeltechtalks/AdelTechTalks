# Video Ad Editor v3.1 — AdelTechTalks Creative Video Engine

Backward-compatible upgrade of the original v2/v3 skill.

## Supported production formats
- Talking Head / Reel (existing v2 pipeline retained)
- ASMR / Product Unboxing with recorded mic/product audio preserved
- Motion Carousel: 5–6 independent ~5-second MP4 slides + stitched preview
- Product Comparison
- Product Demo / Feature Spotlight
- Mixed talking-head + product B-roll

## v3.1 additions
- Motion Carousel format contract and plan schema.
- Dedicated Remotion motion-carousel renderer (`15_motion_carousel.sh`).
- Individual MP4 slide export plus stitched preview.
- ASMR audio policy explicitly keeps mic/product audio ON; no default denoise, gate, compression, or loudness normalization.
- Selectable audio stream and tiny configurable boundary fade for ASMR segments.
- Explicit comparison/demo format contracts.
- Figma-first brand contract remains the shared design authority.

## Recommended Claude Code install
For this project only, place the entire folder at:
`.claude/skills/video-ad-editor/`

For a personal skill available across projects, place it at:
`~/.claude/skills/video-ad-editor/`

The skill folder must keep `SKILL.md`, `scripts/`, `formats/`, `templates/`, `brand/`, and approved `assets/` together.
