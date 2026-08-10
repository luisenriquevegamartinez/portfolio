import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Experience = CollectionEntry<'experience'>;

/** Newest first, derived from `start` so there is no manual order field to drift. */
export async function getExperience(): Promise<Experience[]> {
  const entries = await getCollection('experience');
  return entries.sort(
    (a, b) => b.data.start.getTime() - a.data.start.getTime(),
  );
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

const MONTH = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatRange(start: Date, end: Date | null): string {
  return `${MONTH.format(start)} – ${end ? MONTH.format(end) : 'Present'}`;
}

export function formatYearRange(start: Date, end: Date | null): string {
  const y = (d: Date) => d.getUTCFullYear();
  return `${y(start)} – ${end ? y(end) : 'Present'}`;
}
