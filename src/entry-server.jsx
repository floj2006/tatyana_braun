import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import { ROUTES } from './routes.js';
import { FORMATS, PRIVACY, SITE } from './content/site.js';

/** Все страницы для пререндера: путь, HTML и мета-данные (у главной мета-теги уже в index.html). */
export function pages() {
  return ROUTES.map((route) => {
    const f = FORMATS.find((x) => x.id === route.format);
    return {
      path: route.path,
      html: renderToString(
        <StrictMode>
          <App route={route} />
        </StrictMode>,
      ),
      meta: f?.page
        ? { title: f.page.title, description: f.page.description, h1: f.page.h1, service: f.title, name: SITE.name, city: SITE.city }
        : route.page === 'privacy'
          ? { title: `${PRIVACY.title} | ${SITE.name}`, description: `Как сайт ${SITE.name} обращается с данными посетителей и как связаться по вопросам персональных данных.` }
          : null,
    };
  });
}
