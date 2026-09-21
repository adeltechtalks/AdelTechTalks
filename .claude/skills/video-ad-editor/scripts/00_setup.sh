#!/bin/bash
# Setup checker for Video Editor v3.
#   ./00_setup.sh                     -> talking-head/full mode (backward compatible)
#   ./00_setup.sh --mode asmr         -> ASMR/unboxing mode (ffmpeg only)
#   ./00_setup.sh --install [--mode asmr]
INSTALL=0
MODE="full"
while [ $# -gt 0 ]; do
  case "$1" in
    --install) INSTALL=1 ;;
    --mode) shift; MODE="${1:-full}" ;;
  esac
  shift
done
MISS=(); OK=(); NOTE=()
have(){ command -v "$1" >/dev/null 2>&1; }
line(){ printf '%s\n' "$1"; }

have ffmpeg && OK+=("ffmpeg") || MISS+=("ffmpeg")
have ffprobe && OK+=("ffprobe") || MISS+=("ffprobe")

if [ "$MODE" != "asmr" ]; then
  python3 -c "import whisper" 2>/dev/null && OK+=("whisper") || MISS+=("whisper")
  python3 -c "import numpy" 2>/dev/null && OK+=("numpy") || MISS+=("numpy")
  CHROME="${CHROME_PATH:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
  [ -x "$CHROME" ] && OK+=("chrome") || MISS+=("chrome")
  node -e "require.resolve('puppeteer-core')" 2>/dev/null && OK+=("puppeteer-core") || MISS+=("puppeteer-core")
fi

line "الوضع: $MODE"
line "الجاهز: ${OK[*]:-لا شيء}"
if [ "$MODE" != "asmr" ]; then
  if have npm; then line "شاشة التعديل المباشر: متاحة عند الطلب — 04b_remotion.sh setup ينزّل مكتباتها أول مرة"
  else line "شاشة التعديل المباشر: تحتاج npm — المحرّك الخفيف يظل شغال"; fi
fi
if [ ${#MISS[@]} -eq 0 ]; then line "✅ كل شي جاهز — نقدر نبدأ."; exit 0; fi
line "الناقص: ${MISS[*]}"

if [ $INSTALL -eq 0 ]; then line "شغّل نفس الفحص مع --install بعد موافقة المستخدم"; exit 10; fi

for m in "${MISS[@]}"; do
  case "$m" in
    ffmpeg|ffprobe)
      if have brew; then line "⏬ ffmpeg…"; brew install ffmpeg || NOTE+=("ffmpeg فشل")
      else NOTE+=("لازم Homebrew أول") ; fi ;;
    whisper) line "⏬ speech transcription model tools…"
      pip3 install --quiet openai-whisper || pip3 install --quiet --break-system-packages openai-whisper || NOTE+=("whisper فشل") ;;
    numpy) pip3 install --quiet numpy || pip3 install --quiet --break-system-packages numpy || NOTE+=("numpy فشل") ;;
    puppeteer-core) line "⏬ frame renderer…"; npm i --silent puppeteer-core || NOTE+=("renderer فشل") ;;
    chrome) NOTE+=("Chrome غير منصّب أو CHROME_PATH غير محدد") ;;
  esac
done

FAIL=0
have ffmpeg || FAIL=1
have ffprobe || FAIL=1
if [ "$MODE" != "asmr" ]; then
  python3 -c "import whisper,numpy" 2>/dev/null || FAIL=1
  [ -x "$CHROME" ] || FAIL=1
  node -e "require.resolve('puppeteer-core')" 2>/dev/null || FAIL=1
fi
[ ${#NOTE[@]} -gt 0 ] && printf '⚠️  %s\n' "${NOTE[@]}"
[ $FAIL -eq 0 ] && line "✅ كل شي جاهز الحين." || { line "❌ باقي ناقص — شوف الملاحظات فوق."; exit 11; }
