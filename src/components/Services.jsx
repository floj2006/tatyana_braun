import { EVENTS } from '../config/site.js';
import { track } from '../lib/analytics.js';

export default function Services({ onSelect }) {
  return (
    <section className="section" id="services">
      <div className="container">
        <p className="eyebrow">Форматы праздников</p>
        <h2>Какой у вас повод?</h2>
        <p className="section__lead">
          Каждый праздник — отдельная история. Выберите свой формат и напишите: подготовим программу именно под вас.
        </p>
        <div className="cards">
          {EVENTS.map((e, i) => (
            <article className="card" key={e.id}>
              <span className="card__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{e.title}</h3>
              <p>{e.text}</p>
              <a
                href="#contact"
                className="card__link"
                onClick={() => {
                  onSelect(e.id);
                  track('event_select', { event: e.id });
                }}
              >
                Обсудить →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
