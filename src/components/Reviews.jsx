import { useId, useState } from 'react';
import Title from './Title.jsx';
import { safeUrl } from '../content/site.js';

const SOURCE_HOSTS = ['vk.ru', 'vk.com', 'm.vk.ru', 'm.vk.com'];
// Длинный отзыв визуально сворачивается; полный текст всё равно в HTML (поиск и экранные читалки).
const LONG = 320;

function Review({ r }) {
  const [open, setOpen] = useState(false);
  const textId = useId();
  const src = safeUrl(r.source || '', SOURCE_HOSTS);
  const caption = [r.author, r.event].filter(Boolean).join(', ');
  const long = !r.image && r.text.length > LONG;
  return (
    <figure className={`review${r.image ? ' review--image' : ''}`}>
      {r.image ? (
        <img src={r.image.src} width={r.image.width} height={r.image.height} alt={r.image.alt} loading="lazy" decoding="async" />
      ) : (
        <blockquote id={textId} className={`review__text${long && !open ? ' is-clamped' : ''}`}>
          <p>{r.text}</p>
        </blockquote>
      )}
      {long && (
        <button type="button" className="review__more" aria-expanded={open} aria-controls={textId} onClick={() => setOpen((v) => !v)}>
          {open ? 'Свернуть' : 'Читать полностью'}
        </button>
      )}
      {(caption || src) && (
        <figcaption>
          {caption}
          {src && (
            <>
              {caption && ' · '}
              <a href={src} target="_blank" rel="noopener noreferrer">
                Источник<span className="sr-only"> (откроется в новой вкладке)</span>
              </a>
            </>
          )}
        </figcaption>
      )}
    </figure>
  );
}

// Только реальные отзывы: текстом или скриншотом. Без них раздел не рендерится.
export default function Reviews({ items }) {
  if (!items?.length) return null;
  return (
    <section className="section reviews reveal" id="reviews" aria-labelledby="reviews-title">
      <div className="wrap">
        <Title id="reviews-title" text="Отзывы" />
        <div className="reviews__list" tabIndex={0} role="region" aria-label="Отзывы, листаются по горизонтали">
          {items.map((r, i) => (
            <Review r={r} key={r.id ?? i} />
          ))}
        </div>
      </div>
    </section>
  );
}
