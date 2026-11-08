export default function Approach({ data }) {
  if (!data?.items?.length) return null;
  return (
    <section className="section approach reveal" id="approach" aria-labelledby="approach-title">
      <div className="wrap">
        <div className="approach__head">
          <h2 id="approach-title">{data.title}</h2>
          {data.intro && <p className="lead">{data.intro}</p>}
        </div>
        <div className="approach__items">
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
