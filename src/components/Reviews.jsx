import { REVIEWS, SITE } from '../config/site.js';
import { track } from '../lib/analytics.js';

export default function Reviews() {
  return (
    <section className="section section--silver" id="reviews">
      <div className="container">
        <p className="eyebrow">Отзывы</p>
        <h2>Что говорят о праздниках</h2>
        {REVIEWS.length > 0 ? (
          <div className="reviews">
            {REVIEWS.map((r) => (
              <blockquote className="review" key={r.name + r.event}>
                <p>{r.text}</p>
                <footer>
                  <b>{r.name}</b>, {r.event}
                </footer>
              </blockquote>
            ))}
          </div>
        ) : (
          <div className="reviews-empty">
            <p>Живые отзывы гостей и пар собраны в сообществе VK: там можно прочитать их и посмотреть фото с праздников.</p>
            {SITE.vk && (
              <a className="btn btn--dark" href={SITE.vk} target="_blank" rel="noopener noreferrer" onClick={() => track('click_vk', { place: 'reviews' })}>
                Читать отзывы во VK
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
