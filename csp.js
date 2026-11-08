// Единый источник Content-Security-Policy.
// META_CSP вставляется в index.html при сборке; HEADER_CSP должен совпадать с заголовком
// в vercel.json (это проверяет src/publish.test.jsx). frame-ancestors работает только в заголовке.
export const META_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

export const HEADER_CSP = `${META_CSP}; frame-ancestors 'none'`;
