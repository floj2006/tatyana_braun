function rowsOf(data) {
  return [
    ['Длительность', data.duration],
    ['DJ, звук и оборудование', data.equipment],
    ['Бронирование', data.booking],
    ['Стоимость', data.price],
  ].filter(([, v]) => v);
}

/** Есть ли что показать в разделе условий. Используется и для меню. */
export function hasTerms(data) {
  return Boolean(data && (data.includes?.length || rowsOf(data).length));
}

export default function Terms({ data }) {
  if (!hasTerms(data)) return null;
  const rows = rowsOf(data);
  return (
    <section className="section terms reveal" id="terms" aria-labelledby="terms-title">
      <div className="wrap terms__in">
        <div>
          <h2 id="terms-title">{data.title}</h2>
          {data.includes?.length > 0 && (
            <>
              <h3 className="terms__sub">Что входит</h3>
              <ul className="terms__includes">
                {data.includes.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </>
          )}
        </div>
        <div>
          {rows.length > 0 && (
            <dl className="terms__dl">
              {rows.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
          <a className="btn btn--accent terms__cta" href="#contact">
            Узнать стоимость для своей даты
          </a>
        </div>
      </div>
    </section>
  );
}
