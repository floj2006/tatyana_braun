export default function Formats({ items, selected, onChoose }) {
  if (!items?.length) return null;
  return (
    <section className="section formats reveal" id="formats" aria-labelledby="formats-title">
      <div className="wrap">
        <div className="section__head">
          <h2 id="formats-title">Форматы мероприятий</h2>
          <p className="lead">Нажмите на подходящий, и он подставится в форму заявки.</p>
        </div>
        <ul className="formats__list">
          {items.map((f, i) => {
            const active = f.id === selected;
            return (
              <li key={f.id} className={`formats__row${active ? ' is-active' : ''}`}>
                <span className="num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
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
