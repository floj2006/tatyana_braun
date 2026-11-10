import { PRIVACY, SITE } from '../content/site.js';

// Телефон в тексте — ссылкой и без переноса посередине номера.
function withPhone(t) {
  if (!SITE.phone || !SITE.phoneHref || !t.includes(SITE.phone)) return t;
  const [before, after] = t.split(SITE.phone);
  return (
    <>
      {before}
      <a className="nowrap" href={SITE.phoneHref}>
        {SITE.phone}
      </a>
      {after}
    </>
  );
}

// Страница «Политика конфиденциальности». Текст целиком в PRIVACY (src/content/site.js).
export default function Privacy() {
  return (
    <article className="section privacy" aria-labelledby="privacy-title">
      <div className="wrap privacy__in">
        <h1 id="privacy-title" className="title privacy__title">
          {PRIVACY.title}
        </h1>
        <p className="privacy__updated">Редакция от {PRIVACY.updated}</p>
        {PRIVACY.sections.map((sec) => (
          <section key={sec.h} className="privacy__section">
            <h2>{sec.h}</h2>
            {sec.p.map((t) => (
              <p key={t}>{withPhone(t)}</p>
            ))}
          </section>
        ))}
      </div>
    </article>
  );
}
