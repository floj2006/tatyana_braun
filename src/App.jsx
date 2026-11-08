import { useRef, useState } from 'react';
import { ABOUT, APPROACH, FAQ, FORMATS, PHOTOS, PROCESS, REVIEWS, TERMS, VIDEOS } from './content/site.js';
import { useReveal } from './lib/useReveal.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Formats from './components/Formats.jsx';
import Approach from './components/Approach.jsx';
import Process from './components/Process.jsx';
import Media from './components/Media.jsx';
import Reviews from './components/Reviews.jsx';
import Faq from './components/Faq.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import MobileCta from './components/MobileCta.jsx';

// Пункты меню только для разделов, у которых есть данные.
const NAV = [
  ['about', 'Обо мне', ABOUT.paragraphs.length],
  ['formats', 'Форматы', FORMATS.length],
  ['approach', 'Подход', APPROACH.items.length],
  ['process', 'Подготовка', PROCESS.steps.length],
  ['media', 'Фото и видео', PHOTOS.length + VIDEOS.length],
  ['reviews', 'Отзывы', REVIEWS.length],
  ['faq', 'Вопросы', FAQ.length],
]
  .filter(([, , has]) => has)
  .map(([id, label]) => [id, label]);

export default function App() {
  const [format, setFormat] = useState('');
  const contactTitle = useRef(null);
  useReveal();

  // Выбор формата переносится в форму, фокус переходит к обращению.
  function chooseFormat(id) {
    setFormat(id);
    const el = contactTitle.current;
    if (!el) return;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    el.focus({ preventScroll: true });
  }

  return (
    <>
      <a className="skip" href="#main">К содержимому</a>
      <Header nav={NAV} />
      <main id="main" tabIndex={-1}>
        <Hero onChoose={chooseFormat} hasVideo={VIDEOS.length > 0} />
        <About data={ABOUT} />
        <Formats items={FORMATS} selected={format} onChoose={chooseFormat} />
        <Approach data={APPROACH} />
        <Process data={PROCESS} terms={TERMS} />
        <Media photos={PHOTOS} videos={VIDEOS} />
        <Reviews items={REVIEWS} />
        <Faq items={FAQ} />
        <Contact format={format} onFormat={setFormat} titleRef={contactTitle} />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
