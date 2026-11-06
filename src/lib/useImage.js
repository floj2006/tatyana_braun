import { useEffect, useState } from 'react';

export const imgUrl = (file) => `${import.meta.env.BASE_URL}img/${file}`;

/** true, если файл из public/img существует и загрузился как картинка. */
export function useImage(file) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    let alive = true;
    const i = new Image();
    i.onload = () => alive && setOk(true);
    i.onerror = () => alive && setOk(false);
    i.src = imgUrl(file);
    return () => {
      alive = false;
    };
  }, [file]);
  return ok;
}
