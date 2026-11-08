export default function Style({ data }) {
  if (!data?.items?.length) return null;
  return (
    <section className="section style reveal" id="style" aria-labelledby="style-title">
      <div className="wrap style__in">
        <div className="style__head">
          <h2 id="style-title">{data.title}</h2>
          {data.intro && <p className="lead">{data.intro}</p>}
        </div>
        <div className="style__items">
          {data.items.map((it, i) => (
            <article className="style__item" key={it.title}>
              <span className="style__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3>{it.title}</h3>
              <p>{it.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
