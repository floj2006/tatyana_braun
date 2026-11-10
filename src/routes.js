import { FORMATS } from './content/site.js';

// Главная, страницы форматов и политика конфиденциальности.
// Страница формата появляется, только если у формата есть slug и page.
export const ROUTES = [
  { path: '/', format: null },
  ...FORMATS.filter((f) => f.slug && f.page).map((f) => ({ path: `/${f.slug}/`, format: f.id })),
  { path: '/privacy/', format: null, page: 'privacy' },
];

/** Маршрут по pathname; неизвестный путь — главная. */
export function routeFor(pathname = '/') {
  const p = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return ROUTES.find((r) => r.path === p) ?? ROUTES[0];
}

export const formatPath = (f) => (f?.slug && f?.page ? `/${f.slug}/` : '');
