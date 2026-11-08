// Единый источник Content-Security-Policy.
// META_CSP вставляется в index.html при сборке; HEADER_CSP должен совпадать с заголовком
// в vercel.json (это проверяет src/publish.test.jsx). frame-ancestors работает только в заголовке.
// Когда в src/content/site.js включена Метрика, сюда автоматически добавляются домены Яндекса,
// и тест напомнит обновить vercel.json.
import { ANALYTICS } from './src/content/site.js';

const metrika = Number(ANALYTICS.metrikaId) > 0 && ANALYTICS.privacyUrl;
const ym = metrika ? ' https://mc.yandex.ru https://mc.yandex.com' : '';

export const META_CSP = [
  "default-src 'self'",
  `script-src 'self'${metrika ? ' https://mc.yandex.ru' : ''}`,
  "style-src 'self'",
  `img-src 'self' data:${ym}`,
  "font-src 'self'",
  `connect-src 'self'${ym}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

export const HEADER_CSP = `${META_CSP}; frame-ancestors 'none'`;
