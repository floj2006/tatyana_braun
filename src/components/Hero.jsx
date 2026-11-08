import { HERO, SITE } from '../content/site.js';

export default function Hero() {
  const { photo } = HERO;
  const srcSet = photo.widths.map((w) => `${photo.base}-${w}.webp ${w}w`).join(', ');
  const geo = [SITE.city, SITE.area].filter(Boolean).join('. ');
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__in">
        <div className="hero__text">
          <p className="hero__role">{SITE.role}</p>
          <h1 id="hero-title">{SITE.name}</h1>
          {geo && <p className="hero__geo">{geo}</p>}
          <p className="hero__lead">{HERO.lead}</p>
          <div className="hero__actions">
            <a className="btn btn--accent" href="#contact">Узнать, свободна ли дата</a>
            {SITE.video ? (
              <a className="btn btn--line" href={SITE.video} target="_blank" rel="noopener noreferrer">
                Смотреть видео<span className="sr-only"> (откроется VK Видео)</span>
              </a>
            ) : (
              SITE.vk && (
                <a className="btn btn--line" href={SITE.vk} target="_blank" rel="noopener noreferrer">
                  Написать во VK<span className="sr-only"> (откроется в новой вкладке)</span>
                </a>
              )
            )}
          </div>
        </div>
        <figure className="hero__photo">
          <img
            src={`${photo.base}-800.webp`}
            srcSet={srcSet}
            sizes="(min-width: 900px) 42vw, 100vw"
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            fetchPriority="high"
            decoding="async"
          />
        </figure>
      </div>
    </section>
  );
}
