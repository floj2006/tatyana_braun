import { SITE } from '../config/site.js';
import { track } from '../lib/analytics.js';
import Photo from './Photo.jsx';

// Блок есть, только когда указана ссылка на видео (SITE.showreelUrl).
export default function Showreel() {
  if (!SITE.showreelUrl) return null;
  return (
    <section className="reel-wrap" aria-label="Видео с праздников">
      <div className="container">
        <a className="reel" href={SITE.showreelUrl} target="_blank" rel="noopener noreferrer" onClick={() => track('click_showreel')}>
          <Photo file="showreel.jpg" alt="" className="photo--reel" />
          <span className="reel__play" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
          </span>
          <span className="reel__cap">Видео, VK</span>
        </a>
      </div>
    </section>
  );
}
