import { onQuickClick } from '../lib/quickContact.js';

// Финальный призыв перед формой заявки. Кнопка без JS ведёт к форме, с JS открывает окно связи.
export default function FinalCta({ data }) {
  if (!data?.title) return null;
  return (
    <section className="final reveal" aria-labelledby="final-title">
      <div className="wrap final__in">
        <h2 id="final-title" className="final__title">
          {data.title}
        </h2>
        {data.text && <p className="final__text">{data.text}</p>}
        <a className="btn btn--primary" href="#contact" aria-haspopup="dialog" onClick={onQuickClick}>
          {data.button || 'Узнать, свободна ли дата'}
        </a>
      </div>
    </section>
  );
}
