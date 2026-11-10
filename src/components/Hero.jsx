import { HERO, SITE } from '../content/site.js';
import { priceLabel } from '../lib/contact.js';
import { onQuickClick } from '../lib/quickContact.js';

// Должно совпадать с imagesizes у preload в index.html.
const SIZES = '(min-width: 900px) 50vw, 100vw';

// Первый экран: имя тонким капслоком, под ним рукописная подпись отдельной строкой (без наложений).
// На телефоне фото сверху, текст под ним на светлом фоне.
// page — страница формата: свой H1, имя становится подписью.
export default function Hero({ media, page, price }) {
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
                {page.h1}
              </h1>
            </>
          ) : (
            <h1 id="hero-title" className="hero__title">
              {words.map((w, i) => (
                <span className={`hero__line hero__line--${i + 1}`} key={w}>
                  {w}{' '}
                </span>
              ))}
              <span className="hero__role">
                <span className="hero__script">{SITE.role}</span>
              </span>
            </h1>
          )}
          <p className="hero__lead">{page ? page.lead : HERO.lead}</p>
          {page && priceLabel(price) && <p className="hero__price">{priceLabel(price)}</p>}
          <div className="hero__actions">
            <a className="btn btn--primary" href="#contact" aria-haspopup="dialog" onClick={onQuickClick}>
              Узнать, свободна ли дата
            </a>
            {media ? (
              <a className="link" href={page ? '/#media' : '#media'}>
                {media}
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
