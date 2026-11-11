import Title from './Title.jsx';

export default function Process({ data }) {
  if (!data?.steps?.length) return null;
  return (
    <section className="section process reveal" id="process" aria-labelledby="process-title">
      <div className="wrap process__in">
        <div>
          <Title id="process-title" text={data.title} />
          <ol className="process__list stagger">
            {data.steps.map((s, i) => (
              <li key={s.title}>
                <span className="process__n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{s.title}</h3>
                  {s.tagline && <p className="process__tag">{s.tagline}</p>}
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
