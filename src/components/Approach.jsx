import Title from './Title.jsx';
export default function Approach({ data, id = 'approach' }) {
  if (!data?.items?.length) return null;
  return (
    <section className="section approach section--dark reveal" id={id} aria-labelledby={`${id}-title`}>
      <div className="wrap">
        <div className="approach__head">
          <Title id={`${id}-title`} text={data.title} />
          {Array.isArray(data.intro) ? (
            <div className="approach__intro">
              {data.intro.map((t) => (
                <p className="lead" key={t}>
                  {t}
                </p>
              ))}
            </div>
          ) : (
            data.intro && <p className="lead">{data.intro}</p>
          )}
        </div>
        <div className="approach__items stagger">
          {data.items.map((it, i) => (
            <article className="approach__item" key={it.title}>
              <span className="num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
