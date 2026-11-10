import { useEffect, useId, useRef, useState } from 'react';
import Title from './Title.jsx';
import Carousel, { QuickCta } from './Carousel.jsx';
import { safeUrl } from '../content/site.js';

const SOURCE_HOSTS = ['vk.ru', 'vk.com', 'm.vk.ru', 'm.vk.com'];
// Длинный отзыв в ленте обрезан визуально и открывается целиком в окне.
// Полный текст всё равно в HTML карточки (поиск и экранные читалки).
const LONG = 320;

const isLong = (r) => !r.image && r.text.length > LONG;

// Автор и ссылка на источник. Только из подтверждённого; пустые не выводятся.
function Caption({ r }) {
  const src = safeUrl(r.source || '', SOURCE_HOSTS);
  if (!r.author && !src) return null;
  return (
    <figcaption>
      {r.author}
      {src && (
        <>
          {r.author && ' · '}
          <a href={src} target="_blank" rel="noopener noreferrer">
            Источник<span className="sr-only"> (откроется в новой вкладке)</span>
          </a>
        </>
      )}
    </figcaption>
  );
}

// Отзыв-обложка: сверху повод, текст, снизу автор.
function Review({ r, onOpen }) {
  const long = isLong(r);
  return (
    <li className="reviews__item">
      <figure className={`review${r.image ? ' review--image' : ''}`}>
        <p className="review__event">{r.event || 'Отзыв'}</p>
        {r.image ? (
          <img src={r.image.src} width={r.image.width} height={r.image.height} alt={r.image.alt} loading="lazy" decoding="async" />
        ) : (
          <blockquote className={`review__text${long ? ' is-clamped' : ''}`}>
            <p>{r.text}</p>
          </blockquote>
        )}
        {long && (
          <button type="button" className="review__more" aria-haspopup="dialog" onClick={onOpen}>
            Читать полностью
          </button>
        )}
        <Caption r={r} />
      </figure>
    </li>
  );
}

// Одно окно на весь раздел: полный текст выбранного отзыва в той же обложке.
// Нативный <dialog>: фокус внутри, Esc закрывает, фокус возвращается на кнопку.
function ReviewDialog({ r, onClose }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (r && d && !d.open) d.showModal();
  }, [r]);

  return (
    <dialog
      ref={ref}
      className="sheet review-dialog"
      aria-labelledby={r ? titleId : undefined}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current.close()}
    >
      {r && (
        <figure className="review review--full sheet__card">
          <button type="button" className="sheet__close" onClick={() => ref.current.close()}>
            <span className="sr-only">Закрыть</span>
          </button>
          <p className="review__event" id={titleId}>
            {r.event || 'Отзыв'}
          </p>
          {/* длинный текст прокручивается внутри окна, поэтому доступен с клавиатуры */}
          <blockquote className="review__text" tabIndex={0}>
            <p>{r.text}</p>
          </blockquote>
          <Caption r={r} />
        </figure>
      )}
    </dialog>
  );
}

// Только реальные отзывы: текстом или скриншотом. Без них раздел не рендерится.
export default function Reviews({ items }) {
  const [active, setActive] = useState(null);
  if (!items?.length) return null;
  return (
    <section className="section reviews reveal" id="reviews" aria-labelledby="reviews-title">
      <div className="wrap">
        <Title id="reviews-title" text="Отзывы" />
        <Carousel className="reviews__list" label="Отзывы, листаются по горизонтали" extra={<QuickCta />}>
          {items.map((r, i) => (
            <Review r={r} key={r.id ?? i} onOpen={() => setActive(i)} />
          ))}
        </Carousel>
        {items.some(isLong) && <ReviewDialog r={active === null ? null : items[active]} onClose={() => setActive(null)} />}
      </div>
    </section>
  );
}
