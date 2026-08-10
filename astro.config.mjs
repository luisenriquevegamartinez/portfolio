// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// The live URL is linked from LinkedIn and must not change:
// https://luisenriquevegamartinez.github.io/portfolio/
// The repository is named `portfolio`, so the site is served from a subpath.
// Every internal link and asset has to respect `base` or the deploy 404s.
export default defineConfig({
  site: 'https://luisenriquevegamartinez.github.io',
  base: '/portfolio',
  // English stays unprefixed so the existing URL keeps resolving; Spanish lives under /es/.
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
