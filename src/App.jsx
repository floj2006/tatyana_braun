import { useRef, useState } from 'react';
import { ABOUT, APPROACH, FAQ, FORMATS, PHOTOS, PROCESS, REVIEWS, TERMS, VIDEOS } from './content/site.js';
import { ROUTES } from './routes.js';
import { useReveal } from './lib/useReveal.js';
import { track } from './lib/analytics.js';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Formats from './components/Formats.jsx';
import Approach from './components/Approach.jsx';
import Process from './components/Process.jsx';
import Media from './components/Media.jsx';
import Reviews from './components/Reviews.jsx';
import Faq from './components/Faq.jsx';
import OtherFormats from './components/OtherFormats.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import MobileCta from './components/MobileCta.jsx';
import ConsentBanner from './components/ConsentBanner.jsx';

const hasMedia = PHOTOS.length + VIDEOS.length > 0;

// Пункты меню только для разделов, у которых есть данные.
const HOME_NAV = [
  ['#about', 'Обо мне', ABOUT.paragraphs.length],
  ['#formats', 'Форматы', FORMATS.length],
  ['#approach', 'Подход', APPROACH.items.length],
  ['#process', 'Подготовка', PROCESS.steps.length],
  ['#media', 'Фото и видео', hasMedia],
  ['#reviews', 'Отзывы', REVIEWS.length],
  ['#faq', 'Вопросы', FAQ.length],
]
  .filter(([, , has]) => has)
  .map(([href, label]) => [href, label]);

const PAGE_NAV = [
  ['#approach', 'Как я веду'],
  ['#process', 'Подготовка'],
  ['#faq', 'Вопросы'],
  ['/#formats', 'Все форматы'],
];

export default function App({ route = ROUTES[0] }) {
  const pageFormat = FORMATS.find((f) => f.id === route.format);
  const page = pageFormat?.page;
  // На странице формата он уже выбран в форме.
  const [format, setFormat] = useState(route.format ?? '');
  const contactTitle = useRef(null);
  useReveal();

  // Выбор формата переносится в форму, фокус переходит к обращению.
  function chooseFormat(id) {
    setFormat(id);
    track('format_choose', { format: id });
    const el = contactTitle.current;
    if (!el) return;
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    el.focus({ preventScroll: true });
  }

  return (
    <>
      <a className="skip" href="#main">К содержимому</a>
      <Header nav={page ? PAGE_NAV : HOME_NAV} />
      <main id="main" tabIndex={-1}>
        {page ? (
          <>
            <Hero page={page} price={pageFormat.priceFrom} hasVideo={hasMedia} />
            <Approach data={{ title: page.howTitle, items: page.how }} />
            <Process data={PROCESS} terms={TERMS} />
            <Media photos={PHOTOS} videos={VIDEOS} />
            <Reviews items={REVIEWS} />
            <Faq items={[...page.faq, ...FAQ]} />
            <OtherFormats current={pageFormat.id} />
          </>
        ) : (
          <>
            <Hero onChoose={chooseFormat} hasVideo={hasMedia} />
            <About data={ABOUT} />
            <Formats items={FORMATS} selected={format} onChoose={chooseFormat} />
            <Approach data={APPROACH} />
            <Process data={PROCESS} terms={TERMS} />
            <Media photos={PHOTOS} videos={VIDEOS} />
            <Reviews items={REVIEWS} />
            <Faq items={FAQ} />
          </>
        )}
        <Contact format={format} onFormat={setFormat} titleRef={contactTitle} />
      </main>
      <Footer />
      <MobileCta />
      <ConsentBanner />
    </>
  );
}
