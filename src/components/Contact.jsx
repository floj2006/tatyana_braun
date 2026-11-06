import { useRef, useState } from 'react';
import { EVENTS, SITE } from '../config/site.js';
import { buildMessage, LIMITS } from '../lib/message.js';
import { track } from '../lib/analytics.js';

const empty = { date: '', guests: '', place: '', name: '' };

export default function Contact({ eventId, onEventChange }) {
  const [f, setF] = useState(empty);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const area = useRef(null);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const eventTitle = EVENTS.find((e) => e.id === eventId)?.title ?? EVENTS[0].title;

  // Данные формы никуда не отправляются: сообщение собирается в браузере,
  // копируется в буфер и посетитель сам отправляет его в мессенджер.
  async function onSubmit(e) {
    e.preventDefault();
    const text = buildMessage({ event: eventTitle, ...f });
    setMessage(text);
    track('form_submit', { event: eventId });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
      requestAnimationFrame(() => area.current?.select());
    }
  }

  const tgHref = SITE.telegram
    ? `${SITE.telegram}${message ? `?text=${encodeURIComponent(message)}` : ''}`
    : '';

  return (
    <section className="section section--cta" id="contact">
      <div className="container contact">
        <div className="contact__text">
          <p className="eyebrow eyebrow--light">Свободна ли ваша дата?</p>
          <h2>Напишите мне — отвечу лично</h2>
          <p>
            Заполните мини-анкету: сообщение соберётся само, останется отправить его в мессенджер. Или просто напишите
            своими словами.
          </p>
          <div className="contact__btns">
            {SITE.vk && (
              <a className="btn btn--silver" href={SITE.vk} target="_blank" rel="noopener noreferrer" onClick={() => track('click_vk', { place: 'contact' })}>
                Написать во VK
              </a>
            )}
            {SITE.telegram && (
              <a className="btn btn--ghost-light" href={tgHref} target="_blank" rel="noopener noreferrer" onClick={() => track('click_telegram', { place: 'contact' })}>
                Написать в Telegram
              </a>
            )}
          </div>
        </div>

        <form className="form" onSubmit={onSubmit} noValidate>
          <label>
            Какой праздник?
            <select value={eventId} onChange={(e) => onEventChange(e.target.value)}>
              {EVENTS.map((e) => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
          </label>
          <div className="form__row">
            <label>
              Дата
              <input value={f.date} onChange={set('date')} maxLength={LIMITS.date} placeholder="например, 14 августа" autoComplete="off" />
            </label>
            <label>
              Гостей
              <input value={f.guests} onChange={set('guests')} maxLength={LIMITS.guests} inputMode="numeric" placeholder="примерно" autoComplete="off" />
            </label>
          </div>
          <label>
            Город и площадка
            <input value={f.place} onChange={set('place')} maxLength={LIMITS.place} placeholder="город, ресторан (если известно)" autoComplete="off" />
          </label>
          <label>
            Ваше имя
            <input value={f.name} onChange={set('name')} maxLength={LIMITS.name} placeholder="как к вам обращаться" autoComplete="given-name" />
          </label>
          <button className="btn btn--dark btn--block" type="submit">Собрать сообщение</button>

          {message ? (
            <div className="form__result" role="status">
              <textarea ref={area} readOnly value={message} rows={6} aria-label="Готовое сообщение" />
              <p className={copied ? 'ok' : ''}>
                {copied ? 'Скопировано. Вставьте в чат и отправьте.' : 'Скопируйте текст выше и отправьте в чат.'}
              </p>
              <div className="form__send">
                {SITE.vk && (
                  <a className="btn btn--silver btn--sm" href={SITE.vk} target="_blank" rel="noopener noreferrer" onClick={() => track('click_vk', { place: 'form' })}>
                    Открыть VK
                  </a>
                )}
                {SITE.telegram && (
                  <a className="btn btn--ghost btn--sm" href={tgHref} target="_blank" rel="noopener noreferrer" onClick={() => track('click_telegram', { place: 'form' })}>
                    Открыть Telegram
                  </a>
                )}
              </div>
            </div>
          ) : (
            <p className="form__hint">Данные не отправляются и не хранятся: сообщение остаётся только на вашем устройстве.</p>
          )}
        </form>
      </div>
    </section>
  );
}
