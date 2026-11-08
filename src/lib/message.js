export const LIMITS = { city: 80, guests: 4, comment: 500 };

/** Убирает управляющие символы, схлопывает пробелы и обрезает по длине. */
export function clean(value, max) {
  return String(value ?? '')
    // eslint-disable-next-line no-control-regex -- убираем именно управляющие символы
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/** '2027-06-14' → '14 июня 2027 г.'; некорректная строка → ''. */
export function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  if (!m) return '';
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (d.getUTCMonth() !== +m[2] - 1) return '';
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(d);
}

/**
 * Текст сообщения Татьяне. Поля уже должны пройти validate().
 * on — продолжение фразы «Ищу ведущую на …».
 */
export function buildMessage({ on, date, noDate, city, guests, comment }) {
  const lines = [`Здравствуйте, Татьяна. Ищу ведущую на ${clean(on, 60)}.`];
  lines.push(noDate ? 'Дата: пока не выбрана' : `Дата: ${formatDate(date)}`);
  lines.push(`Город: ${clean(city, LIMITS.city)}`);
  const g = clean(guests, LIMITS.guests);
  if (g) lines.push(`Гостей: примерно ${g}`);
  const c = clean(comment, LIMITS.comment);
  if (c) lines.push('', c);
  lines.push('', noDate ? 'Подскажите, пожалуйста, сколько это будет стоить.' : 'Вы свободны в этот день? Сколько это будет стоить?');
  return lines.join('\n');
}
