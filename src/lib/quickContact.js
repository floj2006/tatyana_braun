import { useSyncExternalStore } from 'react';

// Открыто ли окно «Узнать, свободна ли дата». Одно на страницу, открывается из любой кнопки.
let open = false;
const subs = new Set();
const emit = () => subs.forEach((f) => f());

export function openQuick() {
  open = true;
  emit();
}

export function closeQuick() {
  open = false;
  emit();
}

function subscribe(f) {
  subs.add(f);
  return () => subs.delete(f);
}

export function useQuickOpen() {
  return useSyncExternalStore(subscribe, () => open, () => false);
}

/**
 * Обработчик для ссылок href="#contact": без JS ссылка ведёт к форме, с JS открывает окно.
 * Клик с модификатором (новая вкладка) не перехватывается.
 */
export function onQuickClick(e) {
  if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  openQuick();
}
