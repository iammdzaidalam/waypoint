import Reveal from '../Reveal';
import Section from './Section';
import { problems } from '../../content/home';

export default function Problem() {
  return (
    <Section
      id="how"
      padTop
      icon="◆"
      label="the problem"
      title="A GitHub profile hides more than it shows."
      lead="Waypoint reads the same public data you can, then does the aggregation GitHub never surfaces."
    >
      <div className="cell-grid cols-3">
        {problems.map((p, i) => (
          <Reveal className="tri-card" key={p.t} delay={i * 0.08}>
            <div className="tri-illus">{p.icon}</div>
            <h3>{p.t}</h3>
            <p>{p.d}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
