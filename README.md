# Татьяна Браун — сайт ведущей праздников

Preact (через preact/compat, API как у React) + Vite. Статический сайт: HTML пререндерится при сборке,
затем страница оживает на ~17 КБ gzip JavaScript.
Сервера, базы данных и сбора персональных данных нет.

## Команды
```bash
npm ci            # установка
npm run dev       # разработка, http://localhost:5173
npm run check     # lint + тесты + production-сборка
npm run build     # сборка в dist/ (vite build → SSR-сборка → scripts/prerender.mjs)
npm run preview   # посмотреть сборку, http://localhost:4173
npm run images    # перегенерировать изображения из assets-src/ (нужен Python 3 + Pillow)
```
Node.js 20.19 или новее.

## Где что менять
- Контент: `src/content/site.js`. Пустое поле или пустой список скрывает раздел и пункт меню.
- Фото героя: заменить `assets-src/tatyana-hero.webp` и запустить `npm run images`.
- Фото мероприятий: положить в `public/img/events/` и указать в `EVENTS` с размерами `width`/`height`.
- Видео: ролик во VK — `VIDEOS` с `url`; свой файл — положить в `public/video/` и указать `src` и `poster`.
  Своё видео грузится только по нажатию. Появится раздел «Видео», пункт меню и кнопка на первом экране.
- Отзывы: `REVIEWS` с текстом или скриншотом (`image` с `alt` = текст отзыва) и ссылкой на источник.
- Шрифты: `src/assets/fonts/` (только кириллица и латиница), подключение в `src/fonts.css`.
- Правила проекта: `AGENTS.md`. Чего не хватает от Татьяны: `QUESTIONS.md`.

## Переменные окружения
| Переменная | Где | Нужна | Что делает |
|---|---|---|---|
| `SITE_URL` | Vercel → Settings → Environment Variables (Production) | только для своего домена | Адрес для canonical, Open Graph, sitemap, JSON-LD. Только `https://`. |
| `VERCEL_PROJECT_PRODUCTION_URL` | задаёт Vercel | — | Запасной адрес, если `SITE_URL` не задан. |
| `VERCEL_ENV` | задаёт Vercel | — | Если не `production`, сборка ставит `noindex` и `Disallow: /`. |

Секретов у проекта нет.

## Деплой на Vercel
Проект `tatyana-braun` уже создан и связан с репозиторием `floj2006/tatyana_braun`.
Настройки сборки заданы в `vercel.json` (framework vite, `npm ci`, `npm run build`, `dist`).

1. Влить ветку `claude/tatyana-braun-landing` в `master` (или выбрать её production-веткой
   в Vercel → Settings → Git → Production Branch).
2. Если будет свой домен: добавить его в Vercel → Settings → Domains и задать `SITE_URL=https://домен`
   для окружения Production.
3. Запустить production-деплой: пуш в production-ветку или Redeploy в панели Vercel.
4. Проверить: страница открывается, `/robots.txt` содержит `Allow: /` и ссылку на sitemap,
   в ответе есть заголовок `Content-Security-Policy`.

Пуши в другие ветки создают preview-деплои, они закрыты от индексации.
