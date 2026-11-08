/**
 * Копирует текст. Возвращает true при успехе.
 * Сначала Clipboard API; если он недоступен или запрещён, пробуем выделить текст
 * в переданном поле и выполнить команду копирования. Если и это не вышло — false,
 * и интерфейс предлагает скопировать вручную (текст уже выделен).
 */
export async function copyText(text, field) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // переходим к запасному способу
  }
  if (!field) return false;
  field.focus();
  field.select();
  try {
    return document.execCommand('copy') === true;
  } catch {
    return false;
  }
}
