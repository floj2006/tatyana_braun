import { STEPS } from '../config/site.js';

export default function Steps() {
  return (
    <section className="section section--silver" id="steps">
      <div className="container">
        <p className="eyebrow">Как проходит работа</p>
        <h2>Четыре простых шага</h2>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="steps__n" aria-hidden="true">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
