import { useEffect } from 'react';

/**
 * Мягкое появление разделов при прокрутке. Прячутся только блоки ниже первого экрана,
 * поэтому контент не мигает при загрузке. При prefers-reduced-motion ничего не делаем.
 */
export function useReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const els = [...document.querySelectorAll('.reveal')].filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight,
    );
    els.forEach((el) => el.classList.add('reveal--pending'));
    // Без отрицательного отступа: блок проявляется сразу, как только попал в экран
    // (в том числе при поиске по странице или переходе по якорю).
    const io = new IntersectionObserver((entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.remove('reveal--pending');
            io.unobserve(en.target);
          }
        }),
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      els.forEach((el) => el.classList.remove('reveal--pending'));
    };
  }, []);
}
