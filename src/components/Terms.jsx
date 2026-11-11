import Title from './Title.jsx';
import Icon from './Icon.jsx';
import { onQuickClick } from '../lib/quickContact.js';

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

// «Что входит в стоимость»: карточки (номер, название, текст, картинка по желанию) и как считается цена.
// Пункт — строка или { title, text, image }. Тарифы появятся вместе с ценами.
export default function Terms({ data }) {
  if (!hasTerms(data)) return null;
  const rows = rowsOf(data);
  return (
    <section className="section pricing reveal" id="pricing" aria-labelledby="pricing-title">
      <div className="wrap">
        <Title id="pricing-title" text={data.title || 'Стоимость'} />
        {data.includes?.length > 0 && (
          <ul className="pricing__cards stagger">
            {data.includes.map((x, i) => {
              const it = typeof x === 'string' ? { title: x } : x;
              return (
                <li key={it.title} className={it.image ? 'has-image' : undefined}>
                  {it.image && (
                    <img src={it.image.src} width={it.image.width} height={it.image.height} alt={it.image.alt || ''} loading="lazy" decoding="async" />
                  )}
                  <div className="pricing__top">
                    {it.icon && !it.image && (
                      <span className="pricing__icon">
                        <Icon name={it.icon} />
                      </span>
                    )}
                    <span className="pricing__num" aria-hidden="true">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3>{it.title}</h3>
                  {it.text && <p>{it.text}</p>}
                </li>
              );
            })}
          </ul>
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
          <a className="btn btn--primary" href="#contact" aria-haspopup="dialog" onClick={onQuickClick}>
            Узнать стоимость для своей даты
          </a>
        </div>
      </div>
    </section>
  );
}
