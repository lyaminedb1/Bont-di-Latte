"""Détoure un logo sur fond blanc : seul le blanc relié aux bords devient transparent
(le blanc à l'intérieur de l'ovale est conservé). Usage : python3 scripts/cutout-logo.py entree.jpg sortie.png"""
import sys
from collections import deque
import numpy as np
from PIL import Image, ImageFilter

src, dst = sys.argv[1], sys.argv[2]
rgb = np.array(Image.open(src).convert('RGB')).astype(np.int16)
h, w, _ = rgb.shape
minc = rgb.min(axis=2)
light = minc > 225  # fond blanc (avec tolérance JPEG)

bg = np.zeros((h, w), bool)
q = deque()
for x in range(w):
    for y in (0, h - 1):
        if light[y, x] and not bg[y, x]:
            bg[y, x] = True; q.append((y, x))
for y in range(h):
    for x in (0, w - 1):
        if light[y, x] and not bg[y, x]:
            bg[y, x] = True; q.append((y, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < h and 0 <= nx < w and light[ny, nx] and not bg[ny, nx]:
            bg[ny, nx] = True; q.append((ny, nx))

alpha = np.where(bg, 0, 255).astype(np.float32)
# Bord anti-crénelé : sur une bande de 3 px autour du fond, alpha selon la « non-blancheur »
fg = Image.fromarray((~bg).astype(np.uint8) * 255)
band = (np.array(fg.filter(ImageFilter.MaxFilter(7))) > 0) & (np.array(fg.filter(ImageFilter.MinFilter(7))) == 0)
soft = np.clip((255 - minc) / (255 - 90), 0, 1) * 255
alpha[band] = soft[band]

out = rgb.copy()
# Les pixels de bord prennent la couleur du filet bleu pour éviter un halo blanc
navy = np.array([5, 40, 105])
edge = band & (alpha < 250)
out[edge] = navy
img = Image.fromarray(np.dstack([out.clip(0, 255).astype(np.uint8), alpha.astype(np.uint8)]), 'RGBA')
img = img.crop(img.getbbox())
img.save(dst)
print('ok', img.size)
