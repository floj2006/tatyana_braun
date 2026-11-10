import Title from './Title.jsx';
import { SITE } from '../content/site.js';

const PHOTO_SIZES = '(min-width: 900px) 40vw, 100vw';

function FactLink({ f }) {
  if (f.link === 'vk' && SITE.vk) {
    return (
      <a href={SITE.vk} target="_blank" rel="noopener noreferrer">
        {f.text}
        <span className="sr-only"> (откроется в новой вкладке)</span>
      </a>
    );
  }
  if (f.link === 'phone' && SITE.phoneHref) return <a href={SITE.phoneHref}>{f.text}</a>;
  return f.text;
}

// «Обо мне»: портрет и справка из подтверждённого. Абзацы story появятся, когда будут слова самой Татьяны.
export default function About({ data }) {
  if (!data?.facts?.length && !data?.story?.length) return null;
  const p = data.photo;
  const set = (ext) => p.widths.map((w) => `${p.base}-${w}.${ext} ${w}w`).join(', ');
  return (
    <section className="section about reveal" id="about" aria-labelledby="about-title">
      <div className={`wrap about__in${p ? ' about__in--photo' : ''}`}>
        {p && (
          <figure className="about__photo">
            <picture>
              <source type="image/avif" srcSet={set('avif')} sizes={PHOTO_SIZES} />
              <img src={`${p.base}-${p.widths[0]}.webp`} srcSet={set('webp')} sizes={PHOTO_SIZES} width={p.width} height={p.height} alt={p.alt} loading="lazy" decoding="async" />
            </picture>
          </figure>
        )}
        <div className="about__body">
          <Title id="about-title" text={data.title} />
          {data.facts?.length > 0 && (
            <dl className="about__facts stagger">
              {data.facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>
                    <FactLink f={f} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {data.story?.map((t) => (
            <p className="about__story" key={t}>
              {t}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
