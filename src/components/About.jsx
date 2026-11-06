import { BENEFITS } from '../config/site.js';
import { track } from '../lib/analytics.js';
import Photo from './Photo.jsx';

export default function About() {
  return (
    <section className="section section--dark" id="about">
      <div className="container about">
        <div className="about__photo">
          <Photo file="about.jpg" alt="Татьяна Браун на празднике" hint="Второе фото" className="photo--square" />
        </div>
        <div className="about__text">
          <p className="eyebrow eyebrow--light">Обо мне</p>
          <h2>Я Татьяна, и я люблю, когда люди празднуют по-настоящему</h2>
          {/* TODO: заменить своими словами Татьяны */}
          <p>
            Моя задача — чтобы вы и ваши гости забыли о часах и просто были в моменте. Я не читаю один сценарий на
            всех: сначала знакомлюсь с вами, узнаю, что для вас важно, и только потом собираю программу.
          </p>
          <ul className="ticks">
            {BENEFITS.map(([title, text]) => (
              <li key={title}>
                <b>{title}.</b> {text}
              </li>
            ))}
          </ul>
          <a className="btn btn--silver" href="#contact" onClick={() => track('cta_click', { place: 'about' })}>
            Познакомиться
          </a>
        </div>
      </div>
    </section>
  );
}
