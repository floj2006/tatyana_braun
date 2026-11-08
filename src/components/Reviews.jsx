import { safeUrl } from '../content/site.js';

// Только реальные отзывы с автором: { id, author, event, text, source }. Без них раздел не рендерится.
export default function Reviews({ items }) {
  if (!items?.length) return null;
  return (
    <section className="section reviews reveal" id="reviews" aria-labelledby="reviews-title">
      <div className="wrap">
        <h2 id="reviews-title">Отзывы</h2>
        <div className="reviews__list">
          {items.map((r, i) => {
            const src = safeUrl(r.source || '', ['vk.ru', 'vk.com', 'm.vk.ru', 'm.vk.com']);
            return (
              <figure className="review" key={r.id ?? i}>
                <blockquote>
                  <p>{r.text}</p>
                </blockquote>
                <figcaption>
                  {r.author}
                  {r.event && `, ${r.event}`}
                  {src && (
                    <>
                      {' · '}
                      <a href={src} target="_blank" rel="noopener noreferrer">Источник</a>
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
