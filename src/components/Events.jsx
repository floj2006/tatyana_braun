// Реальные мероприятия. Без подтверждённых материалов раздел не рендерится.
export default function Events({ items }) {
  if (!items?.length) return null;
  return (
    <section className="section events reveal" id="events" aria-labelledby="events-title">
      <div className="wrap">
        <h2 id="events-title">Праздники, которые вела Татьяна</h2>
        <div className="events__list">
          {items.map((ev) => (
            <article className="event" key={ev.id}>
              <div className="event__photos">
                {ev.photos.map((p) => (
                  <img key={p.src} src={p.src} width={p.width} height={p.height} alt={p.alt} loading="lazy" decoding="async" />
                ))}
              </div>
              <div className="event__text">
                <p className="event__meta">{[ev.format, ev.date].filter(Boolean).join(', ')}</p>
                <h3>{ev.title}</h3>
                <p>{ev.story}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
