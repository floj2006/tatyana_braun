import { useState } from 'react';
import { SITE } from '../config/site.js';
import { track } from '../lib/analytics.js';

const LINKS = [
  ['#services', 'Праздники'],
  ['#about', 'Обо мне'],
  ['#packages', 'Форматы'],
  ['#gallery', 'Фото'],
  ['#faq', 'Вопросы'],
];

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="container header__in">
        <a href="#top" className="logo" aria-label={`${SITE.name}, на главную`}>
          Татьяна <em>Браун</em>
        </a>
        <nav className={`nav${open ? ' open' : ''}`} aria-label="Основное меню">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </nav>
        <a href="#contact" className="btn btn--sm btn--dark header__cta" onClick={() => track('cta_click', { place: 'header' })}>
          Узнать про дату
        </a>
        <button
          type="button"
          className="burger"
          aria-label="Меню"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span /><span />
        </button>
      </div>
    </header>
  );
}
