/* ========= НАСТРОЙКИ — меняйте только здесь ========= */
var CONFIG = {
  vk: 'https://vk.ru/brauntv',
  telegram: '' // например: 'https://t.me/username' — пока пусто, кнопки Telegram скрыты
};
/* ===================================================== */

(function () {
  'use strict';

  // ссылки на мессенджеры
  document.querySelectorAll('[data-link="vk"]').forEach(function (a) { a.href = CONFIG.vk; });
  document.querySelectorAll('[data-link="tg"]').forEach(function (a) {
    if (CONFIG.telegram) { a.href = CONFIG.telegram; a.hidden = false; }
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  // мобильное меню
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  function closeNav() { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });

  // фото: если файл найден — прячем подсказку
  [['heroPhoto', 'img/tatyana.jpg'], ['aboutPhoto', 'img/about.jpg']].forEach(function (p) {
    var el = document.getElementById(p[0]);
    var img = new Image();
    img.onload = function () { el.classList.add('has-img'); };
    img.src = p[1];
  });

  // выбор формата по клику на карточку
  var fEvent = document.getElementById('fEvent');
  document.querySelectorAll('[data-event]').forEach(function (a) {
    a.addEventListener('click', function () { fEvent.value = a.getAttribute('data-event'); });
  });

  // форма: собираем сообщение, копируем, открываем чат
  var form = document.getElementById('leadForm');
  var hint = document.getElementById('formHint');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = function (id) { return document.getElementById(id).value.trim(); };
    var lines = ['Здравствуйте, Татьяна! Хочу пригласить вас ведущей.', 'Повод: ' + fEvent.value];
    if (v('fDate')) lines.push('Дата: ' + v('fDate'));
    if (v('fGuests')) lines.push('Гостей: ' + v('fGuests'));
    if (v('fPlace')) lines.push('Город и площадка: ' + v('fPlace'));
    lines.push('Подскажите, пожалуйста, свободна ли дата и какая будет стоимость.');
    if (v('fName')) lines.push('Меня зовут ' + v('fName') + '.');
    var text = lines.join('\n');

    var target = CONFIG.telegram
      ? CONFIG.telegram + (CONFIG.telegram.indexOf('?') > -1 ? '&' : '?') + 'text=' + encodeURIComponent(text)
      : CONFIG.vk;

    function done(copied) {
      hint.className = 'form__hint ok';
      hint.textContent = copied
        ? 'Сообщение скопировано. Вставьте его в чат и отправьте.'
        : 'Откройте чат и напишите: ' + text.replace(/\n/g, ' ');
      window.open(target, '_blank', 'noopener');
    }
    // окно нужно открывать в обработчике клика, поэтому копируем без ожидания
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else { done(false); }
  });

  // плавающая кнопка прячется у формы
  var fab = document.querySelector('.fab');
  var contact = document.getElementById('contact');
  if (fab && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      fab.classList.toggle('hide', en[0].isIntersecting);
    }, { threshold: 0.15 }).observe(contact);
  }
})();
