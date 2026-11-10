import { useEffect, useId, useRef } from 'react';
import { SITE } from '../content/site.js';
import { closeQuick, useQuickOpen } from '../lib/quickContact.js';
import { track } from '../lib/analytics.js';

const newTab = <span className="sr-only"> (откроется в новой вкладке)</span>;

// Прямая связь по одному нажатию: сообщения сообщества во VK, звонок, Telegram (если появится).
// Пустые значения в SITE скрывают свою кнопку.
export function ContactButtons({ where }) {
  return (
    <div className="contact-btns">
      {SITE.vk && (
        <a
          className="btn btn--primary btn--block"
          href={SITE.vk}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track('vk_open', { where })}
        >
          Написать во VK{newTab}
        </a>
      )}
      {SITE.phoneHref && (
        <a className="btn btn--line btn--block" href={SITE.phoneHref} onClick={() => track('call', { where })}>
          Позвонить <span className="contact-btns__num">{SITE.phone}</span>
        </a>
      )}
      {SITE.telegram && (
        <a className="btn btn--line btn--block" href={SITE.telegram} target="_blank" rel="noopener noreferrer">
          Написать в Telegram{newTab}
        </a>
      )}
    </div>
  );
}

// Окно «Узнать, свободна ли дата»: открывается из любой кнопки «Узнать дату» вместо прокрутки к форме.
// onForm — перейти к форме с готовым текстом (окно закрывается).
export default function QuickContact({ onForm }) {
  const open = useQuickOpen();
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      track('quick_open');
    }
    if (!open && d.open) d.close();
  }, [open]);

  function toForm() {
    ref.current.close();
    onForm();
  }

  return (
    <dialog
      ref={ref}
      className="sheet quick"
      aria-labelledby={titleId}
      onClose={closeQuick}
      onClick={(e) => e.target === ref.current && ref.current.close()}
    >
      {open && (
        <div className="sheet__card quick__card">
          <button type="button" className="sheet__close" onClick={() => ref.current.close()}>
            <span className="sr-only">Закрыть</span>
          </button>
          <h2 className="quick__title" id={titleId}>
            Узнать, свободна ли дата
          </h2>
          <p className="quick__lead">
            Напишите в сообщения моего сообщества во VK или позвоните. Укажите повод, дату и город.
          </p>
          <ContactButtons where="quick" />
          <button type="button" className="link quick__form" onClick={toForm}>
            Или заполнить короткую форму
          </button>
        </div>
      )}
    </dialog>
  );
}
