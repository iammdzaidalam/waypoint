import Reveal from '../Reveal';
import Section from './Section';
import { faqs, REPO_URL } from '../../content/home';

export function Faq() {
  return (
    <Section id="faq" gutter contained icon="?" label="questions" title="Frequently asked.">
      <div className="cell-grid cols-2">
        {faqs.map(({ q, a }, i) => (
          <Reveal key={q} delay={i * 0.05}>
            <details className="faq-cell">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function ClosingCta() {
  return (
    <section className="cta-band">
      <h2>See where they <span className="dim">actually</span> spend their time.</h2>
      <p>No login. No setup. Point Waypoint at any GitHub user, org, or repo and read the real story.</p>
      <div className="cta-actions">
        <a className="btn btn-primary" href="/#top">Start tracing</a>
        <a className="btn btn-ghost" href={REPO_URL} target="_blank" rel="noopener noreferrer">View source</a>
      </div>
    </section>
  );
}
