import { FORMATS } from '../content/site.js';
import { formatPath } from '../routes.js';

// Перелинковка страниц форматов: помогает и посетителю, и поиску.
export default function OtherFormats({ current }) {
  const links = FORMATS.filter((f) => f.id !== current && formatPath(f));
  if (!links.length) return null;
  return (
    <nav className="section other reveal" aria-labelledby="other-title">
      <div className="wrap">
        <h2 id="other-title" className="other__title">
          Другие форматы
        </h2>
        <ul className="other__list">
          {links.map((f) => (
            <li key={f.id}>
              <a href={formatPath(f)}>{f.title}</a>
            </li>
          ))}
          <li>
            <a href="/">Главная страница</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
