import { useId, useRef, useState, useSyncExternalStore } from 'react';
import { FORMATS, SITE } from '../content/site.js';
import { buildMessage, LIMITS } from '../lib/message.js';
import { todayIso, validate } from '../lib/validate.js';
import { copySync, copyText } from '../lib/clipboard.js';

const EMPTY = { date: '', noDate: false, city: '', guests: '', comment: '' };
const ORDER = ['format', 'date', 'city', 'guests', 'comment'];
const FORMAT_IDS = FORMATS.map((f) => f.id);
const noop = () => () => {};

// Прямой контакт без сервера: по одному нажатию текст копируется и открывается VK.
// Сайт ничего не отправляет и не хранит; предзаполнение сообщения в VK не используется.
export default function Contact({ format, onFormat, titleRef }) {
  const uid = useId();
  const [v, setV] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  // результат последнего нажатия: для какого текста и чем закончилось
  const [outcome, setOutcome] = useState({ text: '', state: 'idle' });
  const fields = useRef({});
  const panel = useRef(null);
  const manualArea = useRef(null);

  // Минимальная дата считается в браузере: при пререндере «сегодня» неизвестно.
  const today = useSyncExternalStore(noop, todayIso, () => '');

  const current = FORMATS.find((f) => f.id === format);
  // Формат меняется и вне формы (первый экран, список форматов): ошибка снимается сама.
  const formatError = format ? '' : errors.format;
  const values = { ...v, format };
  const isValid = Object.keys(validate(values, { formats: FORMAT_IDS, today: today || todayIso() })).length === 0;
  const message = isValid && current ? buildMessage({ ...v, on: current.on }) : '';
  // Панель результата относится только к тексту, который сейчас в форме.
  const result = outcome.text && outcome.text === message ? outcome.state : 'idle';

  const id = (name) => `${uid}-${name}`;
  const err = (name) => (errors[name] ? { 'aria-invalid': true, 'aria-describedby': id(`${name}-err`) } : {});

  function update(name, value) {
    setV((s) => ({ ...s, [name]: value }));
    // флажок «даты пока нет» снимает ошибку поля даты
    const key = name === 'noDate' ? 'date' : name;
    if (errors[key]) setErrors(({ [key]: _removed, ...rest }) => rest);
  }

  function onSubmit(e) {
    e.preventDefault();
    const found = validate(values, { formats: FORMAT_IDS, today: todayIso() });
    setErrors(found);
    const first = ORDER.find((k) => found[k]);
    if (first) {
      fields.current[first]?.focus();
      return;
    }
    // Копируем синхронно, пока страница в фокусе, и только потом открываем VK.
    if (copySync(message)) {
      window.open(SITE.vk, '_blank', 'noopener,noreferrer');
      setOutcome({ text: message, state: 'opened' });
      requestAnimationFrame(() => panel.current?.focus());
    } else {
      setOutcome({ text: message, state: 'manual' });
      requestAnimationFrame(() => {
        manualArea.current?.focus();
        manualArea.current?.select();
      });
    }
  }

  async function copyAgain() {
    const ok = await copyText(message);
    setOutcome({ text: message, state: ok ? 'copied-again' : 'manual' });
    if (!ok) {
      manualArea.current?.focus();
      manualArea.current?.select();
    }
  }

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact__in">
        <div className="contact__intro">
          <h2 id="contact-title" tabIndex={-1} ref={titleRef}>
            Узнать, свободна ли дата
          </h2>
          <p>
            Я отвечаю в личных сообщениях VK. Отметьте повод, дату и город: текст соберётся сам и скопируется, а моя
            страница во VK откроется в новой вкладке. Останется написать мне и вставить текст.
          </p>
          {SITE.vk && (
            <p className="contact__direct">
              Удобнее своими словами?{' '}
              <a href={SITE.vk} target="_blank" rel="noopener noreferrer">
                Написать мне во VK<span className="sr-only"> (откроется в новой вкладке)</span>
              </a>
            </p>
          )}
        </div>

        <div className="contact__panel">
          <form className="form" onSubmit={onSubmit} noValidate aria-label="Сообщение Татьяне Браун">
            <fieldset className="form__formats" {...(formatError ? { 'aria-describedby': id('format-err') } : {})}>
              <legend>Что празднуете</legend>
              <div className="chips">
                {FORMATS.map((f, i) => (
                  <label key={f.id} className="chip">
                    <input
                      type="radio"
                      name={id('format')}
                      value={f.id}
                      checked={format === f.id}
                      onChange={() => onFormat(f.id)}
                      ref={i === 0 ? (el) => (fields.current.format = el) : undefined}
                      {...(formatError ? { 'aria-invalid': true } : {})}
                    />
                    <span>{f.title}</span>
                  </label>
                ))}
              </div>
              {formatError && (
                <p className="form__error" id={id('format-err')}>
                  {formatError}
                </p>
              )}
            </fieldset>

            <div className="form__row">
              <div className="field">
                <label htmlFor={id('date')}>Дата</label>
                <input
                  id={id('date')}
                  type="date"
                  min={today || undefined}
                  value={v.date}
                  disabled={v.noDate}
                  onChange={(e) => update('date', e.target.value)}
                  ref={(el) => (fields.current.date = el)}
                  {...err('date')}
                />
                <label className="check">
                  <input type="checkbox" checked={v.noDate} onChange={(e) => update('noDate', e.target.checked)} />
                  <span>Даты пока нет</span>
                </label>
                {errors.date && (
                  <p className="form__error" id={id('date-err')}>
                    {errors.date}
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor={id('city')}>Город</label>
                <input
                  id={id('city')}
                  type="text"
                  autoComplete="address-level2"
                  maxLength={LIMITS.city}
                  value={v.city}
                  onChange={(e) => update('city', e.target.value)}
                  ref={(el) => (fields.current.city = el)}
                  {...err('city')}
                />
                {errors.city && (
                  <p className="form__error" id={id('city-err')}>
                    {errors.city}
                  </p>
                )}
              </div>
            </div>

            <div className="form__row form__row--extra">
              <div className="field">
                <label htmlFor={id('guests')}>
                  Гостей <span className="field__opt">по желанию</span>
                </label>
                <input
                  id={id('guests')}
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={LIMITS.guests}
                  value={v.guests}
                  onChange={(e) => update('guests', e.target.value)}
                  ref={(el) => (fields.current.guests = el)}
                  {...err('guests')}
                />
                {errors.guests && (
                  <p className="form__error" id={id('guests-err')}>
                    {errors.guests}
                  </p>
                )}
              </div>
              <div className="field">
                <label htmlFor={id('comment')}>
                  Что ещё важно <span className="field__opt">по желанию</span>
                </label>
                <textarea
                  id={id('comment')}
                  rows={2}
                  maxLength={LIMITS.comment}
                  value={v.comment}
                  onChange={(e) => update('comment', e.target.value)}
                  ref={(el) => (fields.current.comment = el)}
                  aria-describedby={[current && id('comment-hint'), errors.comment && id('comment-err')].filter(Boolean).join(' ') || undefined}
                  {...(errors.comment ? { 'aria-invalid': true } : {})}
                />
                {current && (
                  <p className="field__hint" id={id('comment-hint')}>
                    {current.hint}
                  </p>
                )}
                {errors.comment && (
                  <p className="form__error" id={id('comment-err')}>
                    {errors.comment}
                  </p>
                )}
              </div>
            </div>

            {message && (
              <details className="preview">
                <summary>Посмотреть текст сообщения</summary>
                <pre>{message}</pre>
              </details>
            )}

            <div className="form__submit">
              <button className="btn btn--primary btn--block" type="submit">
                Скопировать текст и открыть VK
              </button>
              <p className="form__note">Сайт ничего не отправляет и не сохраняет: текст остаётся у вас.</p>
            </div>
          </form>

          {result !== 'idle' && (
            <div className="result" tabIndex={-1} ref={panel} role="status">
              {result === 'manual' ? (
                <>
                  <p className="result__title">Скопировать автоматически не получилось</p>
                  <p>
                    Текст ниже уже выделен: нажмите Ctrl+C или ⌘+C, на телефоне — долгое нажатие и «Скопировать». Затем
                    откройте VK и вставьте его в сообщение мне.
                  </p>
                  <label className="sr-only" htmlFor={id('manual')}>
                    Текст сообщения
                  </label>
                  <textarea id={id('manual')} ref={manualArea} className="result__text" readOnly value={message} rows={7} />
                  <div className="result__actions">
                    <button type="button" className="btn btn--line btn--sm" onClick={copyAgain}>
                      Попробовать скопировать ещё раз
                    </button>
                    <a className="btn btn--primary btn--sm" href={SITE.vk} target="_blank" rel="noopener noreferrer">
                      Открыть VK<span className="sr-only"> (откроется в новой вкладке)</span>
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <p className="result__title">Текст скопирован</p>
                  <p>
                    Во VK откройте диалог со мной и вставьте текст: Ctrl+V или ⌘+V, на телефоне — долгое нажатие и
                    «Вставить».
                  </p>
                  <div className="result__actions">
                    <a className="btn btn--primary btn--sm" href={SITE.vk} target="_blank" rel="noopener noreferrer">
                      Открыть VK<span className="sr-only"> (в новой вкладке)</span>
                    </a>
                    <button type="button" className="btn btn--line btn--sm" onClick={copyAgain}>
                      {result === 'copied-again' ? 'Скопировано ещё раз' : 'Скопировать ещё раз'}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
