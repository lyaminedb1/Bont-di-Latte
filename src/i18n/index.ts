import { fr, type Dict } from './fr';
import { ar } from './ar';

export type Lang = 'fr' | 'ar';
export const dicts: Record<Lang, Dict> = { fr, ar };
export const t = (lang: Lang) => dicts[lang];
/** Chemin d'une page dans une langue donnée (« / » ou « /ar/ »). */
export const localePath = (lang: Lang, path = '') => (lang === 'fr' ? `/${path}` : `/ar/${path}`);
