import { FORMATS, SITE } from '../content/site.js';
import { formatPath } from '../routes.js';
import { analyticsEnabled, policyUrl } from '../lib/analytics.js';
import { whatsappUrl } from '../lib/contact.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__in">
        <div>
          <p className="footer__name">{SITE.name}</p>
          <p>
            {SITE.role} {SITE.cityIn}
          </p>
        </div>
        <ul className="footer__formats" aria-label="Форматы">
          {FORMATS.filter(formatPath).map((f) => (
            <li key={f.id}>
              <a href={formatPath(f)}>{f.title}</a>
            </li>
          ))}
        </ul>
        <ul className="footer__links">
          {SITE.vk && (
            <li>
              <a href={SITE.vk} target="_blank" rel="noopener noreferrer">
                VK<span className="sr-only"> (откроется в новой вкладке)</span>
              </a>
            </li>
          )}
          {whatsappUrl(SITE.whatsapp) && (
            <li>
              <a href={whatsappUrl(SITE.whatsapp)} target="_blank" rel="noopener noreferrer">
                WhatsApp<span className="sr-only"> (откроется в новой вкладке)</span>
              </a>
            </li>
          )}
          {analyticsEnabled() && (
            <li>
              <a href={policyUrl()}>Политика конфиденциальности</a>
            </li>
          )}
                    {SITE.telegram && (
            <li>
              <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">
                Telegram<span className="sr-only"> (откроется в новой вкладке)</span>
              </a>
            </li>
          )}
        </ul>
      </div>
    </footer>
  );
}
