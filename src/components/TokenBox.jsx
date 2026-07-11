'use client';
import { useEffect, useState } from 'react';

export default function TokenBox() {
  const [showToken, setShowToken] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const savedToken = localStorage.getItem('waypoint_token');
    if (savedToken) setToken(savedToken);
  }, []);

  return (
    <div className="token-landing-section fade-in">
      <button type="button" className="tokenToggle" onClick={() => setShowToken(!showToken)}>+ Use personal GitHub token for higher rate limits (5,000/hr)</button>
      {showToken && (
        <div className="tokenBox" style={{ marginTop: '15px', border: 'none', padding: 0, background: 'transparent' }}>
          <p style={{ marginTop: 0, marginBottom: '12px', fontSize: '13.5px', color: 'var(--text-dim)' }}>
            Get a personal access token from <a href="https://github.com/settings/tokens/new?description=Waypoint" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>GitHub Settings</a> (no scopes needed for public repos)
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={token}
              onChange={e => { setToken(e.target.value); localStorage.setItem('waypoint_token', e.target.value); }}
              placeholder="ghp_xxxxxxxxxxxx"
              autoComplete="off"
              data-1p-ignore
              data-lpignore="true"
              data-bwignore
            />
            {token && <button type="button" className="traceBtn" onClick={() => { setToken(''); localStorage.removeItem('waypoint_token'); }} style={{ background: 'var(--bg-panel)', border: '1px solid var(--line)', color: 'var(--text-dim)' }}>Clear</button>}
          </div>
          <p style={{ marginTop: '12px', marginBottom: 0, fontSize: '12px', color: 'var(--text-faint)' }}>
            🔒 Token is stored only in your browser's localStorage
          </p>
        </div>
      )}
    </div>
  );
}
