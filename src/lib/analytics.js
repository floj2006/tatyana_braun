import { ANALYTICS } from '../content/site.js';

// Яндекс.Метрика по согласию (152-ФЗ). Пока не заданы номер счётчика и ссылка на политику,
// модуль ничего не делает: не показывает баннер, ничего не грузит и не отправляет.
const KEY = 'tb-analytics-consent';
let loaded = false;

/** Ссылка на политику: путь на этом сайте или https-адрес; иначе ''. */
export function policyUrl() {
  const u = String(ANALYTICS.privacyUrl ?? '');
  return /^\/[^/]/.test(u) || u.startsWith('https://') ? u : '';
}

export const analyticsEnabled = () => Number(ANALYTICS.metrikaId) > 0 && Boolean(policyUrl());

export function getConsent() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function loadMetrika() {
  if (loaded || !analyticsEnabled()) return;
  loaded = true;
  const id = Number(ANALYTICS.metrikaId);
  window.ym =
    window.ym ||
    function ym(...args) {
      (window.ym.a = window.ym.a || []).push(args);
    };
  window.ym.l = Date.now();
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://mc.yandex.ru/metrika/tag.js';
  document.head.appendChild(s);
  window.ym(id, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true });
}

export function setConsent(value) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // без хранилища согласие действует до перезагрузки
  }
  if (value === 'yes') loadMetrika();
}

/** При загрузке страницы: счётчик включается, только если согласие уже было дано. */
export function initAnalytics() {
  if (analyticsEnabled() && getConsent() === 'yes') loadMetrika();
}

/** Цели: format_choose, form_submit, whatsapp_click. Без согласия ничего не отправляется. */
export function track(goal, params) {
  if (loaded) window.ym?.(Number(ANALYTICS.metrikaId), 'reachGoal', goal, params);
}
