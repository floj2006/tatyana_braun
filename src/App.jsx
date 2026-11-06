import { useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Showreel from './components/Showreel.jsx';
import Services from './components/Services.jsx';
import About from './components/About.jsx';
import Packages from './components/Packages.jsx';
import Steps from './components/Steps.jsx';
import Gallery from './components/Gallery.jsx';
import Reviews from './components/Reviews.jsx';
import Faq from './components/Faq.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import FloatingCta from './components/FloatingCta.jsx';

export default function App() {
  // выбранный повод общий для карточек и формы
  const [eventId, setEventId] = useState('wedding');

  return (
    <>
      <a className="skip" href="#main">К содержимому</a>
      <Header />
      <main id="main">
        <Hero />
        <Showreel />
        <Services onSelect={setEventId} />
        <About />
        <Packages />
        <Steps />
        <Gallery />
        <Reviews />
        <Faq />
        <Contact eventId={eventId} onEventChange={setEventId} />
      </main>
      <Footer />
      <FloatingCta />
    </>
  );
}
