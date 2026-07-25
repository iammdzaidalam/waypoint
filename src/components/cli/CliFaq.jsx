import Reveal from '../Reveal';
import Section from '../home/Section';
import { faqs, INSTALL, REPO_URL } from '../../content/cli';

export function CliFaq() {
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

export function CliClosingCta() {
  return (
    <section className="cta-band">
      <h2>Trace GitHub <span className="dim">without</span> the tab.</h2>
      <p>One command, no dependencies, works offline once cached. Install it and run waypoint.</p>
      <div className="cta-actions cta-actions-cli">
        <code className="cta-install"><span className="tok">$</span> {INSTALL}</code>
        <a className="btn btn-ghost" href={REPO_URL} target="_blank" rel="noopener noreferrer">View source</a>
      </div>
    </section>
  );
}
