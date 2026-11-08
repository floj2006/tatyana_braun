import Title from './Title.jsx';

function rowsOf(data) {
  return [
    ['Длительность', data.duration],
    ['DJ, звук и оборудование', data.equipment],
    ['Бронирование', data.booking],
    ['Стоимость', data.price],
  ].filter(([, v]) => v);
}

/** Есть ли что показать в разделе стоимости. */
export function hasTerms(data) {
  return Boolean(data && (data.includes?.length || rowsOf(data).length));
}

// «Стоимость»: что входит (карточки) и как считается цена. Тарифы появятся вместе с ценами.
export default function Terms({ data }) {
  if (!hasTerms(data)) return null;
  const rows = rowsOf(data);
  return (
    <section className="section pricing reveal" id="pricing" aria-labelledby="pricing-title">
      <div className="wrap">
        <Title id="pricing-title" text="Стоимость" />
        {data.includes?.length > 0 && (
          <>
            <p className="pricing__sub">Входит в любой праздник</p>
            <ul className="pricing__cards">
              {data.includes.map((x, i) => (
                <li key={x}>
                  <span className="num" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p>{x}</p>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="pricing__foot">
          {rows.length > 0 && (
            <dl className="pricing__dl">
              {rows.map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          )}
          <a className="btn btn--primary" href="#contact">
            Узнать стоимость для своей даты
          </a>
        </div>
      </div>
    </section>
  );
}
