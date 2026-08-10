import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, resolve } from 'node:path';
import { chromium } from 'playwright';

const DIST = resolve(process.argv[2]);
const BASE = '/portfolio';
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };

async function resolveFile(u) {
  let rel = decodeURIComponent(u.split('?')[0]);
  if (rel.startsWith(BASE)) rel = rel.slice(BASE.length);
  if (rel === '' || rel.endsWith('/')) rel += 'index.html';
  for (const c of [join(DIST, rel), join(DIST, rel, 'index.html')]) {
    try { if ((await stat(c)).isFile()) return c; } catch {}
  }
  return null;
}

const server = createServer(async (req, res) => {
  const f = await resolveFile(req.url ?? '/');
  if (!f) return res.writeHead(404).end();
  res.writeHead(200, { 'content-type': MIME[extname(f)] ?? 'application/octet-stream' });
  res.end(await readFile(f));
});
await new Promise((d) => server.listen(0, '127.0.0.1', d));
const { port } = server.address();

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`http://127.0.0.1:${port}${BASE}/resume`, { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });
// Letter content box at 12mm margins, in CSS px (96dpi): (279.4 - 24)mm
await page.setViewportSize({ width: Math.round((215.9 - 24) / 25.4 * 96), height: 900 });

const m = await page.evaluate(() => {
  const px2mm = (v) => (v / 96) * 25.4;
  const secs = [...document.querySelectorAll('header, section')].map((s) => ({
    tag: s.tagName.toLowerCase() + (s.querySelector('h2')?.textContent ? ':' + s.querySelector('h2').textContent : ''),
    mm: +px2mm(s.getBoundingClientRect().height).toFixed(1),
  }));
  return { totalMm: +px2mm(document.body.scrollHeight).toFixed(1), secs };
});

console.log('page content box height: 255.4 mm');
console.log('actual content height  :', m.totalMm, 'mm');
console.log('overflow               :', (m.totalMm - 255.4).toFixed(1), 'mm');
console.log('--- per section ---');
for (const s of m.secs) console.log(String(s.mm).padStart(7), 'mm  ', s.tag);

await browser.close();
server.close();
