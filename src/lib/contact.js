const rub = new Intl.NumberFormat('ru-RU');

/** «от 15 000 ₽» или '' для неподтверждённой цены. */
export function priceLabel(value) {
  return Number.isFinite(value) && value > 0 ? `от ${rub.format(value)} ₽` : '';
}

/** Ссылка WhatsApp с готовым текстом (формат wa.me официально поддерживает ?text=). '' — номер не задан. */
export function whatsappUrl(phone, text) {
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return '';
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

/** Занята ли дата (ISO 'ГГГГ-ММ-ДД'). */
export function isBusy(date, busyDates) {
  return Boolean(date) && busyDates.includes(date);
}
