import SearchBar from '../SearchBar';
import TokenBox from '../TokenBox';
import RecentSearches from '../RecentSearches';
import Reveal from '../Reveal';
import TerminalWindow from '../TerminalWindow';

export default function Hero() {
  return (
    <section className="hero-band" id="top">
      <div className="container-narrow">
        <span className="hero-badge">// github activity tracer</span>
        <h1>See where developers <span className="hl">actually</span> spend their time.</h1>
        <p className="hero-sub">
          Trace any GitHub user, org, or repo and map real contribution activity: pull requests,
          merge rates, review speed, and the trails developers leave behind.
        </p>
        <SearchBar />
        <p className="hero-note">
          No login needed. Try <a href="/torvalds">torvalds</a> or <a href="/vercel/next.js">vercel/next.js</a>.
        </p>
        <TokenBox />
        <div className="hero-recent"><RecentSearches /></div>
      </div>

      <Reveal className="hero-window-wrap" y={26} delay={0.1}>
        <TerminalWindow title="waypoint — trace">
          <div className="demo-line"><span className="prompt">❯</span> waypoint trace torvalds</div>
          <div className="demo-line t-dim">  resolving user · reading public events · aggregating pull requests</div>
          <div className="demo-line"> </div>
          <div className="demo-line"><span className="t-dim">  PRs opened   </span><span className="t-white">1,204</span></div>
          <div className="demo-line"><span className="t-dim">  merge rate   </span><span className="t-green">92%</span></div>
          <div className="demo-line"><span className="t-dim">  avg to merge </span><span className="t-yellow">2.4d</span></div>
          <div className="demo-line"> </div>
          <div className="demo-line"><span className="t-dim">  →</span> most active in torvalds/linux <span className="t-dim">· 838 PRs</span></div>
          <div className="demo-line t-green">✓ trace complete</div>
        </TerminalWindow>
      </Reveal>
    </section>
  );
}
