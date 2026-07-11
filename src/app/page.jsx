import { permanentRedirect } from 'next/navigation';
import SearchBar from '../components/SearchBar';
import TokenBox from '../components/TokenBox';
import RecentSearches from '../components/RecentSearches';
import { buildTracePath } from '../lib/utils';

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const legacyQuery = params?.repo || params?.user || params?.org || params?.q;
  if (legacyQuery) {
    permanentRedirect(buildTracePath(legacyQuery));
  }

  return (
    <div className="wrap">
      <div className="hero-section">
        <div className="eyebrow">GITHUB ACTIVITY TRACER</div>
        <h1 className="title">Waypoint</h1>
        <p className="tagline">Uncover exactly where developers spend their time. Track open source activity, review speeds, and hidden contributions instantly.</p>
      </div>

      <SearchBar />

      <TokenBox />

      <div className="features-grid fade-in" style={{ marginTop: '40px' }}>
        <div className="feature-box">
          <div className="icon">📊</div>
          <h3>Activity Tracing</h3>
          <p>Trace a developer's exact footprint across commits and PRs.</p>
        </div>
        <div className="feature-box">
          <div className="icon">⏱️</div>
          <h3>Review Speeds</h3>
          <p>Track how fast repositories merge community PRs.</p>
        </div>
        <div className="feature-box">
          <div className="icon">👥</div>
          <h3>Maintainer Insights</h3>
          <p>Identify the true maintainers carrying the project's workload.</p>
        </div>
      </div>

      <RecentSearches />
    </div>
  );
}
