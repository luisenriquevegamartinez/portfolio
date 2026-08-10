/**
 * Renders the built /resume page to dist/resume.pdf using Chromium.
 *
 * Chromium's page.pdf() emits a real text layer — selectable, copyable and readable by
 * ATS parsers. This is the whole reason the PDF is not produced with html2canvas or any
 * other DOM-to-image route, which would output a picture of a resume that no applicant
 * tracking system can read.
 *
 * Must run AFTER `astro build` and BEFORE the Pages artifact is uploaded, otherwise the
 * file never ships.
 */
import { createServer } from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import { chromium } from 'playwright';

const DIST = resolve('dist');
const BASE = '/portfolio';
const OUT = join(DIST, 'resume.pdf');

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
const url = `http://127.0.0.1:${port}${BASE}/resume`;

const browser = await chromium.launch();
try {
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
      `Resume body text is ${ink.color}, only ${contrastOnPaper.toFixed(1)}:1 against white ` +
        `paper. The PDF would be unreadable. Check that /resume is not inheriting the dark theme.`,
    );
  }
  console.log(`body ink: ${ink.color} — ${contrastOnPaper.toFixed(1)}:1 on white paper`);

  const pdf = await page.pdf({
    format: 'Letter',
    printBackground: false,
    preferCSSPageSize: true,
    // No header or footer: nothing critical may live in page margins, and an ATS
    // parser treats margin content as noise.
    displayHeaderFooter: false,
  });

  await writeFile(OUT, pdf);

  // Fail loudly rather than shipping a silently-broken resume.
  const pageCount = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  const text = await page.evaluate(() => document.body.innerText.trim().length);
  if (text < 500) throw new Error(`Resume page rendered only ${text} characters of text`);

  console.log(`resume.pdf written — ${(pdf.length / 1024).toFixed(0)} KB, ${pageCount} page(s)`);
  if (pageCount > 1) {
    console.error(`\nERROR: the resume must be a single page, got ${pageCount}.`);
    console.error(`Shorten it by flipping an entry to resume: 'compact' or 'omit'.\n`);
    process.exitCode = 1;
  }
} finally {
  await browser.close();
  server.close();
}
