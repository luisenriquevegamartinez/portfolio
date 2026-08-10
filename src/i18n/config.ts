export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * UI chrome only. Everything a recruiter reads as content lives in src/content/;
 * these are the labels around it.
 */
export const ui = {
  en: {
    'lang.name': 'English',
    'lang.switchTo': 'Ver en español',
    'nav.skip': 'Skip to content',
    'section.experience': 'Experience',
    'section.skills': 'Skills',
    'section.education': 'Education',
    'section.languages': 'Languages',
    'case.problem': 'Problem',
    'case.decision': 'Decision',
    'case.result': 'Result',
    'action.download': 'Download resume (PDF)',
    'action.view': 'View resume',
    'resume.back': '← Back to site',
    'resume.summary': 'Summary',
    'footer.open': 'Open to remote frontend roles. Reach me at',
    'date.present': 'Present',
    'meta.description': (years: number) =>
      `Frontend developer with ${years} years of experience in Angular, TypeScript and microfrontend architectures.`,
  },
  es: {
    'lang.name': 'Español',
    'lang.switchTo': 'View in English',
    'nav.skip': 'Saltar al contenido',
    'section.experience': 'Experiencia',
    'section.skills': 'Aptitudes',
    'section.education': 'Educación',
    'section.languages': 'Idiomas',
    'case.problem': 'Problema',
    'case.decision': 'Decisión',
    'case.result': 'Resultado',
    'action.download': 'Descargar CV (PDF)',
    'action.view': 'Ver CV',
    'resume.back': '← Volver al sitio',
    'resume.summary': 'Perfil',
    'footer.open': 'Disponible para roles remotos de frontend. Escríbeme a',
    'date.present': 'Actualidad',
    'meta.description': (years: number) =>
      `Desarrollador frontend con ${years} años de experiencia en Angular, TypeScript y arquitecturas de microfrontends.`,
  },
} as const;

export function t(locale: Locale) {
  return <K extends keyof (typeof ui)['en']>(key: K): (typeof ui)['en'][K] =>
    ui[locale][key] as (typeof ui)['en'][K];
}

/** The other locale, for the language toggle. */
export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'es' : 'en';
}

/**
 * Path for a route in a given locale. English is unprefixed so the existing
 * /portfolio/ URL — the one linked from LinkedIn — keeps working untouched.
 */
export function localePath(locale: Locale, path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === DEFAULT_LOCALE ? clean : `/${locale}${clean === '/' ? '' : clean}`;
}

/**
 * Month stamp used in the resume filename. Month precision, not day: the site rebuilds on
 * every push, and a date that changed weekly would make the CV look like it was churning.
 *
 * Kept in sync with scripts/generate-resume-pdf.mjs, which writes the files.
 */
export function resumeStamp(date = new Date()): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

/**
 * The filename a recruiter ends up with. Both the served file and the `download`
 * attribute use it, so the name survives a direct "save as" on the URL, not only a click
 * on the button.
 */
export function resumeDownloadName(locale: Locale, date = new Date()): string {
  const prefix = locale === 'es' ? 'CV' : 'Resume';
  return `${prefix} Luis Vega ${resumeStamp(date)}.pdf`;
}

/** Path of the dated resume, the one the download button points at. */
export function resumeFile(locale: Locale, date = new Date()): string {
  return `/${resumeDownloadName(locale, date)}`;
}

/**
 * Permanent undated alias, written alongside the dated file. Nothing on the site links to
 * it; it exists so a URL someone saved or shared months ago never 404s.
 */
export function resumeAlias(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/resume.pdf' : `/resume-${locale}.pdf`;
}
