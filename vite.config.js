import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Строгая CSP добавляется только в production-сборку (в dev ей мешает HMR).
// Заголовки с frame-ancestors и др. — в public/_headers.
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
].join('; ');

const cspPlugin = () => ({
  name: 'inject-csp',
  apply: 'build',
  transformIndexHtml: () => [
    { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: CSP }, injectTo: 'head-prepend' },
  ],
});

export default defineConfig({
  plugins: [react(), cspPlugin()],
  base: './',
  test: { environment: 'node' },
});
