'use client';
import { useEffect, useState } from 'react';
import { analyzeQuery } from '../lib/analyze';
import ResultsClient from './ResultsClient';
import { ResultHeadInner } from './ResultLayout';

function LightHeader({ initial }) {
  const isRepo = !!initial.full_name;
  const avatarUrl = isRepo ? initial.owner?.avatar_url : initial.avatar_url;
  const login = isRepo ? initial.owner?.login : initial.login;
  const name = isRepo ? initial.full_name : (initial.name || initial.login);
  const bio = isRepo ? initial.description : initial.bio;

  return (
    <div className="fade-in border-b border-line">
      <ResultHeadInner
        avatar={avatarUrl ? `${avatarUrl}&s=112` : null}
        alt={`${login} avatar`}
        name={name}
        meta={`@${login}`}
        bio={bio}
      />
    </div>
  );
}

export default function LiveResult({ query, forceType, initial }) {
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('Looking up...');
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [tokenInput, setTokenInput] = useState('');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('waypoint_token') : null;
    if (saved) setTokenInput(saved);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const token = typeof window !== 'undefined' ? localStorage.getItem('waypoint_token') : null;
    setError(null);
    setErrorCode(null);
    setStatus(`Looking up ${query}...`);

    analyzeQuery(query, forceType, token, s => { if (!cancelled) setStatus(s); })
      .then(data => {
        if (cancelled) return;
        setResult(data);
      })
      .catch(err => {
        if (cancelled) return;
        let msg = 'Something went wrong. Please try again.';
        if (err.message === 'NOT_FOUND') msg = `Couldn't find "${query}" as a user, org, or repo.`;
        if (err.message === 'RATE_LIMIT') msg = 'GitHub API rate limit hit. Add a personal token for higher limits to continue.';
        setError(msg);
        setErrorCode(err.message);
      })
      .finally(() => { if (!cancelled) setStatus(''); });

    return () => { cancelled = true; };
  }, [query, forceType, attempt]);

  if (result) return <ResultsClient data={result} />;

  return (
    <div className="frame">
      <div className="col pb-16">
      {initial && <LightHeader initial={initial} />}
      {status && <div className="status">{status}</div>}
      {error && (
        <div className="error-box fade-in">
          {error}
          {errorCode === 'RATE_LIMIT' ? (
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                autoComplete="off"
                data-1p-ignore
                data-lpignore="true"
                data-bwignore
                style={{ flex: '1 1 260px' }}
              />
              <button
                type="button"
                className="traceBtn"
                onClick={() => {
                  if (tokenInput.trim()) localStorage.setItem('waypoint_token', tokenInput.trim());
                  setAttempt(a => a + 1);
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <div style={{ marginTop: '12px' }}>
              <button type="button" className="traceBtn" onClick={() => setAttempt(a => a + 1)}>Retry</button>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
