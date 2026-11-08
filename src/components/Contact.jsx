import { useId, useRef, useState, useSyncExternalStore } from 'react';
import { FORMATS, SITE } from '../content/site.js';
import { buildMessage, LIMITS } from '../lib/message.js';
import { todayIso, validate } from '../lib/validate.js';
import { copyText } from '../lib/clipboard.js';

const EMPTY = { date: '', noDate: false, city: '', guests: '', comment: '' };
const ORDER = ['format', 'date', 'city', 'guests', 'comment'];
const FORMAT_IDS = FORMATS.map((f) => f.id);
const noop = () => () => {};

const COPY_TEXT = {
  copied: 'Текст скопирован. Откройте VK и вставьте его в сообщение Татьяне.',
  failed:
    'Скопировать автоматически не получилось. Текст выше выделен: нажмите Ctrl+C или ⌘+C, на телефоне — долгое нажатие и «Скопировать».',
};

// Прямой контакт: форма только собирает текст сообщения. Она ничего не отправляет
// и не сохраняет; сообщение посетитель сам отправляет во VK.
export default function Contact({ format, onFormat, titleRef }) {
  const uid = useId();
  const [v, setV] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  // готовое сообщение хранится вместе с форматом, для которого оно собрано
  const [prepared, setPrepared] = useState({ text: '', format: '' });
  const [copy, setCopy] = useState('idle');
  const fields = useRef({});
  const resultTitle = useRef(null);
  const textArea = useRef(null);

  // Минимальная дата считается в браузере: при пререндере «сегодня» неизвестно.
  const today = useSyncExternalStore(noop, todayIso, () => '');

  const current = FORMATS.find((f) => f.id === format);
  // Формат меняется и из списка форматов вне формы: устаревшие ошибка и сообщение не показываются.
  const formatError = format ? '' : errors.format;
  const message = prepared.format === format ? prepared.text : '';
  const id = (name) => `${uid}-${name}`;
  const err = (name) => (errors[name] ? { 'aria-invalid': true, 'aria-describedby': id(`${name}-err`) } : {});

  function reset(name) {
    setPrepared({ text: '', format: '' });
    setCopy('idle');
    if (errors[name]) {
      setErrors(({ [name]: _removed, ...rest }) => rest);
    }
  }

  function update(name, value) {
    setV((s) => ({ ...s, [name]: value }));
    // флажок «даты пока нет» снимает ошибку поля даты
    reset(name === 'noDate' ? 'date' : name);
  }

  function chooseFormat(value) {
    onFormat(value);
    reset('format');
  }

  function onSubmit(e) {
    e.preventDefault();
    const found = validate({ ...v, format }, { formats: FORMAT_IDS, today: todayIso() });
    setErrors(found);
    const first = ORDER.find((k) => found[k]);
    if (first) {
      fields.current[first]?.focus();
      return;
    }
    setPrepared({ text: buildMessage({ ...v, on: current.on }), format });
    setCopy('idle');
    requestAnimationFrame(() => resultTitle.current?.focus());
  }

  async function onCopy() {
    const ok = await copyText(message, textArea.current);
    setCopy(ok ? 'copied' : 'failed');
    if (!ok) {
      textArea.current?.focus();
      textArea.current?.select();
    }
  }

  return (
    <section className="contact" id="contact" aria-labelledby="contact-title">
      <div className="wrap contact__in">
        <div className="contact__intro">
          <h2 id="contact-title" tabIndex={-1} ref={titleRef}>
            Узнать, свободна ли дата
          </h2>
          <p>Татьяна на связи в личных сообщениях VK. Напишите ей напрямую или соберите сообщение здесь.</p>
          <ol className="contact__steps">
            <li>Отметьте формат, дату и город.</li>
            <li>Нажмите «Подготовить сообщение» и скопируйте текст.</li>
            <li>Откройте VK и отправьте его Татьяне. Ответ придёт туда же.</li>
          </ol>
          {SITE.vk && (
            <a className="btn btn--accent contact__vk" href={SITE.vk} target="_blank" rel="noopener noreferrer">
              Написать во VK<span className="sr-only"> (откроется в новой вкладке)</span>
            </a>
          )}
          <p className="contact__note">Форма ничего не отправляет и не сохраняет: текст собирается прямо на этой странице.</p>
        </div>

        <div className="contact__panel">
          <form className="form" onSubmit={onSubmit} noValidate aria-label="Подготовить сообщение Татьяне">
            <fieldset className="form__formats" {...(formatError ? { 'aria-describedby': id('format-err') } : {})}>
              <legend>Формат праздника</legend>
              <div className="chips">
                {FORMATS.map((f, i) => (
                  <label key={f.id} className="chip">
                    <input
                      type="radio"
                      name={id('format')}
                      value={f.id}
                      checked={format === f.id}
                      onChange={() => chooseFormat(f.id)}
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

            <div className="field field--short">
              <label htmlFor={id('guests')}>
                Гостей <span className="field__opt">необязательно</span>
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
                Что ещё важно <span className="field__opt">необязательно</span>
              </label>
              {current && (
                <p className="field__hint" id={id('comment-hint')}>
                  {current.hint}
                </p>
              )}
              <textarea
                id={id('comment')}
                rows={3}
                maxLength={LIMITS.comment}
                value={v.comment}
                onChange={(e) => update('comment', e.target.value)}
                ref={(el) => (fields.current.comment = el)}
                aria-describedby={[current && id('comment-hint'), errors.comment && id('comment-err')].filter(Boolean).join(' ') || undefined}
                {...(errors.comment ? { 'aria-invalid': true } : {})}
              />
              {errors.comment && (
                <p className="form__error" id={id('comment-err')}>
                  {errors.comment}
                </p>
              )}
            </div>

            <button className="btn btn--dark btn--block" type="submit">
              Подготовить сообщение
            </button>
          </form>

          {message && (
            <div className="result">
              <h3 tabIndex={-1} ref={resultTitle}>
                Сообщение готово
              </h3>
              <p>Скопируйте текст и отправьте его Татьяне во VK. Если что-то изменится, поправьте поля выше.</p>
              <label className="sr-only" htmlFor={id('message')}>
                Текст сообщения
              </label>
              <textarea id={id('message')} ref={textArea} className="result__text" readOnly value={message} rows={8} />
              <div className="result__actions">
                <button type="button" className="btn btn--dark" onClick={onCopy}>
                  Скопировать текст
                </button>
                {SITE.vk && (
                  <a className="btn btn--accent" href={SITE.vk} target="_blank" rel="noopener noreferrer">
                    Открыть VK<span className="sr-only"> (откроется в новой вкладке)</span>
                  </a>
                )}
              </div>
              <p className={`result__status${copy === 'copied' ? ' is-ok' : ''}`} role="status">
                {COPY_TEXT[copy] ?? ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
