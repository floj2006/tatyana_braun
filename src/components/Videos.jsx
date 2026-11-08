import { useState } from 'react';
import { safeUrl } from '../content/site.js';

const VIDEO_HOSTS = ['vk.ru', 'vk.com', 'vkvideo.ru'];

// Своё видео грузится только после нажатия: до этого на странице лишь постер.
function Clip({ video }) {
  const [playing, setPlaying] = useState(false);
  const { poster } = video;
  if (playing) {
    return (
      <video className="clip__media" src={video.src} poster={poster?.src} width={poster?.width} height={poster?.height} controls autoPlay playsInline />
    );
  }
  return (
    <button type="button" className="clip__poster" onClick={() => setPlaying(true)}>
      {poster && <img src={poster.src} width={poster.width} height={poster.height} alt="" loading="lazy" decoding="async" />}
      <span className="clip__play" aria-hidden="true" />
      <span className="sr-only">Смотреть видео: {video.title}</span>
    </button>
  );
}

export default function Videos({ items }) {
  if (!items?.length) return null;
  return (
    <section className="section videos reveal" id="video" aria-labelledby="video-title">
      <div className="wrap">
        <h2 id="video-title">Видео с праздников</h2>
        <div className="videos__list">
          {items.map((v) => {
            const url = v.url ? safeUrl(v.url, VIDEO_HOSTS) : '';
            return (
              <figure className="clip" key={v.id}>
                {url ? (
                  <a className="clip__poster" href={url} target="_blank" rel="noopener noreferrer">
                    {v.poster && <img src={v.poster.src} width={v.poster.width} height={v.poster.height} alt="" loading="lazy" decoding="async" />}
                    <span className="clip__play" aria-hidden="true" />
                    <span className="sr-only">Смотреть во VK: {v.title} (откроется в новой вкладке)</span>
                  </a>
                ) : (
                  <Clip video={v} />
                )}
                <figcaption>{v.title}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
