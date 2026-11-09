import Title from './Title.jsx';
import { useState } from 'react';
import { safeUrl } from '../content/site.js';

const VIDEO_HOSTS = ['vk.ru', 'vk.com', 'vkvideo.ru'];

function Poster({ poster }) {
  return poster ? <img src={poster.src} width={poster.width} height={poster.height} alt="" loading="lazy" decoding="async" /> : null;
}

// Своё видео грузится только после нажатия: до этого на странице лишь постер, без автозапуска.
function OwnClip({ video }) {
  const [playing, setPlaying] = useState(false);
  const { poster } = video;
  if (playing) {
    return <video className="clip__media" src={video.src} poster={poster?.src} width={poster?.width} height={poster?.height} controls autoPlay playsInline />;
  }
  return (
    <button type="button" className="clip__poster" onClick={() => setPlaying(true)}>
      <Poster poster={poster} />
      <span className="clip__play" aria-hidden="true" />
      <span className="sr-only">Смотреть видео: {video.title}</span>
    </button>
  );
}

function Clip({ video }) {
  const url = video.url ? safeUrl(video.url, VIDEO_HOSTS) : '';
  return (
    <figure className="clip">
      {url ? (
        <a className="clip__poster" href={url} target="_blank" rel="noopener noreferrer">
          <Poster poster={video.poster} />
          <span className="clip__play" aria-hidden="true" />
          <span className="sr-only">Смотреть во VK: {video.title} (откроется в новой вкладке)</span>
        </a>
      ) : (
        <OwnClip video={video} />
      )}
      <figcaption>{video.title}</figcaption>
    </figure>
  );
}

// Фото из scripts/import-photos.py: base + widths дают AVIF/WebP разных размеров; src — одиночный файл.
const PHOTO_SIZES = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw';
function PhotoImg({ photo: p }) {
  if (!p.base) return <img src={p.src} width={p.width} height={p.height} alt={p.alt} loading="lazy" decoding="async" />;
  const set = (ext) => p.widths.map((w) => `${p.base}-${w}.${ext} ${w}w`).join(', ');
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={PHOTO_SIZES} />
      <img src={`${p.base}-${p.widths[0]}.webp`} srcSet={set('webp')} sizes={PHOTO_SIZES} width={p.width} height={p.height} alt={p.alt} loading="lazy" decoding="async" />
    </picture>
  )
}

// Реальные фото и видео с праздников. Без материалов раздел не рендерится.
export default function Media({ photos = [], videos = [] }) {
  if (!photos.length && !videos.length) return null;
  return (
    <section className="section media reveal" id="media" aria-labelledby="media-title">
      <div className="wrap">
        <Title id="media-title" text={videos.length && photos.length ? 'Фото и видео' : videos.length ? 'Видео' : 'Фотографии'} />
        {videos.length > 0 && (
          <div className="media__videos">
            {videos.map((v) => (
              <Clip key={v.id} video={v} />
            ))}
          </div>
        )}
        {photos.length > 0 && (
          <ul className="media__photos">
            {photos.map((p) => (
              <li key={p.id}>
                <figure>
                  <PhotoImg photo={p} />
                  {p.caption && <figcaption>{p.caption}</figcaption>}
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
