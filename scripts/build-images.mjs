// Génère les déclinaisons web des logos à partir des fichiers sources de assets/img/.
// Usage : npm run images   (à relancer seulement si les logos changent)
import sharp from 'sharp';
import { mkdir, copyFile } from 'node:fs/promises';

const SRC_OVALE = 'assets/img/logo-ovale.png'; // détouré depuis logo-ovale-original.jpg (scripts/cutout-logo.py)
const SRC_SYMBOLE = 'assets/img/symbole.png';
const OUT = 'public/img';
const MILK = '#F5F8FC';

await mkdir(OUT, { recursive: true });

// Logo ovale : on rogne la marge transparente puis on décline en 3 largeurs.
const ovale = sharp(SRC_OVALE).trim();
for (const w of [480, 720, 960]) {
  await ovale.clone().resize({ width: w }).webp({ quality: 88, alphaQuality: 90 }).toFile(`${OUT}/logo-ovale-${w}.webp`);
}
await ovale.clone().resize({ width: 960 }).png({ compressionLevel: 9, palette: true }).toFile(`${OUT}/logo-ovale-960.png`);

// Symbole rond : petits formats + icônes.
const symbole = sharp(SRC_SYMBOLE).trim();
for (const w of [96, 192, 384]) {
  await symbole.clone().resize({ width: w }).webp({ quality: 90 }).toFile(`${OUT}/symbole-${w}.webp`);
}
await symbole.clone().resize(32).png().toFile('public/favicon-32.png');
await symbole.clone().resize(192).png().toFile('public/icon-192.png');
await symbole.clone().resize(512).png().toFile('public/icon-512.png');
// Icône Apple : fond blanc lait (iOS n'aime pas la transparence).
await sharp({ create: { width: 180, height: 180, channels: 4, background: MILK } })
  .composite([{ input: await symbole.clone().resize(156).png().toBuffer(), gravity: 'center' }])
  .png().toFile('public/apple-touch-icon.png');

// Image de partage Open Graph 1200×630 : logo sur fond blanc lait + filet vert-blanc-rouge.
const band = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect x="0" y="606" width="400" height="24" fill="#1E7B4A"/>
  <rect x="400" y="606" width="400" height="24" fill="#FFFFFF"/>
  <rect x="800" y="606" width="400" height="24" fill="#D42A2F"/>
  <rect x="0" y="605" width="1200" height="1" fill="#E2D5C0"/>
</svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 4, background: MILK } })
  .composite([
    { input: await ovale.clone().resize({ width: 940 }).png().toBuffer(), gravity: 'center' },
    { input: band, top: 0, left: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile('assets/img/og-image.png');
await copyFile('assets/img/og-image.png', 'public/og-image.png');

console.log('Images générées dans public/ et assets/img/og-image.png');
