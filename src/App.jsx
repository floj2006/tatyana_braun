import { useRef, useState } from 'react';
import { EVENTS, FAQ, FORMATS, PROCESS, REVIEWS, STYLE, TERMS } from './content/site.js';
import { useReveal } from './lib/useReveal.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Style from './components/Style.jsx';
import Formats from './components/Formats.jsx';
import Events from './components/Events.jsx';
import Reviews from './components/Reviews.jsx';
import Process from './components/Process.jsx';
import Terms, { hasTerms } from './components/Terms.jsx';
import Faq from './components/Faq.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import MobileCta from './components/MobileCta.jsx';

// Пункты меню только для разделов, у которых есть данные.
const NAV = [
  ['style', 'Стиль', STYLE.items.length],
  ['formats', 'Форматы', FORMATS.length],
  ['events', 'Праздники', EVENTS.length],
  ['reviews', 'Отзывы', REVIEWS.length],
  ['process', 'Подготовка', PROCESS.steps.length],
  ['terms', 'Условия', hasTerms(TERMS)],
  ['faq', 'Вопросы', FAQ.length],
]
  .filter(([, , has]) => has)
  .map(([id, label]) => [id, label]);

export default function App() {
  const [format, setFormat] = useState('');
  const contactTitle = useRef(null);
  useReveal();

  // Выбор формата в списке переносится в форму, фокус переходит к обращению.
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
        <Hero />
        <Style data={STYLE} />
        <Formats items={FORMATS} selected={format} onChoose={chooseFormat} />
        <Events items={EVENTS} />
        <Reviews items={REVIEWS} />
        <Process data={PROCESS} />
        <Terms data={TERMS} />
        <Faq items={FAQ} />
        <Contact format={format} onFormat={setFormat} titleRef={contactTitle} />
      </main>
      <Footer />
      <MobileCta />
    </>
  );
}
