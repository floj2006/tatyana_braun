import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { FORMATS, SITE } from './src/content/site.js';
import { ROUTES } from './src/routes.js';
import { META_CSP } from './csp.js';

// Адрес сайта для canonical, Open Graph, sitemap и JSON-LD.
// SITE_URL — свой домен; иначе production-адрес проекта на Vercel; иначе текущий адрес.
function siteUrl() {
  const raw =
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    'https://tatyana-braun.vercel.app';
  const url = new URL(raw);
  if (url.protocol !== 'https:') throw new Error(`SITE_URL должен начинаться с https://, получено: ${raw}`);
  return url.origin;
}

// Строгая CSP в meta для production-сборки (в dev ей мешает HMR). Источник — csp.js.

// Preview-сборки Vercel закрываем от поисковиков явно, не полагаясь на настройки платформы.
const indexable = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production';

function seo() {
  const url = siteUrl();
  // Структурированные данные: только подтверждённые сведения.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: SITE.name,
    jobTitle: SITE.role,
    url: `${url}/`,
    image: `${url}/img/og.jpg`,
    sameAs: [SITE.community, SITE.personal, SITE.telegram].filter(Boolean),
    // Услуги — форматы с сайта; цены и география не указываются, пока не подтверждены.
    makesOffer: FORMATS.map((f) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: `Ведущая: ${f.title.toLowerCase()}`,
        serviceType: 'Ведение мероприятий',
        ...(SITE.city ? { areaServed: { '@type': 'City', name: SITE.city } } : {}),
      },
    })),
    // Город подтверждён заказчиком; улица и точный адрес не указываются.
    ...(SITE.city
      ? {
          workLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              addressLocality: SITE.city,
              ...(SITE.region ? { addressRegion: SITE.region } : {}),
              addressCountry: 'RU',
            },
          },
          areaServed: { '@type': 'City', name: SITE.city },
        }
      : {}),
  };
  return {
    name: 'site-seo',
    apply: (_config, env) => env.command === 'build' && !env.isSsrBuild,
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html
          .replaceAll('__SITE_URL__', url)
          .replaceAll('__CITY_IN__', SITE.cityIn)
          .replaceAll('__CITY__', SITE.city)
          .replace('__JSON_LD__', JSON.stringify(jsonLd).replace(/</g, '\\u003c'))
          .replace(
            '<meta charset="utf-8">',
            `<meta charset="utf-8">\n  <meta http-equiv="Content-Security-Policy" content="${META_CSP}">` +
              (indexable ? '' : '\n  <meta name="robots" content="noindex, nofollow">'),
          ),
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const robots = indexable ? `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n` : 'User-agent: *\nDisallow: /\n';
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${ROUTES.map(
          (r) => `  <url><loc>${url}${r.path}</loc><lastmod>${today}</lastmod></url>`,
        ).join('\n')}\n</urlset>\n`,
      });
    },
  };
}

// Preload кириллических шрифтов первого экрана: имена файлов с хешами известны только после сборки.
function preloadFonts() {
  return {
    name: 'preload-fonts',
    apply: (_config, env) => env.command === 'build' && !env.isSsrBuild,
    transformIndexHtml: {
      order: 'post',
      handler: (_html, ctx) =>
        Object.keys(ctx.bundle ?? {})
          .filter((f) => /(prata|onest)-cyrillic-[\w-]+\.woff2$/.test(f))
          .map((f) => ({
            tag: 'link',
            attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `/${f}`, crossorigin: '' },
            injectTo: 'head',
          })),
    },
  };
}

export default defineConfig({
  // Preact вместо React: тот же API через preact/compat, но ~4 КБ вместо ~60 КБ gzip.
  plugins: [preact({ prerender: { enabled: false } }), seo(), preloadFonts()],
  build: { assetsInlineLimit: 0 },
  test: { environment: 'node' },
});
