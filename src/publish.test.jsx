// Защита публикации: на сайт не должны попадать пустые разделы, заглушки и выдуманные факты.
import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import Events from './components/Events.jsx';
import Reviews from './components/Reviews.jsx';
import Terms from './components/Terms.jsx';
import Videos from './components/Videos.jsx';
import { EVENTS, REVIEWS, SITE, TERMS, VIDEOS } from './content/site.js';
import { HEADER_CSP } from '../csp.js';
import vercel from '../vercel.json';

describe('разделы без данных не рендерятся', () => {
  it('мероприятия, отзывы и видео', () => {
    expect(renderToString(<Videos items={[]} />)).toBe('');
    expect(renderToString(<Events items={[]} />)).toBe('');
    expect(renderToString(<Reviews items={[]} />)).toBe('');
  });

  it('условия без пунктов', () => {
    expect(renderToString(<Terms data={{ title: 'x', includes: [], duration: '', equipment: '', booking: '', price: '' }} />)).toBe('');
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
    const vk = renderToString(<Videos items={[{ id: 'a', title: 'Свадьба', url: 'https://vkvideo.ru/video-1_2' }]} />);
    expect(vk).toContain('href="https://vkvideo.ru/video-1_2"');
    expect(vk).toContain('noopener');
    const evil = renderToString(<Videos items={[{ id: 'b', title: 'x', url: 'https://evil.example/v' }]} />);
    expect(evil).not.toContain('evil.example');
  });

  it('своё видео не грузится до нажатия: только постер', () => {
    const html = renderToString(<Videos items={[{ id: 'a', title: 'Юбилей', src: '/video/a.mp4', poster: { src: '/img/a.jpg', width: 1280, height: 720 } }]} />);
    expect(html).not.toContain('<video');
    expect(html).toContain('loading="lazy"');
  });

  it('отзыв-скриншот выводится картинкой с alt', () => {
    const html = renderToString(<Reviews items={[{ id: 1, author: 'Олег', event: 'юбилей', image: { src: '/img/r.webp', width: 600, height: 900, alt: 'Спасибо за вечер' } }]} />);
    expect(html).toContain('alt="Спасибо за вечер"');
  });

  it('мероприятие выводит фото с размерами и ленивой загрузкой', () => {
    const html = renderToString(
      <Events items={[{ id: 'a', title: 'Свадьба Ани и Вити', format: 'Свадьба', date: 'июль 2026', story: 'История', photos: [{ src: '/img/a.webp', width: 800, height: 600, alt: 'Танец' }] }]} />,
    );
    expect(html).toMatch(/width="800"/);
    expect(html).toMatch(/loading="lazy"/);
  });
});

describe('публичная страница', () => {
  const html = renderToString(<App />);

  it('не содержит заглушек и служебных пометок', () => {
    expect(html).not.toMatch(/TODO|Lorem|заглушк|placeholder|ЧЕРНОВИК|example\.com/i);
  });

  it('не показывает пустые разделы и пункты меню к ним', () => {
    if (!EVENTS.length) expect(html).not.toContain('id="events"');
    if (!REVIEWS.length) expect(html).not.toContain('id="reviews"');
    if (!EVENTS.length) expect(html).not.toContain('href="#events"');
    if (!REVIEWS.length) expect(html).not.toContain('href="#reviews"');
    if (!VIDEOS.length) expect(html).not.toContain('id="video"');
    if (!VIDEOS.length) expect(html).not.toContain('href="#video"');
  });

  it('не выводит город, пока он не подтверждён', () => {
    if (!SITE.city) expect(html).not.toContain('hero__geo');
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
