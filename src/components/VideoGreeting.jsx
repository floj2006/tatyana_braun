import { useEffect, useRef, useState } from 'react';

// Кнопка «Видео-приветствие» и окно с видео. Видео грузится только после нажатия.
// Без video.src ничего не выводится.
export default function VideoGreeting({ video }) {
  const [open, setOpen] = useState(false);
  const dlg = useRef(null);

  useEffect(() => {
    const d = dlg.current;
    if (open && d && !d.open) d.showModal();
  }, [open]);

  if (!video?.src) return null;
  return (
    <>
      <button type="button" className="link hero__video" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        <span className="hero__play" aria-hidden="true" />
        Видео-приветствие
      </button>
      <dialog
        ref={dlg}
        className="sheet video-sheet"
        aria-label={video.title}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === dlg.current && dlg.current.close()}
      >
        {open && (
          <div className="video-sheet__in">
            <button type="button" className="sheet__close" onClick={() => dlg.current.close()}>
              <span className="sr-only">Закрыть</span>
            </button>
            {/* субтитры можно добавить через <track>, когда будет текст приветствия */}
            <video src={video.src} poster={video.poster || undefined} controls autoPlay playsInline preload="metadata" />
          </div>
        )}
      </dialog>
    </>
  );
}
