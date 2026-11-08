import { SITE } from '../content/site.js';

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
        <ul className="footer__links">
          {SITE.vk && (
            <li>
              <a href={SITE.vk} target="_blank" rel="noopener noreferrer">
                VK<span className="sr-only"> (откроется в новой вкладке)</span>
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
    </footer>
  );
}
