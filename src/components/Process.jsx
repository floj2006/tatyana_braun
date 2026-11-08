export default function Process({ data }) {
  if (!data?.steps?.length) return null;
  return (
    <section className="section process reveal" id="process" aria-labelledby="process-title">
      <div className="wrap">
        <h2 id="process-title">{data.title}</h2>
        <ol className="process__list">
          {data.steps.map((s) => (
            <li key={s.title}>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
