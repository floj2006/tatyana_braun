import { SITE } from '../config/site.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__in">
        <div>
          <div className="logo logo--light">Татьяна <em>Браун</em></div>
          <p>{SITE.role}</p>
        </div>
        <div className="footer__links">
          {SITE.vk && <a href={SITE.vk} target="_blank" rel="noopener noreferrer">VK</a>}
          {SITE.telegram && <a href={SITE.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>}
        </div>
        <p className="footer__copy">© {new Date().getFullYear()} {SITE.name}</p>
      </div>
    </footer>
  );
}
