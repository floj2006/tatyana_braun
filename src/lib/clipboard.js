/**
 * Синхронное копирование внутри обработчика клика. Нужно, чтобы скопировать текст
 * и сразу открыть VK в новой вкладке: асинхронный Clipboard API в этот момент может
 * отказать из-за потери фокуса. Возвращает true при успехе.
 */
export function copySync(text) {
  if (typeof document === 'undefined') return false;
  const active = document.activeElement;
  const buffer = document.createElement('textarea');
  buffer.value = text;
  buffer.setAttribute('readonly', '');
  buffer.setAttribute('aria-hidden', 'true');
  buffer.className = 'copy-buffer';
  document.body.appendChild(buffer);
  buffer.select();
  buffer.setSelectionRange(0, text.length);
  let ok = false;
  try {
    ok = document.execCommand('copy') === true;
  } catch {
    ok = false;
  }
  buffer.remove();
  active?.focus?.({ preventScroll: true });
  return ok;
}

/**
 * Копирование по отдельной кнопке: сначала Clipboard API, затем синхронный способ.
 * Если не вышло ни так, ни так — false, и интерфейс предлагает скопировать вручную.
 */
export async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // переходим к запасному способу
  }
  return copySync(text);
}
