import Title from './Title.jsx';
import { safeUrl } from '../content/site.js';

const SOURCE_HOSTS = ['vk.ru', 'vk.com', 'm.vk.ru', 'm.vk.com'];

// Только реальные отзывы с автором: текстом или скриншотом. Без них раздел не рендерится.
export default function Reviews({ items }) {
  if (!items?.length) return null;
  return (
    <section className="section reviews reveal" id="reviews" aria-labelledby="reviews-title">
      <div className="wrap">
        <Title id="reviews-title" text="Отзывы" />
        <div className="reviews__list" tabIndex={0} role="region" aria-label="Отзывы, листаются по горизонтали">
          {items.map((r, i) => {
            const src = safeUrl(r.source || '', SOURCE_HOSTS);
            return (
              <figure className={`review${r.image ? ' review--image' : ''}`} key={r.id ?? i}>
                {r.image ? (
                  <img src={r.image.src} width={r.image.width} height={r.image.height} alt={r.image.alt} loading="lazy" decoding="async" />
                ) : (
                  <blockquote>
                    <p>{r.text}</p>
                  </blockquote>
                )}
                <figcaption>
                  {r.author}
                  {r.event && `, ${r.event}`}
                  {src && (
                    <>
                      {' · '}
                      <a href={src} target="_blank" rel="noopener noreferrer">
                        Источник<span className="sr-only"> (откроется в новой вкладке)</span>
                      </a>
                    </>
                  )}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
