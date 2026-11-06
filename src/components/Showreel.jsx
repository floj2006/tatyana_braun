import { SITE } from '../config/site.js';
import { track } from '../lib/analytics.js';
import Photo from './Photo.jsx';

// Видео-визитка — главный инструмент продажи ведущего. Ведём на VK Видео (без iframe — строгая CSP).
export default function Showreel() {
  const href = SITE.showreelUrl || SITE.vk;
  if (!href) return null;
  return (
    <section className="section section--tight" aria-labelledby="reel-h">
      <div className="container">
        <div className="reel">
          <Photo file="showreel.jpg" alt="Кадр из видео-визитки" hint="Кадр из видео-визитки" className="photo--wide" />
          <a className="reel__play" href={href} target="_blank" rel="noopener noreferrer" onClick={() => track('click_showreel')} aria-label="Смотреть видео-визитку во VK">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
          </a>
          <div className="reel__cap">
            <h2 id="reel-h">Посмотрите, как это бывает</h2>
            <p>Короткое видео с живыми моментами праздников — во VK</p>
          </div>
        </div>
      </div>
    </section>
  );
}
