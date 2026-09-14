#!/usr/bin/env bash
# Regenerate the synthetic ASMR test project used to validate the pipeline.
#
# There is NO ASMR footage in this repository. These clips are synthetic: the
# audio is decaying transient bursts separated by silence, which is the exact
# structure the analyser looks for. Clip 03 is 16:9 on purpose, to exercise the
# recomposition path. Clip 04 carries a long silent stretch, to exercise real
# dead-time removal.
#
# This validates the PIPELINE. It does not validate creative judgement on real
# tactile footage — that still needs real footage.
#
# usage: bash templates/asmr-test-project.sh <workdir>
set -euo pipefail
W="${1:?usage: asmr-test-project.sh <workdir>}"; mkdir -p "$W/raw"; cd "$W/raw"
ffmpeg -v error -f lavfi -i "testsrc2=size=1080x1920:rate=30:duration=9" \
  -f lavfi -i "aevalsrc='0.55*random(0)*exp(-9*mod(t,1.8))':s=48000:d=9" \
  -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 256k -shortest -y 01-sealed-box.mp4
ffmpeg -v error -f lavfi -i "smptebars=size=1080x1920:rate=30:duration=10" \
  -f lavfi -i "aevalsrc='0.62*random(0)*exp(-14*mod(t,1.1))':s=48000:d=10" \
  -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 256k -shortest -y 02-peel-open.mp4
ffmpeg -v error -f lavfi -i "testsrc2=size=1920x1080:rate=30:duration=8" \
  -f lavfi -i "aevalsrc='0.5*random(0)*exp(-20*mod(t,2.6))':s=48000:d=8" \
  -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 256k -shortest -y 03-macro-detail.mp4
ffmpeg -v error -f lavfi -i "testsrc2=size=1080x1920:rate=30:duration=12" \
  -f lavfi -i "aevalsrc='0.6*random(0)*exp(-14*mod(t,0.9))*(lt(t,3)+gt(t,8))':s=48000:d=12" \
  -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 256k -shortest -y 04-handling.mp4
echo "✓ 4 synthetic clips in $W/raw"
