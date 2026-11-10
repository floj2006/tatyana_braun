import { FORMATS, SITE } from '../content/site.js';
import { formatPath } from '../routes.js';
import { whatsappUrl } from '../lib/contact.js';

// Год сборки: страница пререндерится, поэтому год фиксируется при выкладке.
const YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__in">
        <div>
          <p className="footer__name">{SITE.name}</p>
          <p>
            {SITE.role} {SITE.areaIn}
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
          {SITE.community && (
            <li>
              <a href={SITE.community} target="_blank" rel="noopener noreferrer">
                Сообщество VK<span className="sr-only"> (откроется в новой вкладке)</span>
              </a>
            </li>
          )}
          {SITE.phoneHref && (
            <li>
              <a href={SITE.phoneHref}>{SITE.phone}</a>
            </li>
          )}
          {SITE.personal && (
            <li>
              <a href={SITE.personal} target="_blank" rel="noopener noreferrer">
                Личная страница VK<span className="sr-only"> (откроется в новой вкладке)</span>
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
          {SITE.telegram && (
            <li>
              <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">
                Telegram<span className="sr-only"> (откроется в новой вкладке)</span>
              </a>
            </li>
          )}
        </ul>
      </div>
      {/* Юридическая строка: реквизиты появляются, когда заполнен SITE.legal; политика есть всегда. */}
      <div className="wrap footer__legal">
        <p>
          © {YEAR} {SITE.legal.fullName || SITE.name}
          {SITE.legal.status && `, ${SITE.legal.status}`}
          {SITE.legal.inn && `, ИНН ${SITE.legal.inn}`}
          {SITE.legal.ogrnip && `, ОГРНИП ${SITE.legal.ogrnip}`}
        </p>
        <a href="/privacy/">Политика конфиденциальности</a>
      </div>
    </footer>
  );
}
