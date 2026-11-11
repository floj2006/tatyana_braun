import Title from './Title.jsx';

// «Вопросы, которые важно задать»: слева заголовок и вступление (head), справа вопросы-раскрывашки.
export default function Faq({ items, head }) {
  if (!items?.length) return null;
  return (
    <section className="section faq reveal" id="faq" aria-labelledby="faq-title">
      <div className="wrap faq__in">
        <div className="faq__head">
          <Title id="faq-title" text={head?.title || 'Частые вопросы'} />
          {head?.subtitle && <p className="faq__subtitle">{head.subtitle}</p>}
          {head?.text && <p className="faq__text">{head.text}</p>}
        </div>
        <div className="stagger">
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
