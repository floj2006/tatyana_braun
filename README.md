# Татьяна Браун — сайт ведущей праздников

Preact (через preact/compat, API как у React) + Vite. Статический сайт: HTML пререндерится при сборке,
затем страница оживает на ~17 КБ gzip JavaScript.
Сервера, базы данных и сбора персональных данных нет.

## Дизайн
Silver Elegance: холодный серебристо-белый фон, графит, тонкие серебристые линии и мягкие блики.
Шрифты Prata (заголовки) и Onest (интерфейс). Палитра и правила — в `AGENTS.md`.

Разделы: первый экран → обо мне → форматы → мой подход → подготовка и условия → [фото и видео] →
[отзывы] → вопросы → контакты. Разделы в скобках появятся, когда в `src/content/site.js` будут материалы.

## Страницы
Главная `/` и страницы форматов: `/svadba/`, `/yubilej/`, `/korporativ/`, `/detskij-prazdnik/`.
Страница появляется у формата, у которого в `FORMATS` заполнены `slug` и `page` (заголовок, описание,
тексты, вопросы). Пререндер пишет отдельный HTML на каждую страницу со своими title, description,
canonical, Open Graph и JSON-LD (`Service` + `BreadcrumbList`); sitemap включает все страницы.

## Что включается само, когда появятся данные (`src/content/site.js`)
| Поле | Что появится |
|---|---|
| `FORMATS[].priceFrom` | «от N ₽» в списке форматов и на странице формата |
| `BUSY_DATES` | предупреждение в форме, если выбрана занятая дата |
| `SITE.whatsapp` | кнопка «Отправить в WhatsApp» с готовым текстом и ссылка в подвале |
| `ANALYTICS.metrikaId` + `ANALYTICS.privacyUrl` | баннер согласия; Метрика грузится только после «Согласен» |

Включая Метрику: после правки `ANALYTICS` обновите `Content-Security-Policy` в `vercel.json` по значению
`HEADER_CSP` из `csp.js` (тест `npm test` укажет на расхождение). Политику конфиденциальности с реквизитами
оператора должна предоставить Татьяна; сайт её не придумывает.

## Концепция дизайна
Editorial-подача по мотивам suvorova-event.ru (только композиция и типографика, без чужих текстов и бренда)
в серебристой палитре: фото на весь первый экран, имя тонким капслоком (Onest 200) с рукописными инициалами
(Great Vibes), заголовки секций с инициалом, чередование светлых и тёмных секций, карточки «что входит»,
тёмный финал с декоративным рукописным словом. Места под фото (мозаика) и отзывы (лента скриншотов) готовы.

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
- Фото с праздников: `PHOTOS` (`src`, `width`, `height`, `alt`, `caption`), файлы — в `public/img/photos/`.
- Видео: ролик во VK — `VIDEOS` с `url`; свой файл — положить в `public/video/` и указать `src` и `poster`.
  Своё видео грузится только по нажатию. Появится раздел «Фото и видео», пункт меню и кнопка на первом экране.
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
