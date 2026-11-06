const MAX = { date: 40, guests: 10, place: 120, name: 50 };

/** Убирает управляющие символы и обрезает по длине. */
export function clean(value, max) {
  return String(value ?? '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/** event: фраза после «на», например «свадьбу». */
export function buildMessage({ event, date, guests, place, name }) {
  const lines = [`Здравствуйте, Татьяна. Ищу ведущую на ${clean(event, 40)}.`];
  const d = clean(date, MAX.date);
  const g = clean(guests, MAX.guests);
  const p = clean(place, MAX.place);
  const n = clean(name, MAX.name);
  if (d) lines.push(`Дата: ${d}`);
  if (p) lines.push(`Город и площадка: ${p}`);
  if (g) lines.push(`Гостей примерно: ${g}`);
  lines.push('Вы свободны в этот день? Сколько это будет стоить?');
  if (n) lines.push(`Меня зовут ${n}.`);
  return lines.join('\n');
}

export const LIMITS = MAX;
