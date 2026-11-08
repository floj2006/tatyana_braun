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

// Реальные фото и видео с праздников. Без материалов раздел не рендерится.
export default function Media({ photos = [], videos = [] }) {
  if (!photos.length && !videos.length) return null;
  return (
    <section className="section media reveal" id="media" aria-labelledby="media-title">
      <div className="wrap">
        <h2 id="media-title">{videos.length && photos.length ? 'Фото и видео' : videos.length ? 'Видео' : 'Фото'} с праздников</h2>
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
                  <img src={p.src} width={p.width} height={p.height} alt={p.alt} loading="lazy" decoding="async" />
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
