// Защита публикации: на сайт не должны попадать пустые разделы, заглушки и выдуманные факты.
import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import Reviews from './components/Reviews.jsx';
import Terms from './components/Terms.jsx';
import Media from './components/Media.jsx';
import About from './components/About.jsx';
import { ABOUT, FORMATS, HERO, PHOTOS, PRIVACY, REVIEWS, SITE, TERMS, VIDEOS } from './content/site.js';
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
  it('видео-приветствие встаёт в «Обо мне» на место портрета, без звука и без загрузки заранее', () => {
    const html = renderToString(<About data={{ ...ABOUT, video: { ...ABOUT.video, src: '/video/hello.mp4' } }} />);
    expect(html).toContain('src="/video/hello.mp4"');
    expect(html).toMatch(/<video[^>]*\bmuted\b/);
    expect(html).toMatch(/<video[^>]*playsinline/i);
    expect(html).toContain('preload="none"');
    expect(html).not.toMatch(/<video[^>]*autoplay/i);
    expect(html).toContain(`poster="${ABOUT.video.poster || `${ABOUT.photo.base}-1200.webp`}"`);
    expect(html).toContain('about__video-start'); // без JS — кнопка «Смотреть», звук и пауза появляются после загрузки
    expect(html).not.toContain('<picture');
  });

  it('без видео в «Обо мне» портрет, на первом экране кнопки видео нет', () => {
    const html = renderToString(<About data={{ ...ABOUT, video: { ...ABOUT.video, src: '' } }} />);
    expect(html).toContain('<picture');
    expect(html).not.toContain('<video');
    expect(renderToString(<App route={ROUTES[0]} />)).not.toContain('hero__video');
  });

  it('файлы видео-приветствия и его заставки лежат в public', () => {
    if (!ABOUT.video.src) return;
    expect(existsSync(`public${ABOUT.video.src}`)).toBe(true);
    if (ABOUT.video.poster) expect(existsSync(`public${ABOUT.video.poster}`)).toBe(true);
  });

  it('отзыв со ссылкой на источник открывается безопасно', () => {
    const html = renderToString(
      <Reviews items={[{ author: 'Анна', event: 'свадьба', text: 'Спасибо!', source: 'https://vk.com/wall-1_2' }]} />,
    );
    expect(html).toContain('Анна');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('длинный отзыв целиком в HTML, свёрнут визуально и открывается в окне', () => {
    const text = 'Очень длинный отзыв. '.repeat(30);
    const html = renderToString(<Reviews items={[{ id: 'l', author: '', event: 'Юбилей', text, source: '' }]} />);
    expect(html).toContain(text.trim());
    expect(html).toContain('is-clamped');
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).not.toContain('aria-expanded');
    expect(html).toMatch(/<dialog[^>]*class="sheet review-dialog"/);
    expect(html).not.toMatch(/<dialog[^>]*\sopen/);
    expect(html).not.toMatch(/<figcaption>,/);
  });

  it('без длинных отзывов окно не выводится', () => {
    const html = renderToString(<Reviews items={[{ id: 's', author: 'Анна', event: '', text: 'Спасибо!', source: '' }]} />);
    expect(html).not.toContain('<dialog');
    expect(html).not.toContain('review__more');
  });

  it('отзыв без автора и повода не выводит пустую подпись', () => {
    const html = renderToString(<Reviews items={[{ id: 's', author: '', event: '', text: 'Спасибо!', source: '' }]} />);
    expect(html).not.toContain('<figcaption');
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

  it('фото из импорта выводятся как AVIF/WebP с srcset и размерами', () => {
    const html = renderToString(<Media photos={[{ id: 'b', base: '/img/photos/01-x', widths: [600, 1200], width: 1200, height: 800, alt: 'Танец', caption: '' }]} />);
    expect(html).toContain('type="image/avif"');
    expect(html).toContain('/img/photos/01-x-1200.webp 1200w');
    expect(html).not.toContain('<figcaption');
    expect(html).toMatch(/width="1200"/);
    expect(html).toMatch(/loading="lazy"/);
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

  it('город на сайте только из SITE.city (старый ошибочный город не встречается)', () => {
    expect(html).not.toMatch(/Октябр/);
    for (const r of ROUTES) expect(renderToString(<App route={r} />)).not.toMatch(/Октябр/);
  });

  it('не содержит заглушек и служебных пометок', () => {
    expect(html).not.toMatch(/TODO|Lorem|заглушк|placeholder|ЧЕРНОВИК|example\.com/i);
  });

  it('не показывает пустые разделы и пункты меню к ним', () => {
    if (!PHOTOS.length && !VIDEOS.length) expect(html).not.toContain('id="media"');
    if (!REVIEWS.length) expect(html).not.toContain('id="reviews"');
    if (!PHOTOS.length && !VIDEOS.length) expect(html).not.toContain('href="#media"');
    if (!REVIEWS.length) expect(html).not.toContain('href="#reviews"');
  });

  it('на первом экране слоган без города, город и область в «Обо мне» после текста Татьяны', () => {
    const hero = html.slice(html.indexOf('id="top"'), html.indexOf('id="about"'));
    expect(hero).toContain(HERO.lead);
    expect(hero.match(/<h1[\s\S]*?<\/h1>/)[0]).not.toContain(SITE.cityIn);
    const about = html.slice(html.indexOf('id="about"'), html.indexOf('id="formats"'));
    expect(about).toContain(SITE.area);
    expect(about).not.toMatch(/в другом городе/);
    if (ABOUT.story.length) expect(about.indexOf(ABOUT.story[0])).toBeLessThan(about.indexOf('about__facts'));
  });

  it('детских праздников нет', () => {
    expect(html).not.toMatch(/детск/i);
    expect(html).not.toContain('detskij');
    expect(ROUTES.some((r) => r.path.includes('detskij'))).toBe(false);
  });

  it('у каждого якоря меню есть раздел', () => {
    const anchors = [...html.matchAll(/href="#([\w-]+)"/g)].map((m) => m[1]);
    for (const a of new Set(anchors)) expect(html, `#${a}`).toContain(`id="${a}"`);
  });

  it('кнопки «Узнать дату» ведут к форме и открывают окно связи; окно при загрузке закрыто', () => {
    const ctas = [...html.matchAll(/<a[^>]*href="#contact"[^>]*>/g)].map((m) => m[0]);
    expect(ctas.length).toBeGreaterThanOrEqual(3);
    for (const a of ctas) expect(a).toContain('aria-haspopup="dialog"');
    expect(html).toMatch(/<dialog[^>]*class="sheet quick"/);
    expect(html).not.toMatch(/<dialog[^>]*\sopen/);
  });

  it('фото и отзывы стоят сразу после форматов, до подхода', () => {
    const at = (id) => html.indexOf(`id="${id}"`);
    if (PHOTOS.length && REVIEWS.length) {
      expect(at('formats')).toBeLessThan(at('media'));
      expect(at('media')).toBeLessThan(at('reviews'));
      expect(at('reviews')).toBeLessThan(at('approach'));
    }
  });

  it('политика конфиденциальности: ссылка в подвале каждой страницы, честный текст без заглушек', () => {
    for (const r of ROUTES) expect(renderToString(<App route={r} />)).toContain('href="/privacy/"');
    const privacy = renderToString(<App route={ROUTES.find((r) => r.page === 'privacy')} />);
    expect(privacy).toContain(PRIVACY.title);
    expect(privacy).toContain('не собирает и не хранит персональные данные');
    if (SITE.phone) expect(privacy).toContain(SITE.phone);
    expect(privacy).not.toMatch(/undefined|null|ИНН ,|ОГРНИП ,/);
    // пустые реквизиты не выводятся
    if (!SITE.legal.inn) expect(privacy).not.toContain('ИНН');
    // плашка cookie не пререндерится: появляется только в браузере
    expect(privacy).not.toContain('class="consent"');
  });

  it('файлы фото первого экрана и картинки для мессенджеров есть под именами из HERO', () => {
    for (const w of HERO.photo.widths) {
      for (const ext of ['avif', 'webp']) expect(existsSync(`public${HERO.photo.base}-${w}.${ext}`), `${w}.${ext}`).toBe(true);
    }
    expect(existsSync(`public${HERO.og}`)).toBe(true);
  });

  it('WhatsApp на сайте нет', () => {
    expect(html).not.toContain('wa.me');
  });

  it('география, кроме Челябинска, не публикуется', () => {
    for (const r of ROUTES) expect(renderToString(<App route={r} />)).not.toMatch(/Троицк|Октябрьск/);
  });

  it('телефон кликабельный, фото и отзывы в каруселях с кнопками', () => {
    if (SITE.phoneHref) expect(html).toContain(`href="${SITE.phoneHref}"`);
    const tracks = (PHOTOS.length ? 1 : 0) + (REVIEWS.length ? 1 : 0);
    expect((html.match(/class="carousel__track"/g) || []).length).toBe(tracks);
    expect((html.match(/class="carousel__btn /g) || []).length).toBe(tracks * 2);
    expect((html.match(/class="reviews__item"/g) || []).length).toBe(REVIEWS.length);
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
      const h1 = html.match(/<h1[\s\S]*?<\/h1>/)[0].replace(/<[^>]+>/g, '');
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
