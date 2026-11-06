import { ABOUT } from '../config/site.js';
import Photo from './Photo.jsx';

// Показывается, только когда в ABOUT.paragraphs есть её собственный текст.
export default function About() {
  if (!ABOUT.paragraphs.length) return null;
  return (
    <section className="section section--soft" id="about">
      <div className="container about">
        <Photo file="about.jpg" alt="Татьяна Браун на празднике" className="photo--about" />
        <div className="about__text">
          <h2>О себе</h2>
          {ABOUT.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
