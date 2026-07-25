import Reveal from '../Reveal';
import Section from './Section';

// A homepage signpost for the terminal version. No terminal preview here -
// the CLI page owns all of that. This is just the bridge to it.
export default function CliCallout() {
  return (
    <Section id="cli">
      <div className="col">
        <Reveal className="cli-callout">
          <div className="sec-eyebrow"><span className="ic">⌘</span> <span className="lbl">also in your terminal</span></div>
          <h2>Prefer the shell? Waypoint is a CLI too.</h2>
          <p>
            The same analysis as one command. Pipeable, scriptable, and instant once cached.
            One install, zero dependencies.
          </p>
          <div className="cli-callout-actions">
            <code className="cli-callout-install">
              <span className="tok">$</span> npm install -g github:iammdzaidalam/waypoint-cli
            </code>
            <a className="btn btn-primary" href="/cli">Explore the CLI →</a>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
