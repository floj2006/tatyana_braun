import { useState, useSyncExternalStore } from 'react';
import { analyticsEnabled, getConsent, noticeSeen, policyUrl, setConsent, setNoticeSeen } from '../lib/analytics.js';

const noop = () => () => {};

// Плашка внизу страницы. С Метрикой — согласие на аналитику (152-ФЗ): счётчик грузится только после «Согласен».
// Без Метрики — короткое уведомление, что cookie не используются, с кнопкой «Понятно».
// При пререндере не выводится (снимок сервера — false), появляется после загрузки и не сдвигает вёрстку.
export default function ConsentBanner() {
  const mode = useSyncExternalStore(
    noop,
    () => (analyticsEnabled() ? (getConsent() === null ? 'consent' : '') : noticeSeen() ? '' : 'notice'),
    () => '',
  );
  const [hidden, setHidden] = useState(false);
  if (!mode || hidden) return null;
  const policy = <a href={policyUrl() || '/privacy/'}>политике конфиденциальности</a>;

  if (mode === 'notice') {
    return (
      <div className="consent" role="region" aria-label="Уведомление о cookie">
        <p>Сайт не использует cookie и ничего о вас не собирает. Подробнее в {policy}.</p>
        <div className="consent__actions">
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => {
              setNoticeSeen();
              setHidden(true);
            }}
          >
            Понятно
          </button>
        </div>
      </div>
    );
  }

  const decide = (value) => {
    setConsent(value);
    setHidden(true);
  };
  return (
    <div className="consent" role="region" aria-label="Согласие на cookie и аналитику">
      <p>
        Сайт может использовать Яндекс.Метрику и её cookie, чтобы понять, какие разделы полезны. Счётчик включится,
        только если вы согласитесь. Подробнее в {policy}.
      </p>
      <div className="consent__actions">
        <button type="button" className="btn btn--primary btn--sm" onClick={() => decide('yes')}>
          Согласен
        </button>
        <button type="button" className="btn btn--line btn--sm" onClick={() => decide('no')}>
          Отказаться
        </button>
      </div>
    </div>
  );
}
