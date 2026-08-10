import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { type Locale, ui } from '../i18n/config';

export type Experience = CollectionEntry<'experience'>;

/** Newest first, derived from `start` so there is no manual order field to drift. */
export async function getExperience(): Promise<Experience[]> {
  const entries = await getCollection('experience');
  return entries.sort((a, b) => b.data.start.getTime() - a.data.start.getTime());
}

/** The subset the PDF renders, in the same order. `omit` entries drop out entirely. */
export async function getResumeExperience(): Promise<Experience[]> {
  const entries = await getExperience();
  return entries.filter((e) => e.data.resume !== 'omit');
}

export async function getProfile() {
  const entry = await getEntry('profile', 'main');
  if (!entry) throw new Error('src/content/profile/main.md is missing');
  return entry.data;
}

export async function getSkills(forResume = false) {
  const groups = await getCollection('skills');
  return groups
    .filter((g) => (forResume ? g.data.resume : true))
    .sort((a, b) => a.data.order - b.data.order);
}

export async function getEducation(forResume = false) {
  const entries = await getCollection('education');
  return entries
    .filter((e) => (forResume ? e.data.resume : true))
    .sort((a, b) => b.data.start.getTime() - a.data.start.getTime());
}

const MONTH: Record<Locale, Intl.DateTimeFormat> = {
  en: new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }),
  es: new Intl.DateTimeFormat('es-ES', { month: 'short', year: 'numeric', timeZone: 'UTC' }),
};

/** Spanish month abbreviations arrive lowercase and sometimes with a trailing dot. */
function tidy(value: string, locale: Locale): string {
  if (locale !== 'es') return value;
  return value.replace(/^([a-záéíóú]+)/, (m) => m.charAt(0).toUpperCase() + m.slice(1));
}

export function formatRange(start: Date, end: Date | null, locale: Locale): string {
  const from = tidy(MONTH[locale].format(start), locale);
  const to = end ? tidy(MONTH[locale].format(end), locale) : ui[locale]['date.present'];
  return `${from} – ${to}`;
}

export function formatYearRange(start: Date, end: Date | null, locale: Locale): string {
  const year = (d: Date) => d.getUTCFullYear();
  return `${year(start)} – ${end ? year(end) : ui[locale]['date.present']}`;
}
