import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
// Astro 7 deprecates re-exporting `z` from 'astro:content'. Importing from 'astro/zod'
// uses the same Zod instance the content layer validates with, so there is no chance of
// two copies of Zod disagreeing about a schema.
import { z } from 'astro/zod';

/**
 * One markdown file per role feeds BOTH the website and the generated PDF resume.
 *
 * The website always renders every entry in full, as a case study.
 * Only the PDF respects `resume`, which encodes the one-page cut as data:
 * shortening the resume is a one-word edit, not a second document to maintain.
 */
const experience = defineCollection({
  loader: glob({ base: './src/content/experience', pattern: '**/*.md' }),
  schema: z
    .object({
      company: z.string(),
      role: z.string(),
      location: z.string(),
      start: z.coerce.date(),
      end: z.coerce.date().nullable(), // null = current role
      stack: z.array(z.string()).default([]),

      // Public production URLs only. Website-only; never rendered into the PDF,
      // where a bare URL costs a line and gives an ATS parser nothing.
      links: z
        .array(z.object({ label: z.string(), url: z.url() }))
        .default([]),

      // Website: problem -> decision -> result.
      caseStudy: z.object({
        problem: z.string(),
        decision: z.string(),
        result: z.string(),
      }),

      // PDF only. The website ignores this field.
      resume: z.enum(['full', 'compact', 'omit']),

      // Used when resume === 'full'.
      highlights: z.array(z.string()).default([]),

      // Used when resume === 'compact'.
      oneLine: z.string().optional(),
    })
    // Fail the build loudly rather than silently emitting a blank resume entry.
    .refine((d) => d.resume !== 'full' || d.highlights.length > 0, {
      message: "resume: 'full' requires at least one entry in highlights",
      path: ['highlights'],
    })
    .refine((d) => d.resume !== 'compact' || Boolean(d.oneLine), {
      message: "resume: 'compact' requires oneLine",
      path: ['oneLine'],
    }),
});

const profile = defineCollection({
  loader: glob({ base: './src/content/profile', pattern: 'main.md' }),
  schema: z.object({
    name: z.string(),
    headline: z.string(),
    location: z.string(),
    email: z.email(),
    yearsExperience: z.number().int().positive(),
    // One text, used by both the site hero and the PDF summary.
    summary: z.string(),
    links: z.array(z.object({ label: z.string(), url: z.url() })),
  }),
});

const education = defineCollection({
  loader: glob({ base: './src/content/education', pattern: '**/*.md' }),
  schema: z.object({
    institution: z.string(),
    degree: z.string(),
    start: z.coerce.date(),
    end: z.coerce.date().nullable(),
    resume: z.boolean().default(true),
  }),
});

const skills = defineCollection({
  loader: file('./src/content/skills.json'),
  schema: z.object({
    id: z.string(),
    label: z.string(),
    items: z.array(z.string()).nonempty(),
    order: z.number().int(),
    resume: z.boolean().default(true),
  }),
});

/**
 * Defined but intentionally empty. Client work is not linkable as source, and the
 * only public production URLs belong to the oldest roles, so they are attached to
 * those roles instead of promoted into a grid. Adding a self-published project
 * later means dropping one markdown file into src/content/projects/.
 */
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    url: z.url().optional(),
    repo: z.url().optional(),
    stack: z.array(z.string()).default([]),
    year: z.number().int(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { profile, experience, education, skills, projects };
