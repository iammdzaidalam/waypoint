import Reveal from '../Reveal';
import TerminalShot from './TerminalShot';
import HeroGrid from '../home/HeroGrid';
import InstallCommand from './InstallCommand';
import { INSTALL, REPO_URL } from '../../content/cli';

export default function CliHero() {
  return (
    <section className="hero-band hero-band--cli" id="top">
      <HeroGrid variant="cli" />
      <div className="container-narrow">
        <span className="hero-badge">the github tracer for your terminal</span>
        <h1>Trace where they work <span className="hl">without</span> leaving the shell.</h1>
        <p className="hero-sub">
          The same analysis as the web app, in your shell. An interactive session for
          exploring, one-shot output for scripts and CI.
        </p>
        <InstallCommand command={INSTALL} />
        <p className="hero-note">
          Node 20.12+, zero dependencies. Then run <a href="#commands">waypoint</a>, or{' '}
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">read the source</a>.
        </p>
      </div>

      <Reveal className="hero-window-wrap" y={26} delay={0.1}>
        <TerminalShot
          title="waypoint torvalds"
          src="/brand/cli-report.png"
          width={1480}
          height={1512}
          alt="waypoint torvalds, a full trace in the terminal: lifetime pull requests, activity mix, and recent trail"
          priority
        />
      </Reveal>
    </section>
  );
}
