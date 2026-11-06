import { SITE } from '../config/site.js';

// Лёгкая обёртка над Яндекс.Метрикой. Пока SITE.metrikaId пуст — ничего не грузится и не отправляется.
// Чтобы включить: вписать номер счётчика и добавить в CSP (vite.config.js и public/_headers):
//   script-src https://mc.yandex.ru; connect-src https://mc.yandex.ru https://mc.yandex.com; img-src https://mc.yandex.ru
export function initAnalytics() {
  const id = Number(SITE.metrikaId);
  if (!id || window.ym) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://mc.yandex.ru/metrika/tag.js';
  s.onload = () => window.ym?.(id, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true });
  document.head.appendChild(s);
}

/** Цели: click_vk, click_telegram, click_showreel, event_select, form_submit, faq_open, cta_click */
export function track(goal, params) {
  const id = Number(SITE.metrikaId);
  if (id && typeof window.ym === 'function') window.ym(id, 'reachGoal', goal, params);
}
