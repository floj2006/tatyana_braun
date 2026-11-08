import { useState, useSyncExternalStore } from 'react';
import { analyticsEnabled, getConsent, policyUrl, setConsent } from '../lib/analytics.js';

const noop = () => () => {};

// Баннер согласия на Метрику. Появляется, только если аналитика настроена, а решения ещё не было.
export default function ConsentBanner() {
  const pending = useSyncExternalStore(noop, () => analyticsEnabled() && getConsent() === null, () => false);
  const [hidden, setHidden] = useState(false);
  if (!pending || hidden) return null;
  const decide = (value) => {
    setConsent(value);
    setHidden(true);
  };
  return (
    <div className="consent" role="region" aria-label="Согласие на аналитику">
      <p>
        Сайт может использовать Яндекс.Метрику, чтобы понять, какие разделы полезны. Счётчик включится, только если вы
        согласитесь. <a href={policyUrl()}>Политика конфиденциальности</a>
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
