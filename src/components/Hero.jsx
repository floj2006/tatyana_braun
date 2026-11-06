import { SITE } from '../config/site.js';
import { track } from '../lib/analytics.js';
import { useImage } from '../lib/useImage.js';
import Photo from './Photo.jsx';

export default function Hero() {
  const hasPhoto = useImage('tatyana.jpg');
  return (
    <section className={`hero${hasPhoto ? ' hero--photo' : ''}`} id="top">
      <div className="container hero__in">
        <div className="hero__text">
          <p className="hero__role">{SITE.role}</p>
          <h1>{SITE.name}</h1>
          <p className="hero__line">Свадьбы, юбилеи, корпоративы, детские праздники.</p>
          <div className="hero__btns">
            {SITE.vk && (
              <a className="btn btn--dark" href={SITE.vk} target="_blank" rel="noopener noreferrer" onClick={() => track('click_vk', { place: 'hero' })}>
                Написать во VK
              </a>
            )}
            <a className="btn btn--line" href="#contact" onClick={() => track('cta_click', { place: 'hero' })}>Узнать про дату</a>
          </div>
        </div>
        <Photo file="tatyana.jpg" alt="Татьяна Браун" className="photo--hero" />
      </div>
    </section>
  );
}
