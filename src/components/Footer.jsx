import { SITE } from '../config/site.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__in">
        <span>{SITE.name}, {SITE.role.toLowerCase()}</span>
        <span className="footer__links">
          {SITE.vk && <a href={SITE.vk} target="_blank" rel="noopener noreferrer">VK</a>}
          {SITE.telegram && <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>}
        </span>
      </div>
    </footer>
  );
}
