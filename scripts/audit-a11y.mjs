/**
 * Accessibility and responsive audit against the built site.
 *
 * Runs axe-core over every page at three viewports, and separately asserts that no page
 * scrolls horizontally at 320px — a failure axe does not catch and that makes a site
 * unusable on a small phone.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { join, extname, resolve } from 'node:path';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const AXE_PATH = require.resolve('axe-core/axe.min.js');

const DIST = resolve('dist');
const BASE = '/portfolio';
const PAGES = ['/', '/resume', '/es/', '/es/resume'];
const VIEWPORTS = [
  { name: 'mobile', width: 320, height: 720 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
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
    if (!c.startsWith(DIST)) continue;
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

const axeSource = await readFile(AXE_PATH, 'utf8');
const browser = await chromium.launch();
const violations = [];
const overflows = [];

for (const path of PAGES) {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto(`http://127.0.0.1:${port}${BASE}${path}`, { waitUntil: 'networkidle' });
    await page.addScriptTag({ content: axeSource });

    const result = await page.evaluate(async () =>
      await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
      }),
    );

    for (const v of result.violations) {
      violations.push({ path, viewport: vp.name, id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length });
    }

    // Horizontal overflow: the page body must never scroll sideways.
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    if (overflow.scrollWidth > overflow.clientWidth + 1) {
      overflows.push({ path, viewport: vp.name, ...overflow });
    }

    await page.close();
  }
}

// Keyboard reachability: tab through the home page and record the focus order.
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(`http://127.0.0.1:${port}${BASE}/`, { waitUntil: 'networkidle' });
const focusOrder = [];
for (let i = 0; i < 12; i++) {
  await page.keyboard.press('Tab');
  focusOrder.push(
    await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return '(body)';
      return `${el.tagName.toLowerCase()}: ${(el.textContent ?? '').trim().slice(0, 40)}`;
    }),
  );
}
await page.close();
await browser.close();
server.close();

console.log('=== keyboard focus order (first 12 tab stops, home) ===');
focusOrder.forEach((f, i) => console.log(` ${String(i + 1).padStart(2)}. ${f}`));

console.log('\n=== axe-core, WCAG 2.1 A + AA ===');
if (violations.length === 0) {
  console.log(`no violations across ${PAGES.length} pages x ${VIEWPORTS.length} viewports`);
} else {
  for (const v of violations) {
    console.log(` ${v.impact?.toUpperCase()} [${v.path} @ ${v.viewport}] ${v.id}: ${v.help} (${v.nodes} node(s))`);
  }
}

console.log('\n=== horizontal overflow ===');
if (overflows.length === 0) {
  console.log('none — no page scrolls sideways, including at 320px');
} else {
  for (const o of overflows) {
    console.log(` ${o.path} @ ${o.viewport}: scrollWidth ${o.scrollWidth} > clientWidth ${o.clientWidth}`);
  }
}

if (violations.length || overflows.length) process.exit(1);
console.log('\nOK');
