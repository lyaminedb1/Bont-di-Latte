#!/usr/bin/env bash
# Compresse les vidéos Higgsfield de assets/video/ vers public/video/.
#   - H.264 MP4 (faststart) + WebM VP9, sans piste audio, 1080p maximum
#   - image poster .webp tirée de la DERNIÈRE image de chaque vidéo
# Usage : npm run videos      (ffmpeg doit être installé)
# Variables optionnelles : HERO_KBPS (débit cible du héros, défaut 1400 kb/s)
set -euo pipefail

SRC="assets/video"
OUT="public/video"
mkdir -p "$OUT"
command -v ffmpeg >/dev/null || { echo "ffmpeg introuvable : installez-le (brew/apt/choco install ffmpeg)."; exit 1; }

HERO_KBPS="${HERO_KBPS:-1400}"   # ~1,4 Mb/s ≈ 1,8 Mo pour 10 s : sous la cible de 2,5 Mo
LOOP_KBPS="${LOOP_KBPS:-1100}"

shopt -s nullglob
found=0
for input in "$SRC"/*.mp4 "$SRC"/*.mov; do
  found=1
  name="$(basename "${input%.*}")"
  case "$name" in hero-*) kbps="$HERO_KBPS" ;; *) kbps="$LOOP_KBPS" ;; esac

  # Limite à 1080 px sur le petit côté (16:9 → 1920×1080, 9:16 → 1080×1920), sans agrandir.
  scale="scale='if(gt(iw,ih),-2,min(1080,iw))':'if(gt(iw,ih),min(1080,ih),-2)':flags=lanczos"
  echo "▶ $name  (${kbps} kb/s)"

  # MP4 H.264 en deux passes pour tenir le poids cible.
  ffmpeg -y -loglevel error -i "$input" -an -vf "$scale,fps=30" -c:v libx264 -preset slow \
    -b:v "${kbps}k" -pass 1 -passlogfile "/tmp/bdl-$name" -f mp4 /dev/null
  ffmpeg -y -loglevel error -i "$input" -an -vf "$scale,fps=30" -c:v libx264 -preset slow \
    -b:v "${kbps}k" -maxrate "$((kbps * 2))k" -bufsize "$((kbps * 2))k" -pass 2 -passlogfile "/tmp/bdl-$name" \
    -pix_fmt yuv420p -profile:v high -movflags +faststart "$OUT/$name.mp4"

  # WebM VP9 (souvent 20–30 % plus léger).
  vp9=$((kbps * 8 / 10))
  ffmpeg -y -loglevel error -i "$input" -an -vf "$scale,fps=30" -c:v libvpx-vp9 -b:v "${vp9}k" \
    -deadline good -cpu-used 2 -row-mt 1 -pass 1 -passlogfile "/tmp/bdl-$name-vp9" -f webm /dev/null
  ffmpeg -y -loglevel error -i "$input" -an -vf "$scale,fps=30" -c:v libvpx-vp9 -b:v "${vp9}k" \
    -deadline good -cpu-used 2 -row-mt 1 -pass 2 -passlogfile "/tmp/bdl-$name-vp9" "$OUT/$name.webm"

  # Poster : dernière image (le logo final pour le héros).
  ffmpeg -y -loglevel error -sseof -0.1 -i "$input" -frames:v 1 -update 1 -vf "$scale" -c:v libwebp -quality 80 "$OUT/$name.webp"

  rm -f /tmp/bdl-"$name"*
  printf "  mp4 %s · webm %s · poster %s\n" \
    "$(du -h "$OUT/$name.mp4" | cut -f1)" "$(du -h "$OUT/$name.webm" | cut -f1)" "$(du -h "$OUT/$name.webp" | cut -f1)"
done

[ "$found" = 1 ] || echo "Aucune vidéo dans $SRC/ (attendu : hero-16x9.mp4, hero-9x16.mp4, filage.mp4, produit.mp4)."
echo "Terminé. Relancez « npm run build » : le site détecte automatiquement les vidéos présentes."
