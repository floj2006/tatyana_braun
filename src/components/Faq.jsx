import { FAQ } from '../config/site.js';
import { track } from '../lib/analytics.js';

export default function Faq() {
  return (
    <section className="section" id="faq">
      <div className="container container--narrow">
        <p className="eyebrow">Вопросы</p>
        <h2>Частые вопросы</h2>
        {FAQ.map(([q, a], i) => (
          <details className="faq" key={q} onToggle={(e) => e.currentTarget.open && track('faq_open', { n: i + 1 })}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
