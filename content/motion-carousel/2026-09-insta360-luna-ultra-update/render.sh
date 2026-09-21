#!/bin/bash
# Renders the six 9:16 clips + a stitched preview. Run from this folder after `cd remotion-carousel && npm install`.
set -e; HERE="$(cd "$(dirname "$0")" && pwd)"; cd "$HERE/remotion-carousel"; mkdir -p "$HERE/exports/slides"
N=$(node -e "console.log(require('./src/project.json').slides.length)")
for ((i=1;i<=N;i++)); do ID=$(printf 'Slide%02d' $i); npx remotion render "$ID" "$(printf '%s/exports/slides/%02d.mp4' "$HERE" $i)" --codec h264 --crf 18; done
npx remotion render Carousel "$HERE/exports/carousel-preview.mp4" --codec h264 --crf 20
echo "Ready: $HERE/exports"
