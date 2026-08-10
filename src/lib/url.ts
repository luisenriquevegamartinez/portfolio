/**
 * The site is served from https://luisenriquevegamartinez.github.io/portfolio/,
 * so every internal href and asset path has to be prefixed with the configured base.
 * A hardcoded "/resume.pdf" resolves against the domain root and 404s.
 */
const BASE = import.meta.env.BASE_URL;

export function withBase(path: string): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `${base}${suffix}`;
}
