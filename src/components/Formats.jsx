export default function Formats({ items, selected, onChoose }) {
  if (!items?.length) return null;
  return (
    <section className="section formats reveal" id="formats" aria-labelledby="formats-title">
      <div className="wrap">
        <h2 id="formats-title">Какие праздники ведёт Татьяна</h2>
        <ul className="formats__list">
          {items.map((f) => {
            const active = f.id === selected;
            return (
              <li key={f.id} className={`formats__row${active ? ' is-active' : ''}`}>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
                <button type="button" className="btn btn--sm btn--line" aria-pressed={active} onClick={() => onChoose(f.id)}>
                  {active ? 'Выбрано' : 'Обсудить'}
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
