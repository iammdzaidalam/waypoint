import Reveal from '../Reveal';
import Section from '../home/Section';
import TerminalShot from './TerminalShot';
import { commands, perks, flags } from '../../content/cli';

// The interactive session, mirroring what `waypoint` prints with no args:
// the pixel wordmark, the hint line, and the slash palette.
export function Interactive() {
  return (
    <Section gray>
      <div className="col">
        <div className="split">
          <Reveal className="split-text">
            <h2>Interactive, or one command.</h2>
            <p>
              Run <code className="inline-code">waypoint</code> in your terminal and it opens a
              session, bare or with a target. Type more targets and press Enter, or press{' '}
              <kbd>/</kbd> for a command palette. Pipe it or add{' '}
              <code className="inline-code">--json</code> and it prints once and exits, which is
              what makes it scriptable.
            </p>
            <ul className="checklist">
              <li><span className="check-dot accent" /> A slash palette for auth, history, range, and cache</li>
              <li><span className="check-dot accent" /> Esc to cancel a slow trace, twice to leave</li>
              <li><span className="check-dot accent" /> Warm cache carries between traces in a session</li>
            </ul>
          </Reveal>
          <Reveal className="split-window" delay={0.1} y={22}>
            {/* a real screenshot of the launch screen: the pixel wordmark,
                the hint lines, and the slash palette exactly as `waypoint`
                opens - captured from the running CLI, not reconstructed */}
            <TerminalShot
              title="waypoint"
              src="/brand/cli-launch.png"
              width={1224}
              height={672}
              alt="the waypoint interactive session on launch: the pixel wordmark and the slash-command palette"
            />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

export function Commands() {
  return (
    <Section
      id="commands"
      icon="✦"
      label="one command"
      title="Point it at a name."
      lead="The target type is detected automatically. No subcommands to remember."
    >
      <div className="cell-grid cols-2">
        {commands.map((c, i) => (
          <Reveal className="feat2" key={c.t} delay={i * 0.07}>
            <span className="ic" style={{ background: c.bg, color: c.color }} aria-hidden="true">{c.icon}</span>
            <h3>{c.t}</h3>
            <p>{c.d}</p>
            <code className="code-chip"><span className="tok">❯</span> {c.code}</code>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Perks() {
  return (
    <Section
      gray
      icon="◇"
      label="built for the terminal"
      title="Fast, quiet, and out of your way."
      lead="The details that make it feel local rather than like a web request in a costume."
    >
      <div className="cell-grid cols-4">
        {perks.map((p, i) => (
          <Reveal className="mini" key={p.t} delay={(i % 4) * 0.06}>
            <span className="ic" aria-hidden="true">{p.icon}</span>
            <h4>{p.t}</h4>
            <p>{p.d}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function Flags() {
  return (
    <Section
      icon="⌥"
      label="flags"
      title="Tune any trace."
      lead="Every trace takes the same handful of options."
    >
      <div className="cell-grid cols-3">
        {flags.map((f, i) => (
          <Reveal className="flag-cell" key={f.flag} delay={(i % 3) * 0.06}>
            <code className="flag-name">{f.flag}</code>
            <span className="flag-desc">{f.d}</span>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
