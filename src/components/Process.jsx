import Terms from './Terms.jsx';

export default function Process({ data, terms }) {
  if (!data?.steps?.length) return null;
  return (
    <section className="section process reveal" id="process" aria-labelledby="process-title">
      <div className="wrap process__in">
        <div>
          <h2 id="process-title">{data.title}</h2>
          <ol className="process__list">
            {data.steps.map((s, i) => (
              <li key={s.title}>
                <span className="process__n" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <Terms data={terms} />
      </div>
    </section>
  );
}
