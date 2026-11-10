import { LIMITS } from './message.js';

/** Сегодняшняя дата в формате YYYY-MM-DD по локальному времени. */
export function todayIso(now = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(now.getDate())}`;
}

/**
 * Проверка полей обращения. Возвращает { поле: текст ошибки }; пустой объект — всё верно.
 * formats — список допустимых id формата.
 */
export function validate(v, { formats, today }) {
  const e = {};
  if (!formats.includes(v.format)) e.format = 'Выберите формат праздника.';

  if (!v.noDate) {
    if (!v.date) e.date = 'Укажите дату или отметьте, что её пока нет.';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(v.date)) e.date = 'Дата указана в неверном формате.';
    else if (v.date < today) e.date = 'Эта дата уже прошла.';
  }

  // Город по желанию: большинство праздников в Челябинске.
  const city = String(v.city ?? '').trim();
  if (city.length > LIMITS.city) e.city = `Не больше ${LIMITS.city} символов.`;

  const guests = String(v.guests ?? '').trim();
  if (guests && !/^\d{1,4}$/.test(guests)) e.guests = 'Только число, например 40.';
  else if (guests && Number(guests) < 1) e.guests = 'Гостей должно быть хотя бы 1.';

  if (String(v.comment ?? '').length > LIMITS.comment) e.comment = `Не больше ${LIMITS.comment} символов.`;
  return e;
}
