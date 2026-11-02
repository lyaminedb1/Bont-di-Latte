import { existsSync } from 'node:fs';
import { join } from 'node:path';

/** Vidéo compressée disponible dans public/video/ (détectée au moment du build). */
export type VideoSet = { mp4: string; webm?: string; poster?: string };

export function findVideo(name: string): VideoSet | null {
  const dir = join(process.cwd(), 'public', 'video');
  const has = (ext: string) => existsSync(join(dir, `${name}.${ext}`));
  if (!has('mp4')) return null;
  return {
    mp4: `/video/${name}.mp4`,
    webm: has('webm') ? `/video/${name}.webm` : undefined,
    poster: has('webp') ? `/video/${name}.webp` : undefined,
  };
}
