'use client';
import { useState, useEffect, Suspense } from 'react';
import UserResult from '../components/UserResult';
import OrgResult from '../components/OrgResult';
import RepoResult from '../components/RepoResult';
import { useWaypoint } from '../hooks/useWaypoint';
import { HistoryService } from '../lib/services';

function WaypointContent() {
  const [showToken, setShowToken] = useState(false);
  const {
    token, setToken,
    input, setInput,
    status, error, loading, result,
    runTrace
  } = useWaypoint();
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setHistory(HistoryService.getHistory());
  }, [result]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('waypoint_theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('waypoint_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <>
      <div className="floating-actions fade-in">
        <a href="https://github.com/iammdzaidalam/waypoint" target="_blank" rel="noopener noreferrer" className="fab fab-github" title="Star on GitHub">
          <svg className="icon-github" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
          <svg className="icon-star" viewBox="0 0 16 16"><path fillRule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
        </a>
        <button onClick={toggleTheme} className="fab" title="Toggle Theme" type="button">
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z"></path></svg>
          ) : (
            <svg viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"></path></svg>
          )}
        </button>
      </div>

    <div className="wrap">
      {(!result && !loading && !status) && (
        <div className="hero-section">
          <div className="eyebrow">GITHUB ACTIVITY TRACER</div>
          <h1 className="title">Waypoint</h1>
          <p className="tagline">Uncover exactly where developers spend their time. Track open source activity, review speeds, and hidden contributions instantly.</p>
        </div>
      )}

      <form className="searchForm" onSubmit={e => { e.preventDefault(); runTrace(input); }}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="username, org, or owner/repo" autoComplete="off" />
        <button type="submit" className="traceBtn" disabled={loading}>Trace</button>
      </form>

      {(!result && !loading && !status) && (
        <>
          <div className="token-landing-section fade-in">
            <button type="button" className="tokenToggle" onClick={() => setShowToken(!showToken)}>+ Use personal GitHub token for higher rate limits (5,000/hr)</button>
            {showToken && (
              <div className="tokenBox" style={{ marginTop: '15px', border: 'none', padding: 0, background: 'transparent' }}>
                <p style={{ marginTop: 0, marginBottom: '12px', fontSize: '13.5px', color: 'var(--text-dim)' }}>
                  Get a personal access token from <a href="https://github.com/settings/tokens/new?description=Waypoint" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>GitHub Settings</a> (no scopes needed for public repos)
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="password" value={token} onChange={e => { setToken(e.target.value); localStorage.setItem('waypoint_token', e.target.value); }} placeholder="ghp_xxxxxxxxxxxx" />
                  {token && <button type="button" className="traceBtn" onClick={() => { setToken(''); localStorage.removeItem('waypoint_token'); }} style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', color: 'var(--text-dim)' }}>Clear</button>}
                </div>
                <p style={{ marginTop: '12px', marginBottom: 0, fontSize: '12px', color: 'var(--text-faint)' }}>
                  🔒 Token is stored only in your browser's localStorage
                </p>
              </div>
            )}
          </div>

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
        </>
      )}

      {status && <div className="status">{status}</div>}
      {error && <div className="error-box fade-in">{error}</div>}
      
      {history.length > 0 && !loading && !result && !status && !error && (
        <div style={{ marginTop: '30px' }} className="fade-in">
          <div className="eyebrow" style={{ color: 'var(--text-dim)' }}>Recent Searches</div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {history.map((h, i) => (
              <button 
                key={i} 
                className="trace-btn" 
                onClick={() => { setInput(h.query); runTrace(h.query); }}
              >
                {h.query} <span style={{ opacity: 0.5 }}>({h.type})</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="results">
        {result?.type === 'user' && <UserResult data={result} onTrace={runTrace} />}
        {result?.type === 'org' && <OrgResult data={result} onTrace={runTrace} />}
        {result?.type === 'repo' && <RepoResult data={result} onTrace={runTrace} />}
      </div>
    </div>
    </>
  );
}

export default function Waypoint() {
  return (
    <Suspense fallback={<div className="wrap">Loading...</div>}>
      <WaypointContent />
    </Suspense>
  );
}
