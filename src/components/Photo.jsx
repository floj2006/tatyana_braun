import { imgUrl, useImage } from '../lib/useImage.js';

/** Фото из public/img. Если файла нет, ничего не рисуем: пустых заглушек на сайте не бывает. */
export default function Photo({ file, alt, className = '' }) {
  const ok = useImage(file);
  if (!ok) return null;
  return (
    <div className={`photo ${className}`}>
      <img src={imgUrl(file)} alt={alt} loading="lazy" decoding="async" />
    </div>
  );
}
