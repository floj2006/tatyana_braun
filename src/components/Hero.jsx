import { HERO, SITE } from '../content/site.js';
import { priceLabel } from '../lib/contact.js';

// Должно совпадать с imagesizes у preload в index.html.
const SIZES = '(min-width: 900px) 50vw, 100vw';

// Слово с рукописной первой буквой.
function Lettered({ word }) {
  return (
    <>
      <span className="initial">{word.slice(0, 1)}</span>
      {word.slice(1)}
    </>
  );
}

// Первый экран: фото на всю высоту, поверх — имя тонким капслоком с рукописными инициалами.
// page — страница формата: свой H1, имя становится подписью.
export default function Hero({ hasVideo, page, price }) {
  const { photo } = HERO;
  const srcSet = (ext) => photo.widths.map((w) => `${photo.base}-${w}.${ext} ${w}w`).join(', ');
  const words = SITE.name.split(' ');
  return (
    <section className={`hero${page ? ' hero--page' : ''}`} id="top" aria-labelledby="hero-title">
      <figure className="hero__photo">
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
      <div className="wrap hero__in">
        <div className="hero__text">
          {page ? (
            <>
              <p className="hero__eyebrow">{SITE.name}</p>
              <h1 id="hero-title" className="hero__heading">
                <Lettered word={page.h1} />
              </h1>
            </>
          ) : (
            <h1 id="hero-title" className="hero__title">
              {words.map((w, i) => (
                <span className={`hero__line hero__line--${i + 1}`} key={w}>
                  <Lettered word={w} />{' '}
                </span>
              ))}
              <span className="hero__role">
                {SITE.role} {SITE.cityIn}
              </span>
            </h1>
          )}
          <p className="hero__lead">{page ? page.lead : HERO.lead}</p>
          {page && priceLabel(price) && <p className="hero__price">{priceLabel(price)}</p>}
          <div className="hero__actions">
            <a className="btn btn--primary" href="#contact">
              Узнать, свободна ли дата
            </a>
            {hasVideo ? (
              <a className="link" href={page ? '/#media' : '#media'}>
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
        </div>
      </div>
      <span className="hero__scroll" aria-hidden="true">
        Листайте
      </span>
    </section>
  );
}
