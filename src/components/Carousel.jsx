import { useEffect, useId, useRef, useState } from 'react';
import { onQuickClick } from '../lib/quickContact.js';

// Лента с прокруткой и кнопками «назад/вперёд». Без библиотек: нативный scroll-snap,
// листается пальцем, колесом, стрелками с клавиатуры и кнопками.
// extra — элемент слева в строке под лентой (например, кнопка заявки), кнопки листания справа.
export default function Carousel({ label, className = '', extra = null, children }) {
  const track = useRef(null);
  const trackId = useId();
  // до гидрации кнопки видны, «назад» выключена
  const [edge, setEdge] = useState({ start: true, end: false, fits: false });

  function update() {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4, fits: max <= 4 });
  }

  useEffect(() => {
    update();
    const ro = new ResizeObserver(update);
    ro.observe(track.current);
    return () => ro.disconnect();
  }, []);

  function go(dir) {
    const el = track.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
  }

  return (
    <div className={`carousel ${className}`}>
      <div id={trackId} ref={track} className="carousel__track" tabIndex={0} role="region" aria-label={label} onScroll={update}>
        <ul className="carousel__list stagger">{children}</ul>
      </div>
      {(extra || !edge.fits) && (
        <div className="carousel__nav">
          {extra && <div className="carousel__extra">{extra}</div>}
          {!edge.fits && (
            <div className="carousel__arrows">
              <button type="button" className="carousel__btn carousel__btn--prev" aria-controls={trackId} disabled={edge.start} onClick={() => go(-1)}>
                <span className="sr-only">Назад</span>
              </button>
              <button type="button" className="carousel__btn carousel__btn--next" aria-controls={trackId} disabled={edge.end} onClick={() => go(1)}>
                <span className="sr-only">Вперёд</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Кнопка заявки под лентой: без JS ведёт к форме, с JS открывает окно связи.
export const QuickCta = ({ className = 'btn btn--line' }) => (
  <a className={className} href="#contact" aria-haspopup="dialog" onClick={onQuickClick}>
    Узнать, свободна ли дата
  </a>
);
