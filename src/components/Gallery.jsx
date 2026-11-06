import { useEffect, useState } from 'react';
import { imgUrl } from '../lib/useImage.js';

const FILES = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `gallery-${n}.jpg`);

// Показываются только фото, которые реально лежат в public/img. Нет фото, нет блока.
export default function Gallery() {
  const [ok, setOk] = useState([]);
  useEffect(() => {
    let alive = true;
    FILES.forEach((f) => {
      const i = new Image();
      i.onload = () => alive && setOk((s) => (s.includes(f) ? s : [...s, f].sort()));
      i.src = imgUrl(f);
    });
    return () => {
      alive = false;
    };
  }, []);
  if (!ok.length) return null;
  return (
    <section className="section" id="gallery">
      <div className="container">
        <h2>Фото</h2>
        <div className="masonry">
          {ok.map((f) => (
            <img key={f} src={imgUrl(f)} alt="" loading="lazy" decoding="async" />
          ))}
        </div>
      </div>
    </section>
  );
}
