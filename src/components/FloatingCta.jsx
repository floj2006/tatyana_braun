import { useEffect, useState } from 'react';
import { track } from '../lib/analytics.js';

// Плавающая кнопка на телефоне: прячется на первом экране (там своя кнопка)
// и когда на экране уже форма контакта.
export default function FloatingCta() {
  const [atContact, setAtContact] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 500);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const el = document.getElementById('contact');
    let io;
    if (el && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(([en]) => setAtContact(en.isIntersecting), { threshold: 0.15 });
      io.observe(el);
    }
    return () => {
      window.removeEventListener('scroll', onScroll);
      io?.disconnect();
    };
  }, []);
  const hide = atContact || !scrolled;
  return (
    <a className={`fab${hide ? ' hide' : ''}`} href="#contact" tabIndex={hide ? -1 : 0} onClick={() => track('cta_click', { place: 'fab' })}>
      Узнать про дату
    </a>
  );
}
