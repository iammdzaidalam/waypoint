import Reveal from '../Reveal';
import Section from './Section';
import TerminalWindow from '../TerminalWindow';

// Two mirrored text/terminal splits. Same shell, opposite order.

export function VisibilitySplit() {
  return (
    <Section gray>
      <div className="col">
        <div className="split">
          <Reveal className="split-text">
            <h2>One search. Every contribution. Full visibility.</h2>
            <p>
              Waypoint separates a developer’s pull requests by outcome, so the real merge rate is
              right there instead of buried in a list.
            </p>
            <ul className="checklist">
              <li><span className="check-dot green" /> Merged pull requests, counted and rated</li>
              <li><span className="check-dot accent" /> Open work in flight right now</li>
              <li><span className="check-dot red" /> Closed without merge, so the rate is honest</li>
            </ul>
          </Reveal>
          <Reveal className="split-window" delay={0.1} y={22}>
            <TerminalWindow title="vercel/next.js — pull requests">
              <div className="demo-line"><span className="t-green">● merged</span>  fix: hydration mismatch on stream</div>
              <div className="demo-line"><span className="t-yellow">● open</span>    feat: partial prerendering flag</div>
              <div className="demo-line"><span className="t-green">● merged</span>  docs: clarify cache semantics</div>
              <div className="demo-line"><span className="t-red">● closed</span>  chore: bump internal dep</div>
              <div className="demo-line"> </div>
              <div className="demo-line t-dim">merge rate <span className="t-white">81%</span> · avg <span className="t-white">1.9d</span> to merge</div>
            </TerminalWindow>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

export function WhatItDoes() {
  return (
    <Section gray>
      <div className="col">
        <div className="split">
          <Reveal className="split-window" y={22}>
            <TerminalWindow title="torvalds — repository trail">
              <div className="demo-line"><span className="prompt">❯</span> waypoint trace torvalds --repos</div>
              <div className="demo-line"> </div>
              <div className="demo-line"><span className="t-dim">  →</span> torvalds/linux       <span className="t-dim">838 PRs · </span><span className="t-green">96% merged</span></div>
              <div className="demo-line"><span className="t-dim">  →</span> torvalds/subsurface  <span className="t-dim">142 PRs · </span><span className="t-green">88% merged</span></div>
              <div className="demo-line"><span className="t-dim">  →</span> torvalds/test-tlb    <span className="t-dim">  9 PRs · </span><span className="t-green">100% merged</span></div>
              <div className="demo-line"> </div>
              <div className="demo-line t-dim">ranked by where real effort lands</div>
            </TerminalWindow>
          </Reveal>
          <Reveal className="split-text" delay={0.1}>
            <h2>What Waypoint actually does.</h2>
            <p>Point it at a name and it does the reading, the counting, and the ranking for you in one pass.</p>
            <ul className="checklist">
              <li><span className="check-dot accent" /> Aggregate lifetime PRs across every public repo</li>
              <li><span className="check-dot accent" /> Compute merge rate and average days to merge</li>
              <li><span className="check-dot accent" /> Rank the repositories where effort truly lands</li>
              <li><span className="check-dot accent" /> Surface an org’s active repos and likely maintainers</li>
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
