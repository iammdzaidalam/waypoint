import SearchBar from '../SearchBar';
import TokenBox from '../TokenBox';
import RecentSearches from '../RecentSearches';
import Reveal from '../Reveal';
import { AppWindow, AppId, AppStats, AppRows, AppRow } from '../AppWindow';
import HeroGrid from './HeroGrid';

export default function Hero() {
  return (
    <section className="hero-band" id="top">
      <HeroGrid />
      <div className="container-narrow">
        <span className="hero-badge">github activity tracer</span>
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
        <AppWindow url="github-waypoint.vercel.app/torvalds">
          <AppId initial="◆" name="Linus Torvalds" sub="@torvalds · 12 repos · 313k followers" />
          <AppStats items={[['85', 'PRs opened'], ['72', 'merged'], ['85%', 'merge rate', 'green']]} />
          <AppRows>
            <AppRow main="torvalds/linux" trail="838 PRs · 96%" />
            <AppRow main="torvalds/subsurface" trail="142 PRs · 88%" />
            <AppRow main="torvalds/test-tlb" trail="9 PRs · 100%" />
          </AppRows>
        </AppWindow>
      </Reveal>
    </section>
  );
}
