import { SITE } from '../config/site.js';
import { track } from '../lib/analytics.js';
import Photo from './Photo.jsx';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__in">
        <div className="hero__text">
          <p className="eyebrow">{SITE.role}</p>
          <h1>
            Праздник, который <em>гости будут вспоминать</em> с улыбкой
          </h1>
          <p className="lead">
            Свадьбы, юбилеи, корпоративы и детские праздники. Придумываю сценарий под вас, держу ритм вечера и беру
            на себя всё, чтобы вы просто праздновали.
          </p>
          <div className="hero__btns">
            <a className="btn btn--dark btn--shine" href="#contact" onClick={() => track('cta_click', { place: 'hero' })}>
              Проверить свою дату
            </a>
            {SITE.vk && (
              <a className="btn btn--ghost" href={SITE.vk} target="_blank" rel="noopener noreferrer" onClick={() => track('click_vk', { place: 'hero' })}>
                Написать во VK
              </a>
            )}
          </div>
          <ul className="hero__facts">
            <li>Сценарий под ваш повод</li>
            <li>Отвечаю лично</li>
            <li>Дата закрепляется договором</li>
          </ul>
        </div>
        <div className="hero__photo">
          <Photo file="tatyana.jpg" alt="Татьяна Браун, ведущая праздников" hint="Портрет Татьяны" className="photo--arch" />
          <div className="hero__badge">
            <b>Ведущая</b>
            <span>вашего праздника</span>
          </div>
        </div>
      </div>
    </section>
  );
}
