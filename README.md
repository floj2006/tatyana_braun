# Татьяна Браун — сайт ведущей праздников

React 19 + Vite. Серебристая тема, без бэкенда.

```bash
npm install
npm run dev       # разработка
npm test          # тесты
npm run build     # сборка в dist/
npm run preview   # посмотреть сборку (http://localhost:4173)
```

Открывать `dist/index.html` двойным кликом нельзя (модули не грузятся с `file://`) — используйте `npm run preview` или залейте `dist/` на хостинг.

## Где менять контент
Всё в `src/config/site.js`: ссылки (VK, Telegram, видео), поводы, форматы и цены, шаги, FAQ, отзывы, ID Метрики.
Пустые значения (Telegram, отзывы, цены) автоматически скрываются.

## Фото
Положите файлы в `public/img/`: `tatyana.jpg`, `about.jpg`, `showreel.jpg`, `gallery-1.jpg` … `gallery-6.jpg`.
Пока файла нет, показывается серебристая заглушка.

## Деплой
Лучше всего Cloudflare Pages или Netlify: файл `public/_headers` с заголовками безопасности (CSP, HSTS и др.) подхватится автоматически. На Vercel те же заголовки нужно перенести в `vercel.json`, на nginx/Apache — в конфиг сервера.
Подробнее об оценке бизнеса, дизайна и безопасности — в [ASSESSMENT.md](./ASSESSMENT.md).
