import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
// Astro 7 deprecates re-exporting `z` from 'astro:content'. Importing from 'astro/zod'
// uses the same Zod instance the content layer validates with, so there is no chance of
// two copies of Zod disagreeing about a schema.
import { z } from 'astro/zod';

/**
 * One markdown file per role feeds BOTH languages of the website AND both PDF resumes.
 *
 * Translatable prose is nested per locale; everything structural — dates, stack, links,
 * and the resume cut — is declared once. That is deliberate: if each language had its own
 * file, changing a role to `compact` would have to be remembered twice, and one day it
 * would not be. Facts stay single-source; only wording is duplicated, because only wording
 * genuinely differs.
 *
 * Both locales are required rather than falling back to English. A half-translated page is
 * worse than an obviously missing one, and a failed build is how you find out.
 */
const localizedText = z.object({ en: z.string(), es: z.string() });
const localizedList = z.object({ en: z.array(z.string()), es: z.array(z.string()) });

const caseStudyShape = z.object({
  problem: z.string(),
  decision: z.string(),
  result: z.string(),
});

const experience = defineCollection({
  loader: glob({ base: './src/content/experience', pattern: '**/*.md' }),
  schema: z
    .object({
      company: z.string(),
      role: localizedText,
      location: localizedText,
      start: z.coerce.date(),
      end: z.coerce.date().nullable(), // null = current role
      stack: z.array(z.string()).default([]),

      // Public production URLs only. Website-only; never rendered into the PDF, where a
      // bare URL costs a line and gives an ATS parser nothing.
      links: z.array(z.object({ label: z.string(), url: z.url() })).default([]),

      // Website: problem -> decision -> result.
      caseStudy: z.object({ en: caseStudyShape, es: caseStudyShape }),

      // PDF only. The website ignores this field and always renders every role in full.
      resume: z.enum(['full', 'compact', 'omit']),

      // Used when resume === 'full'.
      highlights: localizedList.default({ en: [], es: [] }),

      // Used when resume === 'compact'.
      oneLine: localizedText.optional(),
    })
    // Fail the build loudly rather than silently emitting a blank resume entry.
    .refine((d) => d.resume !== 'full' || (d.highlights.en.length > 0 && d.highlights.es.length > 0), {
      message: "resume: 'full' requires highlights in both en and es",
      path: ['highlights'],
    })
    .refine((d) => d.resume !== 'compact' || Boolean(d.oneLine), {
      message: "resume: 'compact' requires oneLine in both en and es",
      path: ['oneLine'],
    }),
});

const profile = defineCollection({
  loader: glob({ base: './src/content/profile', pattern: 'main.md' }),
  schema: z.object({
    name: z.string(),
    location: z.string(),
    email: z.email(),
    yearsExperience: z.number().int().positive(),
    headline: localizedText,
    // One text per language, used by both the site hero and the PDF summary.
    summary: localizedText,
    // Stated in CEFR. An inflated level is the kind of claim that collapses on the
    // first call, and the honest one is cheap to hold.
    languages: localizedList,
    links: z.array(z.object({ label: z.string(), url: z.url() })),
  }),
});

const education = defineCollection({
  loader: glob({ base: './src/content/education', pattern: '**/*.md' }),
  schema: z.object({
    institution: z.string(),
    degree: localizedText,
    start: z.coerce.date(),
    end: z.coerce.date().nullable(),
    resume: z.boolean().default(true),
  }),
});

const skills = defineCollection({
  loader: file('./src/content/skills.json'),
  schema: z.object({
    id: z.string(),
    label: localizedText,
    // Technology names are not translated.
    items: z.array(z.string()).nonempty(),
    order: z.number().int(),
    resume: z.boolean().default(true),
  }),
});

/**
 * Defined but intentionally empty. Client work is not linkable as source, and the only
 * public production URLs belong to the oldest roles, so they are attached to those roles
 * instead of promoted into a grid. Adding a self-published project later means dropping
 * one markdown file into src/content/projects/.
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: localizedText,
    url: z.url().optional(),
    repo: z.url().optional(),
    stack: z.array(z.string()).default([]),
    year: z.number().int(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { profile, experience, education, skills, projects };
