import { SITE } from '../config/site.js';
import Photo from './Photo.jsx';

const SHOTS = [1, 2, 3, 4, 5, 6];

export default function Gallery() {
  return (
    <section className="section" id="gallery">
      <div className="container">
        <p className="eyebrow">Фото</p>
        <h2>Атмосфера праздников</h2>
        <div className="gallery">
          {SHOTS.map((n) => (
            <Photo key={n} file={`gallery-${n}.jpg`} alt={`Фото с праздника ${n}`} hint={`Фото ${n}`} className="photo--tile" />
          ))}
        </div>
        {SITE.vk && (
          <p className="gallery__note">
            Больше фото и видео — в сообществе{' '}
            <a href={SITE.vk} target="_blank" rel="noopener noreferrer">vk.ru/brauntv</a>
          </p>
        )}
      </div>
    </section>
  );
}
