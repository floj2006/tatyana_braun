import { REVIEWS } from '../config/site.js';

// Только настоящие отзывы из REVIEWS. Пусто, блока нет.
export default function Reviews() {
  if (!REVIEWS.length) return null;
  return (
    <section className="section section--soft" id="reviews">
      <div className="container list-wrap">
        <h2>Отзывы</h2>
        {REVIEWS.map((r) => (
          <blockquote className="quote" key={r.name + r.event}>
            <p>{r.text}</p>
            <footer>{r.name}, {r.event}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
