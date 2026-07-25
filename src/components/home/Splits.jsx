import Reveal from '../Reveal';
import Section from './Section';
import { AppWindow, AppId, AppStats, AppRows, AppRow } from '../AppWindow';

// Two mirrored text/preview splits. Same shell, opposite order.

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
            <AppWindow url="github-waypoint.vercel.app/vercel/next.js">
              <AppId initial="▲" name="vercel/next.js" sub="The React Framework · 141k stars" />
              <AppStats items={[
                ['210', 'merged', 'magenta'],
                ['230', 'open', 'green'],
                ['78%', 'merge rate', 'green'],
              ]} />
              <AppRows>
                <AppRow lead="merged" tone="magenta" main="fix: hydration mismatch on stream" trail="1.2d" />
                <AppRow lead="open" tone="green" main="feat: partial prerendering flag" trail="·" />
                <AppRow lead="closed" tone="red" main="chore: bump internal dep" trail="3.0d" />
              </AppRows>
            </AppWindow>
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
            <AppWindow url="github-waypoint.vercel.app/torvalds">
              <AppId initial="◆" name="Linus Torvalds" sub="@torvalds · repositories, last 90 days" />
              <AppRows>
                <AppRow main="torvalds/linux" trail="838 PRs · 96%" />
                <AppRow main="torvalds/subsurface" trail="142 PRs · 88%" />
                <AppRow main="torvalds/test-tlb" trail="9 PRs · 100%" />
                <AppRow main="torvalds/uemacs" trail="4 PRs · 75%" />
              </AppRows>
            </AppWindow>
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
