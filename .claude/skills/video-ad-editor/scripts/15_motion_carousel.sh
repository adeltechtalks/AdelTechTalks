#!/bin/bash
# Motion carousel renderer: 5s-ish MP4 per slide + stitched preview.
# Usage: bash scripts/15_motion_carousel.sh <work> setup|studio|render
set -euo pipefail
W="$(cd "$1" && pwd)"; CMD="${2:-setup}"
TPL="$(cd "$(dirname "$0")/motion-carousel-template" && pwd)"; R="$W/remotion-carousel"; PLAN="$W/carousel-plan.json"
[ -f "$PLAN" ] || { echo "Missing $PLAN"; exit 2; }

sync_all(){
  mkdir -p "$R/src" "$R/public"
  cp "$TPL/package.json" "$TPL/tsconfig.json" "$TPL/remotion.config.ts" "$R/"
  cp "$TPL/src/index.ts" "$TPL/src/Root.tsx" "$TPL/src/Carousel.tsx" "$R/src/"
  cp "$PLAN" "$R/src/project.json"
  rm -rf "$R/public/media" "$R/public/assets"; mkdir -p "$R/public/media" "$R/public/assets"
  [ -d "$W/media" ] && cp -R "$W/media/." "$R/public/media/"
  [ -d "$W/assets" ] && cp -R "$W/assets/." "$R/public/assets/"
  echo "Synced motion carousel project."
}

case "$CMD" in
  setup)
    sync_all
    if [ ! -d "$R/node_modules" ]; then (cd "$R" && npm install --silent); fi
    echo "Ready: $R";;
  studio)
    sync_all; [ -d "$R/node_modules" ] || (cd "$R" && npm install --silent)
    (cd "$R" && npx remotion studio);;
  render)
    sync_all; [ -d "$R/node_modules" ] || (cd "$R" && npm install --silent)
    mkdir -p "$W/exports/slides"
    COUNT=$(python3 - <<PY
import json
p=json.load(open('$PLAN')); print(len(p.get('slides',[])))
PY
)
    (cd "$R" && npx remotion render Carousel "$W/exports/carousel-preview.mp4" --codec h264 --crf 18)
    for ((i=1;i<=COUNT;i++)); do ID=$(printf 'Slide%02d' "$i"); OUT=$(printf '%s/exports/slides/%02d.mp4' "$W" "$i"); (cd "$R" && npx remotion render "$ID" "$OUT" --codec h264 --crf 18); done
    echo "Ready: $W/exports/carousel-preview.mp4 and $W/exports/slides/*.mp4";;
  *) echo "Use setup | studio | render"; exit 2;;
esac
