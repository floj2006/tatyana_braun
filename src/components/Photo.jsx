import { useState } from 'react';

/**
 * Фото из public/img. Пока файла нет — серебристая заглушка с подсказкой.
 * Используется <img>, а не inline-style, чтобы работала строгая CSP.
 */
export default function Photo({ file, alt, hint, className = '' }) {
  const [ok, setOk] = useState(true);
  return (
    <div className={`photo ${className}`}>
      {ok ? (
        <img
          src={`${import.meta.env.BASE_URL}img/${file}`}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setOk(false)}
        />
      ) : (
        <span className="photo__hint" role="img" aria-label={alt}>
          {hint}
          <small>img/{file}</small>
        </span>
      )}
    </div>
  );
}
