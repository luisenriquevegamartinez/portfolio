/**
 * Renders each built /resume page to a PDF using Chromium.
 *
 * Chromium's page.pdf() emits a real text layer — selectable, copyable and readable by
 * ATS parsers. This is the whole reason the PDF is not produced with html2canvas or any
 * other DOM-to-image route, which would output a picture of a resume that no applicant
 * tracking system can read.
 *
 * Must run AFTER `astro build` and BEFORE the Pages artifact is uploaded, otherwise the
 * files never ship.
 */
import { createServer } from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import { chromium } from 'playwright';

const DIST = resolve('dist');
const BASE = '/portfolio';

/*
  Keep in sync with src/i18n/config.ts.

  Each locale produces two identical files: the dated one a recruiter actually downloads,
  and an undated alias nothing links to, so a URL saved or shared months ago never 404s.
*/
const now = new Date();
const STAMP = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

const TARGETS = [
  { locale: 'en', route: '/resume', out: `Resume Luis Vega ${STAMP}.pdf`, alias: 'resume.pdf' },
  { locale: 'es', route: '/es/resume', out: `CV Luis Vega ${STAMP}.pdf`, alias: 'resume-es.pdf' },
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
};

async function resolveFile(urlPath) {
  // Requests arrive with the configured base prefix; dist/ is the base root.
  let rel = decodeURIComponent(urlPath.split('?')[0]);
  if (rel.startsWith(BASE)) rel = rel.slice(BASE.length);
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';

  const candidates = [join(DIST, rel), join(DIST, rel, 'index.html'), `${join(DIST, rel)}.html`];
  for (const candidate of candidates) {
    if (!candidate.startsWith(DIST)) continue; // path traversal guard
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

const server = createServer(async (req, res) => {
  const file = await resolveFile(req.url ?? '/');
  if (!file) {
    res.writeHead(404).end('Not found');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
  res.end(await readFile(file));
});

await new Promise((done) => server.listen(0, '127.0.0.1', done));
const { port } = server.address();

const browser = await chromium.launch();
let failed = false;

try {
  for (const target of TARGETS) {
    const url = `http://127.0.0.1:${port}${BASE}${target.route}`;
    const page = await browser.newPage();
    const response = await page.goto(url, { waitUntil: 'networkidle' });
    if (!response || !response.ok()) {
      throw new Error(`Could not load ${url} (status ${response?.status()})`);
    }

    await page.emulateMedia({ media: 'print' });

    /*
      Guard against an invisible resume. printBackground is false, so if this page ever
      inherited the site's dark theme the PDF would be near-white text on white paper —
      and every other check would still pass, because the text layer extracts perfectly.
      Legibility is the one property the text layer cannot prove.
    */
    const ink = await page.evaluate(() => {
      const s = getComputedStyle(document.body);
      const channels = (s.color.match(/\d+(?:\.\d+)?/g) ?? []).slice(0, 3).map(Number);
      const linear = channels.map((c) => {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      });
      return {
        color: s.color,
        luminance: 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2],
      };
    });
    const contrastOnPaper = 1.05 / (ink.luminance + 0.05);
    if (contrastOnPaper < 7) {
      throw new Error(
        `[${target.locale}] Resume body text is ${ink.color}, only ${contrastOnPaper.toFixed(1)}:1 ` +
          `against white paper. Check that the page is not inheriting the dark theme.`,
      );
    }

    const pdf = await page.pdf({
      format: 'Letter',
      printBackground: false,
      preferCSSPageSize: true,
      // No header or footer: nothing critical may live in page margins, and an ATS
      // parser treats margin content as noise.
      displayHeaderFooter: false,
    });

    await writeFile(join(DIST, target.out), pdf);
    await writeFile(join(DIST, target.alias), pdf);
    await page.close();

    const pageCount = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
    console.log(
      `${target.out} (+ ${target.alias}) — ${(pdf.length / 1024).toFixed(0)} KB, ` +
        `${pageCount} page(s), ink ${ink.color} at ${contrastOnPaper.toFixed(1)}:1`,
    );

    if (pageCount > 1) {
      console.error(
        `\nERROR: ${target.out} must be a single page, got ${pageCount}. ` +
          `Shorten it by flipping an entry to resume: 'compact' or 'omit'.\n`,
      );
      failed = true;
    }
  }
} finally {
  await browser.close();
  server.close();
}

if (failed) process.exitCode = 1;
