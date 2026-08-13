/**
 * Proves each generated PDF is a text document, not a picture of one.
 *
 * "It renders correctly" is not evidence: an html2canvas PDF renders correctly too, and is
 * unreadable to every applicant tracking system. This runs the file through pdf.js — the
 * same class of parser an ATS uses — and asserts that the words actually come back out.
 *
 * Usage: node scripts/verify-resume-pdf.mjs [file...]   (defaults to both locales)
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

/*
  Page budget. One page is the target, not an absolute.

  formato y estilo": "Una página". But the same package's CV template also says "trata de no
  under Experiencia — a formatting preference eating a content requirement.

  So: aim for one page, allow two, fail at three. The hard rule the budget must never break is
  in README.md — a quantified achievement is never cut to make room while unquantified prose
  survives on the page.
*/
const MAX_PAGES = 2;

/** Section headings render uppercase via CSS; the check below is case-insensitive. */
const EN = ['Angular', 'TypeScript', 'Module Federation', 'Experience', 'Skills', 'Education'];
const ES = ['Angular', 'TypeScript', 'Module Federation', 'Experiencia', 'Aptitudes', 'Educación'];

/** Spanish files are the ones named "CV ..." or "resume-es.pdf". */
const expectedFor = (name) => (/^CV |-es\.pdf$/.test(name) ? ES : EN);

const files = process.argv.slice(2);
// Default to the undated aliases: same bytes as the dated files, stable names to type.
const targets = files.length ? files : ['dist/resume.pdf', 'dist/resume-es.pdf'];

let anyFailed = false;

for (const relative of targets) {
  const path = resolve(relative);
  const name = path.split(/[\\/]/).pop();
  const buf = await readFile(path);
  const raw = buf.toString('latin1');

  const rasterImages = (raw.match(/\/Subtype\s*\/Image/g) ?? []).length;
  const fonts = [
    ...new Set([...raw.matchAll(/\/BaseFont\s*\/([A-Za-z0-9+\-,]+)/g)].map((m) => m[1])),
  ];

  const doc = await getDocument({ data: new Uint8Array(buf), useSystemFonts: false }).promise;

  let extracted = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    extracted += content.items.map((item) => item.str).join(' ') + '\n';
  }
  extracted = extracted.replace(/[ \t]+/g, ' ').trim();
  const haystack = extracted.toLowerCase();

  const required = expectedFor(name);
  const missing = required.filter((term) => !haystack.includes(term.toLowerCase()));

  /*
    Reading order guard. A previous version floated the dates flush right, which pushed
    every date to the front of the text layer, ahead of the candidate's name and detached
    from the roles they belong to. The page looked correct; the parse was garbage.
  */
  const firstDate = extracted.search(
    /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Ene|Abr|Ago|Dic)\w*\.?\s+\d{4}\b/i,
  );
  const namePos = haystack.indexOf('luis enrique vega martinez');
  const orderBroken = firstDate >= 0 && namePos >= 0 && firstDate < namePos;

  console.log(`\n=== ${name} ===`);
  console.log(`size            : ${(buf.length / 1024).toFixed(0)} KB`);
  console.log(
    `pages           : ${doc.numPages}` +
      (doc.numPages === 1 ? '' : ` (budget ${MAX_PAGES} — page 2 must earn its place)`),
  );
  console.log(`embedded fonts  : ${fonts.join(', ') || 'none'}`);
  console.log(`raster images   : ${rasterImages}`);
  console.log(`extracted chars : ${extracted.length}`);
  console.log(`keyword check   : ${missing.length ? `MISSING ${missing.join(', ')}` : 'all present'}`);
  console.log(`reading order   : ${orderBroken ? 'BROKEN — dates precede the name' : 'name precedes dates'}`);
  console.log(`\n${extracted.slice(0, 320)}…`);

  const failures = [];
  if (doc.numPages > MAX_PAGES) failures.push(`expected at most ${MAX_PAGES} pages, got ${doc.numPages}`);
  if (extracted.length < 1500) failures.push(`only ${extracted.length} extractable characters`);
  if (rasterImages > 0) failures.push(`${rasterImages} raster image(s) embedded`);
  if (missing.length) failures.push(`keywords missing: ${missing.join(', ')}`);
  if (orderBroken) failures.push('reading order broken — dates appear before the name');

  if (failures.length) {
    console.error(`\nFAILED (${name}):\n- ${failures.join('\n- ')}`);
    anyFailed = true;
  } else {
    console.log(
      `\nOK — ${doc.numPages} page(s) within the ${MAX_PAGES}-page budget, ` +
        `real extractable text, no raster content.`,
    );
  }
}

if (anyFailed) process.exit(1);
