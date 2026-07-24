import Reveal from '../Reveal';
import Section from './Section';
import { features, minis, traceTargets } from '../../content/home';

export function ChipStrip() {
  return (
    <Section flush hatch={false}>
      <Reveal>
        <div className="chip-strip">
          <span className="strip-label">// trace anyone on GitHub</span>
          <div className="logos-strip">
            {traceTargets.map(x => <span className="logo-chip" key={x}>{x}</span>)}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

export function Features() {
  return (
    <Section
      id="features"
      icon="✦"
      label="why waypoint"
      title="Signal, not just a profile page."
      lead="Four views over the same public data, each one answering a question GitHub leaves open."
    >
      <div className="cell-grid cols-2">
        {features.map((f, i) => (
          <Reveal className="feat2" key={f.t} delay={i * 0.07}>
            <span className="ic" style={{ background: f.bg, color: f.color }} aria-hidden="true">{f.icon}</span>
            <h3>{f.t}</h3>
            <p>{f.d}</p>
            <code className="code-chip"><span className="tok">❯</span> {f.code}</code>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function SmallThings() {
  return (
    <Section
      gray
      icon="◇"
      label="quality of life"
      title="Small things that add up."
      lead="Details you will appreciate every trace."
    >
      <div className="cell-grid cols-4">
        {minis.map((m, i) => (
          <Reveal className="mini" key={m.t} delay={(i % 4) * 0.06}>
            <span className="ic" aria-hidden="true">{m.icon}</span>
            <h4>{m.t}</h4>
            <p>{m.d}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
