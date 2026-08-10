/**
 * Proves the generated PDF is a text document, not a picture of one.
 *
 * "It renders correctly" is not evidence: an html2canvas PDF renders correctly too, and is
 * unreadable to every applicant tracking system. This runs the file through pdf.js — the
 * same class of parser an ATS uses — and asserts that the words actually come back out.
 */
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const path = resolve(process.argv[2] ?? 'dist/resume.pdf');
const buf = await readFile(path);
const raw = buf.toString('latin1');

const rasterImages = (raw.match(/\/Subtype\s*\/Image/g) ?? []).length;
const fonts = [...new Set([...raw.matchAll(/\/BaseFont\s*\/([A-Za-z0-9+\-,]+)/g)].map((m) => m[1]))];

const doc = await getDocument({ data: new Uint8Array(buf), useSystemFonts: false }).promise;

let extracted = '';
for (let i = 1; i <= doc.numPages; i++) {
  const page = await doc.getPage(i);
  const content = await page.getTextContent();
  extracted += content.items.map((item) => item.str).join(' ') + '\n';
}
extracted = extracted.replace(/[ \t]+/g, ' ').trim();

// Terms an ATS keyword filter would be looking for. If the text layer is broken these
// come back missing even when the page looks perfect. Case-insensitive: the section
// headings render uppercase via CSS, which is what lands in the text layer.
const required = ['Angular', 'TypeScript', 'Module Federation', 'Experience', 'Skills', 'Education'];
const haystack = extracted.toLowerCase();
const missing = required.filter((term) => !haystack.includes(term.toLowerCase()));

/*
  Reading order guard. A previous version floated the dates flush right, which pushed every
  date to the front of the text layer, ahead of the candidate's name and detached from the
  roles they belong to. The page looked correct; the parse was garbage. Assert that the name
  and the first section heading come before any date.
 */
const firstDate = extracted.search(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}\b/);
const namePos = haystack.indexOf('luis enrique vega martinez');
const orderBroken = firstDate >= 0 && namePos >= 0 && firstDate < namePos;

console.log(`file            : ${path}`);
console.log(`size            : ${(buf.length / 1024).toFixed(0)} KB`);
console.log(`pages           : ${doc.numPages}`);
console.log(`embedded fonts  : ${fonts.join(', ') || 'none'}`);
console.log(`raster images   : ${rasterImages}`);
console.log(`extracted chars : ${extracted.length}`);
console.log(`keyword check   : ${missing.length ? `MISSING ${missing.join(', ')}` : 'all present'}`);
console.log(`reading order   : ${orderBroken ? 'BROKEN — dates precede the name' : 'name precedes dates'}`);
console.log(`\n--- text layer as a parser sees it (first 700 chars) ---\n`);
console.log(extracted.slice(0, 700));

const failures = [];
if (doc.numPages !== 1) failures.push(`expected 1 page, got ${doc.numPages}`);
if (extracted.length < 1500) failures.push(`only ${extracted.length} extractable characters — likely an image PDF`);
if (rasterImages > 0) failures.push(`${rasterImages} raster image(s) embedded — the resume must be pure text`);
if (missing.length) failures.push(`keywords missing from the text layer: ${missing.join(', ')}`);
if (orderBroken) failures.push('reading order is broken — dates appear before the name in the text layer');

if (failures.length) {
  console.error(`\nFAILED:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}
console.log(`\nOK — single page, real extractable text, no raster content.`);
