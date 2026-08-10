/**
 * Reports how much of the printed page each resume actually fills, per section.
 *
 * The page-count guard in generate-resume-pdf.mjs tells you when the resume has already
 * overflowed. This tells you how close it is before it does — which matters because CI
 * substitutes Liberation Sans for Arial, and thin headroom is where that bites.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import { chromium } from 'playwright';

const DIST = resolve(process.argv[2] ?? 'dist');
const BASE = '/portfolio';
const ROUTES = [
  { locale: 'en', route: '/resume' },
  { locale: 'es', route: '/es/resume' },
];

// Letter is 279.4mm tall; @page margin is 12mm top and bottom.
const PAGE_BOX_MM = 279.4 - 24;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

async function resolveFile(urlPath) {
  let rel = decodeURIComponent(urlPath.split('?')[0]);
  if (rel.startsWith(BASE)) rel = rel.slice(BASE.length);
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';
  for (const c of [join(DIST, rel), join(DIST, rel, 'index.html')]) {
    try {
      if ((await stat(c)).isFile()) return c;
    } catch {
      /* next */
    }
  }
  return null;
}

const server = createServer(async (req, res) => {
  const f = await resolveFile(req.url ?? '/');
  if (!f) return res.writeHead(404).end('Not found');
  res.writeHead(200, { 'content-type': MIME[extname(f)] ?? 'application/octet-stream' });
  res.end(await readFile(f));
});
await new Promise((d) => server.listen(0, '127.0.0.1', d));
const { port } = server.address();

const browser = await chromium.launch();

for (const { locale, route } of ROUTES) {
  const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${port}${BASE}${route}`, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  // Content box width of Letter at 12mm margins, in CSS pixels at 96dpi.
  await page.setViewportSize({ width: Math.round(((215.9 - 24) / 25.4) * 96), height: 900 });

  const m = await page.evaluate(() => {
    const toMm = (px) => (px / 96) * 25.4;
    const sections = [...document.querySelectorAll('header, section')].map((s) => ({
      label: s.querySelector('h2')?.textContent?.trim() ?? s.tagName.toLowerCase(),
      mm: +toMm(s.getBoundingClientRect().height).toFixed(1),
    }));
    return { totalMm: +toMm(document.body.scrollHeight).toFixed(1), sections };
  });

  const headroom = PAGE_BOX_MM - m.totalMm;
  console.log(`\n=== ${locale} (${route}) ===`);
  console.log(`page box   : ${PAGE_BOX_MM.toFixed(1)} mm`);
  console.log(`content    : ${m.totalMm} mm`);
  console.log(
    `headroom   : ${headroom.toFixed(1)} mm  ${headroom < 0 ? 'OVERFLOWS' : headroom < 5 ? '(tight)' : '(ok)'}`,
  );
  for (const s of m.sections) console.log(`  ${String(s.mm).padStart(7)} mm  ${s.label}`);

  await page.close();
}

await browser.close();
server.close();
