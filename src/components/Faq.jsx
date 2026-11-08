export default function Faq({ items }) {
  if (!items?.length) return null;
  return (
    <section className="section faq reveal" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq__in">
        <h2 id="faq-title">Частые вопросы</h2>
        <div>
          {items.map(({ q, a }) => (
            <details className="faq__item" key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
