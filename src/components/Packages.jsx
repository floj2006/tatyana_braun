import { PACKAGES } from '../config/site.js';
import { track } from '../lib/analytics.js';

const fmt = (n) => new Intl.NumberFormat('ru-RU').format(n);

export default function Packages() {
  return (
    <section className="section" id="packages">
      <div className="container">
        <p className="eyebrow">Форматы работы</p>
        <h2>Выберите, как вам удобнее</h2>
        <p className="section__lead">Точную стоимость назову после знакомства с вашим праздником, без скрытых платежей.</p>
        <div className="pkgs">
          {PACKAGES.map((p) => (
            <article className={`pkg${p.featured ? ' pkg--featured' : ''}`} key={p.id}>
              {p.featured && <span className="pkg__tag">Выбирают чаще</span>}
              <h3>{p.name}</h3>
              <p className="pkg__text">{p.text}</p>
              <ul>
                {p.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
              <p className="pkg__price">{p.price ? `от ${fmt(p.price)} ₽` : 'Стоимость — по запросу'}</p>
              <a
                href="#contact"
                className={`btn btn--block ${p.featured ? 'btn--silver' : 'btn--ghost'}`}
                onClick={() => track('cta_click', { place: 'package', package: p.id })}
              >
                Узнать стоимость
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
