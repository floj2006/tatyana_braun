import { EVENTS } from '../config/site.js';
import { track } from '../lib/analytics.js';

export default function Services({ onSelect }) {
  return (
    <section className="section" id="services">
      <div className="container list-wrap">
        <h2>Праздники</h2>
        <ul className="rows">
          {EVENTS.map((e) => (
            <li key={e.id}>
              <a
                href="#contact"
                onClick={() => {
                  onSelect(e.id);
                  track('event_select', { event: e.id });
                }}
              >
                <span className="rows__title">{e.title}</span>
                <span className="rows__text">{e.text}</span>
                <small>Обсудить</small>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
