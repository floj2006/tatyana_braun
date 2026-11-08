import { useRef, useState } from 'react';
import { SITE } from '../content/site.js';

export default function Header({ nav }) {
  const [open, setOpen] = useState(false);
  const btn = useRef(null);

  // Escape закрывает меню, фокус возвращается на кнопку. Фокус при открытом меню всегда в шапке.
  function onKeyDown(e) {
    if (e.key === 'Escape' && open) {
      setOpen(false);
      btn.current?.focus();
    }
  }

  return (
    <header className="header" onKeyDown={onKeyDown}>
      <div className="wrap header__in">
        <a href="#top" className="logo">{SITE.name}</a>
        <nav className={`nav${open ? ' is-open' : ''}`} id="site-nav" aria-label="Разделы сайта">
          <ul>
            {nav.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a href="#contact" className="btn btn--primary btn--sm header__cta">Узнать дату</a>
        <button
          ref={btn}
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="menu-btn__icon" aria-hidden="true" />
          <span className="sr-only">{open ? 'Закрыть меню' : 'Открыть меню'}</span>
        </button>
      </div>
    </header>
  );
}
