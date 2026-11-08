import { SITE } from '../content/site.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__in">
        <p>
          {SITE.name}, {SITE.role.toLowerCase()}
        </p>
        <ul className="footer__links">
          {SITE.vk && (
            <li>
              <a href={SITE.vk} target="_blank" rel="noopener noreferrer">VK</a>
            </li>
          )}
          {SITE.telegram && (
            <li>
              <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>
            </li>
          )}
        </ul>
      </div>
    </footer>
  );
}
