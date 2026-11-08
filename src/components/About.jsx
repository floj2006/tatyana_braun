import { SITE } from '../content/site.js';

// Справка «Обо мне». Абзацы story появятся, когда будут слова самой Татьяны.
export default function About({ data }) {
  if (!data?.facts?.length && !data?.story?.length) return null;
  return (
    <section className="section about reveal" id="about" aria-labelledby="about-title">
      <div className="wrap about__in">
        <h2 id="about-title">{data.title}</h2>
        <div>
          {data.facts?.length > 0 && (
            <dl className="about__facts">
              {data.facts.map((f) => (
                <div key={f.label}>
                  <dt>{f.label}</dt>
                  <dd>
                    {f.link === 'vk' && SITE.vk ? (
                      <a href={SITE.vk} target="_blank" rel="noopener noreferrer">
                        {f.text}
                        <span className="sr-only"> (откроется в новой вкладке)</span>
                      </a>
                    ) : (
                      f.text
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          )}
          {data.story?.map((p) => (
            <p className="about__story" key={p}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
