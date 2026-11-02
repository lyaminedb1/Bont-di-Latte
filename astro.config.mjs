// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config/site.ts';

export default defineConfig({
  site: site.url,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
  integrations: [
    sitemap({
      // Les pages de remerciement ne doivent pas être indexées.
      filter: (page) => !page.includes('/merci'),
      i18n: { defaultLocale: 'fr', locales: { fr: 'fr-DZ', ar: 'ar-DZ' } },
    }),
  ],
});
