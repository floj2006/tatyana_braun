import Title from './Title.jsx';
import { formatPath } from '../routes.js';
import { priceLabel } from '../lib/contact.js';

export default function Formats({ items, selected, onChoose }) {
  if (!items?.length) return null;
  return (
    <section className="section formats reveal" id="formats" aria-labelledby="formats-title">
      <div className="wrap">
        <div className="section__head">
          <Title id="formats-title" text="Форматы" />
          <p className="lead">Нажмите на подходящий, и он подставится в форму заявки.</p>
        </div>
        <ul className="formats__list">
          {items.map((f, i) => {
            const active = f.id === selected;
            return (
              <li key={f.id} className={`formats__row${active ? ' is-active' : ''}`}>
                <span className="num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{f.title}</h3>
                <div className="formats__body">
                  <p>{f.text}</p>
                  {(priceLabel(f.priceFrom) || formatPath(f)) && (
                    <p className="formats__meta">
                      {priceLabel(f.priceFrom) && <span className="formats__price">{priceLabel(f.priceFrom)}</span>}
                      {formatPath(f) && (
                        <a className="formats__more" href={formatPath(f)}>
                          Подробнее<span className="sr-only"> о формате «{f.title}»</span>
                        </a>
                      )}
                    </p>
                  )}
                </div>
                {/* Кнопка растянута на всю строку (::after), поэтому кликабельна вся строка. */}
                <button type="button" className="formats__pick" aria-pressed={active} onClick={() => onChoose(f.id)}>
                  {active ? 'Выбрано' : 'Выбрать'}
                  <span className="sr-only">: {f.title.toLowerCase()}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
