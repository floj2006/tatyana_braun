function rowsOf(data) {
  return [
    ['Длительность', data.duration],
    ['DJ, звук и оборудование', data.equipment],
    ['Бронирование', data.booking],
    ['Стоимость', data.price],
  ].filter(([, v]) => v);
}

/** Есть ли что показать в блоке условий. */
export function hasTerms(data) {
  return Boolean(data && (data.includes?.length || rowsOf(data).length));
}

// Условия показываются внутри раздела подготовки, отдельной секции нет.
export default function Terms({ data }) {
  if (!hasTerms(data)) return null;
  const rows = rowsOf(data);
  return (
    <aside className="terms" aria-labelledby="terms-title">
      <h3 id="terms-title">Условия и стоимость</h3>
      {data.includes?.length > 0 && (
        <>
          <p className="terms__sub">Что входит</p>
          <ul className="terms__includes">
            {data.includes.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </>
      )}
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
      <a className="btn btn--primary btn--block" href="#contact">
        Узнать стоимость для своей даты
      </a>
    </aside>
  );
}
