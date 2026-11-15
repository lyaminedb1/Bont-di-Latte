"""Fabrique le symbole rond (favicon, petits formats) à partir de l'emblème « jet de lait »
du logo ovale. Usage : python3 scripts/make-symbol.py assets/img/logo-ovale.png assets/img/symbole.png"""
import sys
import numpy as np
from PIL import Image, ImageDraw

src, dst = sys.argv[1], sys.argv[2]
logo = Image.open(src).convert('RGBA')
W, H = logo.size
# Zone de l'emblème : centrée en haut de l'ovale
box = (int(W * 0.38), int(H * 0.06), int(W * 0.62), int(H * 0.33))
crop = np.array(logo.crop(box)).astype(np.float32)
navy = crop[..., :3].reshape(-1, 3)
navy = np.median(navy[navy.min(axis=1) < 120], axis=0)  # couleur du fond bleu du logo
whiteness = np.clip((crop[..., :3].min(axis=2) - 120) / (235 - 120), 0, 1)
# Ne garder que les formes blanches qui ne touchent pas les bords gauche/droit (les rubans)
mask = whiteness > 0.05
from collections import deque
h, w = mask.shape
seen = np.zeros_like(mask)
q = deque((y, x) for y in range(h) for x in (0, w - 1) if mask[y, x])
for y, x in q: seen[y, x] = True
while q:
    y, x = q.popleft()
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True; q.append((ny, nx))
whiteness[seen] = 0
whiteness[whiteness < 0.3] = 0  # supprime les petits parasites JPEG
emblem = np.zeros_like(crop)
emblem[..., :3] = 255
emblem[..., 3] = whiteness * 255
emblem = Image.fromarray(emblem.astype(np.uint8), 'RGBA')
emblem = emblem.crop(emblem.getbbox())

S = 1024
sym = Image.new('RGBA', (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(sym)
c = tuple(int(v) for v in navy) + (255,)
d.ellipse((8, 8, S - 8, S - 8), fill=c)
d.ellipse((56, 56, S - 56, S - 56), outline=(255, 255, 255, 255), width=18)
ew = int(S * 0.56)
emblem = emblem.resize((ew, int(emblem.height * ew / emblem.width)), Image.LANCZOS)
sym.alpha_composite(emblem, ((S - emblem.width) // 2, (S - emblem.height) // 2 - 10))
sym.save(dst)
print('ok', tuple(int(v) for v in navy), emblem.size)
