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
start: 2023-09-25           # once
resume: full                # once: the cut applies to both languages
role:
  en: Frontend Software Engineer
  es: Ingeniero de Software Frontend
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

### Why there is no projects section

The `projects` collection exists and validates, but the directory is empty on purpose.
Almost everything worth showing was built for employers or their clients and cannot be
linked, and the few public production URLs belong to the oldest roles — so a grid of them
would put 2020 work at eye level while the strongest work had no card at all. Those URLs
are attached to the roles they came from instead, where they read as evidence rather than
as headlines. Adding a self-published project later means dropping one markdown file into
`src/content/projects/`.

## Editing content

Change a markdown file under `src/content/`. Nothing else. The build validates the result
and both renderings update together.

`src/content/experience/babel.md` is the file to copy when adding a role: it uses every
field. The schema in [`src/content.config.ts`](src/content.config.ts) is the specification,
and it fails the build rather than letting a malformed entry through.

Rules the content follows, none of which a schema can enforce:

- **Nothing is invented.** Every achievement, number, client and technology traces back to
  the LinkedIn profile this was written from.
- **Numbers appear exactly as stated**, hedges included: `~45 min → ~2 min`, `~95%`,
  `20-30%`, `2 hours → 1 minute`, `80%`, `100%`.
- **A metric belongs to one role.** The 2 hours to 1 minute automation figure is true of
  both Sophos Solutions and CINTE Colombia; it appears on Sophos only, because the same
- **Bullets stay near one printed line.** A resume bullet that wraps is a bullet that does
  not get scanned. Long-form detail belongs in `caseStudy`, which only the website renders.
- **No claim outruns the evidence.** Job titles, dates and language levels are stated as

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
