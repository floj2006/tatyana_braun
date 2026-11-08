import { useEffect, useRef, useState } from 'react';
import { SITE } from '../content/site.js';

export default function Header({ nav }) {
  const [open, setOpen] = useState(false);
  const btn = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="header">
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
        <a href="#contact" className="btn btn--accent btn--sm header__cta">Узнать дату</a>
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
