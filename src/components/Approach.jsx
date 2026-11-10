import Title from './Title.jsx';
import { QuickCta } from './Carousel.jsx';

// «Почему выбирают меня» на главной и «Как я провожу…» на страницах форматов.
// Заголовок, абзацы (intro — строка или массив), пункты строками, завершающая строка с кнопкой (closing).
export default function Approach({ data, id = 'approach' }) {
  if (!data?.items?.length) return null;
  const intro = Array.isArray(data.intro) ? data.intro : data.intro ? [data.intro] : [];
  return (
    <section className="section approach section--dark reveal" id={id} aria-labelledby={`${id}-title`}>
      <div className="wrap">
        <div className={`approach__head${intro.length > 1 ? ' approach__head--wide' : ''}`}>
          <Title id={`${id}-title`} text={data.title} />
          {intro.length > 0 && (
            <div className="approach__intro">
              {intro.map((t) => (
                <p className="lead" key={t}>
                  {t}
                </p>
              ))}
            </div>
          )}
        </div>
        <ol className="approach__items stagger">
          {data.items.map((it, i) => (
            <li className="approach__item" key={it.title}>
              <span className="num" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </li>
          ))}
        </ol>
        {data.closing && (
          <div className="approach__close">
            <p>{data.closing}</p>
            <QuickCta className="btn btn--primary" />
          </div>
        )}
      </div>
    </section>
  );
}
