import { SITE } from '../config/site.js';
import { track } from '../lib/analytics.js';

export default function Header() {
  return (
    <header className="header">
      <div className="container header__in">
        <a href="#top" className="logo" aria-label={`${SITE.name}, наверх`}>{SITE.name}</a>
        <nav className="nav" aria-label="Основное меню">
          <a href="#services">Праздники</a>
          <a href="#contact" className="nav__cta" onClick={() => track('cta_click', { place: 'header' })}>Написать</a>
        </nav>
      </div>
    </header>
  );
}
