# portfolio

Personal site and resume for Luis Enrique Vega Martinez.

Live at <https://luisenriquevegamartinez.github.io/portfolio/>

Astro, Tailwind and TypeScript. No external CDNs — every asset is served from the site itself.

Bilingual: English at `/portfolio/`, Spanish at `/portfolio/es/`. English stays unprefixed
so the URL linked from LinkedIn keeps resolving.

## One source, four renderings

Two languages on the site and two PDF resumes, all generated from the same content. There
is no separate resume document, because a separate document goes stale.

```text
src/content/
├── profile/main.md        Name, headline, contact, summary
├── experience/*.md        One file per role
├── education/*.md
├── skills.json
└── projects/              Defined, intentionally empty
```

Translatable prose is nested per locale inside each file; everything structural — dates,
stack, links, and the resume cut — is declared once:

```yaml
company: Babel              # once
start: 2023-09-01           # once
resume: full                # once: the cut applies to both languages
role:
  en: Software Engineer, Front-End
  es: Ingeniero de Software, Front-End
```

Splitting the languages into separate files would mean remembering to change `resume:` in
two places, and one day that would not happen. Facts stay single-source; only wording is
duplicated, because only wording genuinely differs. Both locales are required — a failed
build is how you discover a missing translation, rather than a half-English page.

Every collection is validated by a Zod schema in [`src/content.config.ts`](src/content.config.ts),
so a malformed edit fails the build instead of silently producing a broken page.

### How the one-page cut works

Nine roles do not fit on one page with detail, so the cut is encoded as data rather than
maintained as a second file. Each role declares how it renders in the PDF:

| `resume:` | Website | PDF |
| --- | --- | --- |
| `full` | Case study | Role heading plus bullets |
| `compact` | Case study | A single dense line |
| `omit` | Case study | Not rendered |

The website always renders every role in full. Only the PDF respects the field, so
shortening the resume is a one-word edit.

## Editing content

Change a markdown file under `src/content/`. Nothing else. The build validates the result
and both renderings update together.

Writing guidance and the rules the content follows live in `portfolio-EXPERIENCE-TEMPLATE.md`
alongside the source material.

## Commands

| Command | Does |
| --- | --- |
| `npm run dev` | Dev server at <http://localhost:4321/portfolio/> |
| `npm run build` | Builds the site and generates both resume PDFs |
| `npm run build:site` | Builds the site only |
| `npm run pdf` | Regenerates the PDFs from an existing `dist/` |
| `npm run verify:pdf` | Asserts each PDF is one page of real, extractable text |
| `npm run measure` | Prints resume content height against the page box, per locale and section |
| `npm run a11y` | Runs axe-core over every page at three viewports |

## The resume PDF

`scripts/generate-resume-pdf.mjs` runs Chromium over each built `/resume` page and calls
`page.pdf()`, producing `resume.pdf` and `resume-es.pdf`. That gives a real text layer —
selectable, copyable, and readable by applicant tracking systems.

This matters more than it sounds. A PDF produced with `html2canvas` or any DOM-to-image
approach renders identically and is a picture: an ATS extracts nothing from it. Everything
below follows from that constraint.

- Single column, no tables, no text boxes, no icons standing in for contact fields
- Standard section headings, standard fonts, ligatures disabled
- Nothing in the page header or footer
- Letter size, one page

`scripts/verify-resume-pdf.mjs` runs in CI and fails the deploy if any of that regresses.
It parses the PDF with pdf.js — the same class of parser an ATS uses — and checks the page
count, the extracted character count, the absence of raster content, expected keywords, and
the reading order.

That last check exists because of a real bug: floating the dates flush right looked correct
on screen but pushed every date to the front of the text layer, ahead of the candidate's
name and detached from the roles they belonged to. Reading order is what a parser consumes.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds, generates and
verifies the PDF, then publishes to GitHub Pages. Pages is configured with GitHub Actions
as the source, not branch deployment.

The site is served from a subpath, so `astro.config.mjs` sets `base: '/portfolio'` and all
internal links go through `withBase()` in [`src/lib/url.ts`](src/lib/url.ts). A hardcoded
absolute path resolves against the domain root and 404s.
