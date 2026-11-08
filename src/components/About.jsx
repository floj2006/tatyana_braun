export default function About({ data }) {
  if (!data?.paragraphs?.length) return null;
  return (
    <section className="section about reveal" id="about" aria-labelledby="about-title">
      <div className="wrap about__in">
        <div className="about__head">
          <h2 id="about-title">{data.title}</h2>
          {data.quote && <p className="about__quote">{data.quote}</p>}
        </div>
        <div className="about__text">
          {data.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
