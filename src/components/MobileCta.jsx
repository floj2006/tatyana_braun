import { useEffect, useState } from 'react';

// Плавающая кнопка на телефоне: появляется после первого экрана и прячется у формы.
export default function MobileCta() {
  const [heroGone, setHeroGone] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const hero = document.getElementById('top');
    const contact = document.getElementById('contact');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.target === hero) setHeroGone(!en.isIntersecting);
        if (en.target === contact) setAtContact(en.isIntersecting);
      });
    });
    if (hero) io.observe(hero);
    if (contact) io.observe(contact);
    return () => io.disconnect();
  }, []);

  const shown = heroGone && !atContact;
  return (
    <div className={`mobile-cta${shown ? ' is-shown' : ''}`} aria-hidden={!shown}>
      <a className="btn btn--primary btn--block" href="#contact" tabIndex={shown ? 0 : -1}>
        Узнать, свободна ли дата
      </a>
    </div>
  );
}
