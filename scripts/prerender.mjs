// Вставляет отрендеренный HTML в dist/index.html, чтобы контент был виден
// поисковикам и без ожидания JavaScript. Запускается из `npm run build`.
import { readFile, rm, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const htmlFile = new URL('dist/index.html', root);
const ssrDir = new URL('dist-ssr/', root);

const { render } = await import(new URL('entry-server.js', ssrDir));
const html = await readFile(htmlFile, 'utf8');
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error(`prerender: в dist/index.html нет ${marker}`);

await writeFile(htmlFile, html.replace(marker, `<div id="root">${render()}</div>`));
await rm(ssrDir, { recursive: true, force: true });
console.log('prerender: dist/index.html готов');
