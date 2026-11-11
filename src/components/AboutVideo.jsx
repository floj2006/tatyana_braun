import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Icon from './Icon.jsx';

// Можно ли запускать самому: нет prefers-reduced-motion и режима экономии трафика.
// На сервере false: в разметке кнопка «Смотреть», после загрузки скрипта её сменяют кнопки звука и паузы.
const canAutoplay = () =>
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches && !navigator.connection?.saveData && 'IntersectionObserver' in window;
const noop = () => () => {};

// Видео-приветствие в «Обо мне» на месте портрета.
// Само начинает играть без звука, когда раздел на экране, и встаёт на паузу, когда уходит.
// «Включить звук» запускает ролик с начала со звуком. Пауза доступна всегда (WCAG 2.2.2).
// При prefers-reduced-motion и экономии трафика сам не запускается: видна кнопка «Смотреть».
// До нажатия или показа на экране файл не грузится (preload="none").
export default function AboutVideo({ video, poster }) {
  const ref = useRef(null);
  const bar = useRef(null);
  const userPaused = useRef(false);
  const auto = useSyncExternalStore(noop, canAutoplay, () => false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const v = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!userPaused.current && v.paused && !v.ended) v.play().catch(() => {});
        } else if (!v.paused) v.pause();
      },
      { threshold: 0.5 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [auto]);

  function withSound() {
    const v = ref.current;
    userPaused.current = false;
    v.muted = false;
    v.loop = false;
    v.currentTime = 0;
    v.play().catch(() => {});
  }

  function toggleSound() {
    const v = ref.current;
    if (v.muted) withSound();
    else v.muted = true;
  }

  function togglePlay() {
    const v = ref.current;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  }

  function progress() {
    const v = ref.current;
    if (bar.current && v.duration) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
  }

  // ролик со звуком досмотрен: снова тихий повтор, кнопка «Смотреть ещё раз»
  function ended() {
    const v = ref.current;
    v.muted = true;
    v.loop = true;
    userPaused.current = true;
  }

  const started = playing || !muted;
  return (
    <figure className={`about__photo about__video${playing ? ' is-playing' : ''}${muted ? '' : ' is-sound'}`}>
      <video
        ref={ref}
        src={video.src}
        poster={video.poster || poster}
        width={video.width}
        height={video.height}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-label={video.title}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        onTimeUpdate={progress}
        onEnded={ended}
      />
      {!auto && !started ? (
        <button type="button" className="about__video-start" onClick={withSound}>
          <span className="about__video-play">
            <Icon name="play" solid stroke={1} />
          </span>
          Смотреть
          <span className="sr-only"> видео-приветствие со звуком</span>
        </button>
      ) : (
        <div className="about__video-ctrl">
          <button type="button" className="about__video-btn about__video-btn--sound" onClick={toggleSound}>
            <Icon name={muted ? 'volumeOff' : 'volumeOn'} className="about__video-ico" stroke={2} />
            <span className="about__video-label">{muted ? 'Включить звук' : 'Звук включён'}</span>
          </button>
          <button type="button" className="about__video-btn about__video-btn--play" onClick={togglePlay}>
            <Icon name={playing ? 'pause' : 'play'} solid stroke={1} />
            <span className="sr-only">{playing ? 'Пауза' : 'Смотреть'}</span>
          </button>
        </div>
      )}
      <span className="about__video-bar" aria-hidden="true">
        <span ref={bar} />
      </span>
    </figure>
  );
}
