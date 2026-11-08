import { FORMATS, HERO, SITE } from '../content/site.js';

// Должно совпадать с imagesizes у preload в index.html.
const SIZES = '(min-width: 900px) 40vw, calc(100vw - 32px)';

export default function Hero({ onChoose, hasVideo }) {
  const { photo } = HERO;
  const srcSet = (ext) => photo.widths.map((w) => `${photo.base}-${w}.${ext} ${w}w`).join(', ');
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className="wrap hero__in">
        <div className="hero__text">
          <h1 id="hero-title">
            <span className="hero__name">{SITE.name}</span>
            <span className="hero__role">
              {SITE.role} {SITE.cityIn}
            </span>
          </h1>
          <p className="hero__lead">{HERO.lead}</p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="#contact">
              Узнать, свободна ли дата
            </a>
            {hasVideo ? (
              <a className="link" href="#media">
                Смотреть видео
              </a>
            ) : (
              SITE.vk && (
                <a className="link" href={SITE.vk} target="_blank" rel="noopener noreferrer">
                  Написать во VK<span className="sr-only"> (откроется в новой вкладке)</span>
                </a>
              )
            )}
          </div>
          <div className="hero__pick">
            <p className="hero__pick-label" id="hero-pick">
              Или сразу выберите повод
            </p>
            <ul className="hero__chips" aria-labelledby="hero-pick">
              {FORMATS.map((f) => (
                <li key={f.id}>
                  <button type="button" className="tag" onClick={() => onChoose(f.id)}>
                    {f.short}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <figure className="hero__photo">
          <span className="hero__frame" aria-hidden="true" />
          <picture>
            <source type="image/avif" srcSet={srcSet('avif')} sizes={SIZES} />
            <img
              src={`${photo.base}-800.webp`}
              srcSet={srcSet('webp')}
              sizes={SIZES}
              width={photo.width}
              height={photo.height}
              alt={photo.alt}
              fetchPriority="high"
              decoding="async"
            />
          </picture>
        </figure>
      </div>
    </section>
  );
}
