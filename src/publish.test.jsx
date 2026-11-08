// Защита публикации: на сайт не должны попадать пустые разделы, заглушки и выдуманные факты.
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import Reviews from './components/Reviews.jsx';
import Terms from './components/Terms.jsx';
import Media from './components/Media.jsx';
import { FORMATS, PHOTOS, REVIEWS, SITE, TERMS, VIDEOS } from './content/site.js';
import { ROUTES } from './routes.js';
import { HEADER_CSP } from '../csp.js';
import vercel from '../vercel.json';

describe('разделы без данных не рендерятся', () => {
  it('фото и видео, отзывы', () => {
    expect(renderToString(<Media photos={[]} videos={[]} />)).toBe('');
    expect(renderToString(<Reviews items={[]} />)).toBe('');
  });

  it('условия без пунктов', () => {
    expect(renderToString(<Terms data={{ includes: [], duration: '', equipment: '', booking: '', price: '' }} />)).toBe('');
  });

  it('пустые поля условий не выводятся', () => {
    const html = renderToString(<Terms data={TERMS} />);
    if (!TERMS.duration) expect(html).not.toContain('Длительность');
    if (!TERMS.equipment) expect(html).not.toContain('DJ, звук');
  });
});

describe('разделы с данными рендерятся корректно', () => {
  it('отзыв со ссылкой на источник открывается безопасно', () => {
    const html = renderToString(
      <Reviews items={[{ author: 'Анна', event: 'свадьба', text: 'Спасибо!', source: 'https://vk.com/wall-1_2' }]} />,
    );
    expect(html).toContain('Анна');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('ссылка на источник отзыва с чужого домена не выводится', () => {
    const html = renderToString(<Reviews items={[{ author: 'Анна', event: '', text: 'Спасибо!', source: 'https://evil.example/x' }]} />);
    expect(html).not.toContain('evil.example');
  });

  it('видео из VK открывается в новой вкладке, чужой хост не выводится', () => {
    const vk = renderToString(<Media videos={[{ id: 'a', title: 'Свадьба', url: 'https://vkvideo.ru/video-1_2' }]} />);
    expect(vk).toContain('href="https://vkvideo.ru/video-1_2"');
    expect(vk).toContain('noopener');
    const evil = renderToString(<Media videos={[{ id: 'b', title: 'x', url: 'https://evil.example/v' }]} />);
    expect(evil).not.toContain('evil.example');
  });

  it('своё видео не грузится до нажатия: только постер', () => {
    const html = renderToString(<Media videos={[{ id: 'a', title: 'Юбилей', src: '/video/a.mp4', poster: { src: '/img/a.jpg', width: 1280, height: 720 } }]} />);
    expect(html).not.toContain('<video');
    expect(html).toContain('loading="lazy"');
  });

  it('отзыв-скриншот выводится картинкой с alt', () => {
    const html = renderToString(<Reviews items={[{ id: 1, author: 'Олег', event: 'юбилей', image: { src: '/img/r.webp', width: 600, height: 900, alt: 'Спасибо за вечер' } }]} />);
    expect(html).toContain('alt="Спасибо за вечер"');
  });

  it('фото выводятся с размерами, подписью и ленивой загрузкой', () => {
    const html = renderToString(<Media photos={[{ id: 'a', src: '/img/a.webp', width: 800, height: 600, alt: 'Первый танец', caption: 'Свадьба, июль 2026' }]} />);
    expect(html).toMatch(/width="800"/);
    expect(html).toMatch(/loading="lazy"/);
    expect(html).toContain('Свадьба, июль 2026');
  });
});

describe('публичная страница', () => {
  const html = renderToString(<App />);

  it('не содержит заглушек и служебных пометок', () => {
    expect(html).not.toMatch(/TODO|Lorem|заглушк|placeholder|ЧЕРНОВИК|example\.com/i);
  });

  it('не показывает пустые разделы и пункты меню к ним', () => {
    if (!PHOTOS.length && !VIDEOS.length) expect(html).not.toContain('id="media"');
    if (!REVIEWS.length) expect(html).not.toContain('id="reviews"');
    if (!PHOTOS.length && !VIDEOS.length) expect(html).not.toContain('href="#media"');
    if (!REVIEWS.length) expect(html).not.toContain('href="#reviews"');
  });

  it('город в главном заголовке, когда он подтверждён', () => {
    const h1 = html.match(/<h1[\s\S]*?<\/h1>/)[0];
    if (SITE.city) expect(h1).toContain(SITE.cityIn);
  });

  it('у каждого якоря меню есть раздел', () => {
    const anchors = [...html.matchAll(/href="#([\w-]+)"/g)].map((m) => m[1]);
    for (const a of new Set(anchors)) expect(html, `#${a}`).toContain(`id="${a}"`);
  });

  it('один h1 и прямая ссылка на VK', () => {
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain(`href="${SITE.vk}"`);
  });
});

describe('CSP', () => {
  it('заголовок в vercel.json совпадает с csp.js', () => {
    const all = vercel.headers.find((h) => h.source === '/(.*)').headers;
    expect(all.find((h) => h.key === 'Content-Security-Policy').value).toBe(HEADER_CSP);
  });
});

describe('страницы форматов', () => {
  const formatRoutes = ROUTES.filter((r) => r.format);

  it('есть хотя бы одна страница формата', () => {
    expect(formatRoutes.length).toBeGreaterThan(0);
  });

  for (const route of formatRoutes) {
    const f = FORMATS.find((x) => x.id === route.format);
    const html = renderToString(<App route={route} />);

    it(`${route.path}: один H1 с городом, без быстрого выбора повода`, () => {
      expect(html.match(/<h1/g)).toHaveLength(1);
      const h1 = html.match(/<h1[\s\S]*?<\/h1>/)[0];
      expect(h1).toContain(f.page.h1);
      if (SITE.city) expect(h1).toContain(SITE.cityIn);
      expect(html).not.toContain('hero__chips');
    });

    it(`${route.path}: формат уже выбран в форме`, () => {
      expect(html).toMatch(new RegExp(`value="${f.id}"[^>]*checked|checked[^>]*value="${f.id}"`));
    });

    it(`${route.path}: якоря ведут на существующие разделы, нет заглушек`, () => {
      const anchors = [...html.matchAll(/href="#([\w-]+)"/g)].map((m) => m[1]);
      for (const a of new Set(anchors)) expect(html, `#${a}`).toContain(`id="${a}"`);
      expect(html).not.toMatch(/TODO|Lorem|заглушк|ЧЕРНОВИК/i);
    });
  }
});

describe('выключенные функции ничего не показывают', () => {
  const html = renderToString(<App />);
  it('WhatsApp без номера и баннер Метрики без настроек', () => {
    if (!SITE.whatsapp) expect(html).not.toContain('WhatsApp');
    expect(html).not.toContain('class="consent"');
  });
  it('цена не выводится, пока не подтверждена', () => {
    if (FORMATS.every((f) => !f.priceFrom)) expect(html).not.toContain('₽');
  });
});
