// Пререндер: для каждой страницы пишет готовый HTML с контентом и своими мета-тегами,
// чтобы контент был виден поисковикам и без ожидания JavaScript. Запускается из `npm run build`.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const ssrDir = new URL('dist-ssr/', root);

const { pages } = await import(new URL('entry-server.js', ssrDir));
const template = await readFile(new URL('index.html', dist), 'utf8');
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error(`prerender: в dist/index.html нет ${marker}`);
const site = template.match(/<link rel="canonical" href="([^"]+)\/">/)?.[1];
if (!site) throw new Error('prerender: не найден canonical в шаблоне');

const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const json = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

function withMeta(html, path, m) {
  const url = `${site}${path}`;
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: m.h1,
        serviceType: m.service,
        url,
        provider: { '@type': 'Person', name: m.name, url: `${site}/` },
        ...(m.city ? { areaServed: { '@type': 'City', name: m.city } } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: m.name, item: `${site}/` },
          { '@type': 'ListItem', position: 2, name: m.service, item: url },
        ],
      },
    ],
  };
  const out = html
    .replace(/<title>[^<]*<\/title>/, `<title>${attr(m.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${attr(m.description)}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${attr(m.title)}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${attr(m.description)}$2`)
    .replace('</head>', `  <script type="application/ld+json">${json(ld)}</script>\n</head>`);
  for (const check of [`<title>${attr(m.title)}</title>`, `href="${url}"`]) {
    if (!out.includes(check)) throw new Error(`prerender: не удалось подставить мета-теги для ${path}`);
  }
  return out;
}

for (const p of pages()) {
  let html = template.replace(marker, `<div id="root">${p.html}</div>`);
  if (p.meta) html = withMeta(html, p.path, p.meta);
  const dir = new URL(`.${p.path}`, dist);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL('index.html', dir), html);
  console.log(`prerender: ${p.path}`);
}
await rm(ssrDir, { recursive: true, force: true });
