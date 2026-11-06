// Всё, что нужно менять в контенте, лежит здесь.
// Пустое значение скрывает свой блок: сайт не показывает то, чего нет.

/** Пропускает только https-ссылки на разрешённые хосты, иначе возвращает ''. */
export function safeUrl(url, hosts) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && hosts.includes(u.hostname) ? u.href : '';
  } catch {
    return '';
  }
}

export const SITE = {
  name: 'Татьяна Браун',
  role: 'Ведущая праздников',
  vk: safeUrl('https://vk.ru/brauntv', ['vk.ru', 'vk.com']),
  telegram: safeUrl('', ['t.me']), // 'https://t.me/username'
  showreelUrl: safeUrl('', ['vk.ru', 'vk.com', 'vkvideo.ru']), // ссылка на видео; пусто, блок скрыт
  metrikaId: '', // номер счётчика Яндекс.Метрики; пусто, аналитика выключена
};

// Какие праздники она ведёт. Список предположительный, уточнить у Татьяны.
// title: строка в списке и в форме; on: «ищу ведущую на ...».
export const EVENTS = [
  { id: 'wedding', title: 'Свадьбы', on: 'свадьбу' },
  { id: 'anniversary', title: 'Юбилеи', on: 'юбилей' },
  { id: 'corporate', title: 'Корпоративы', on: 'корпоратив' },
  { id: 'birthday', title: 'Дни рождения', on: 'день рождения' },
  { id: 'kids', title: 'Детские праздники', on: 'детский праздник' },
  { id: 'other', title: 'Другое', on: 'праздник' },
];

// Абзацы «Обо мне» её словами. Пока пусто, блока на сайте нет.
export const ABOUT = { paragraphs: [] };

// Настоящие отзывы: { name, event, text }. Пока пусто, блока на сайте нет.
export const REVIEWS = [];
