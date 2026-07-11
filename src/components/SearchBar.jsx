'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { buildTracePath } from '../lib/utils';

export default function SearchBar({ initialQuery = '' }) {
  const [input, setInput] = useState(initialQuery);
  const [formatError, setFormatError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = e => {
    e.preventDefault();
    const trimmed = input.trim().replace(/^@/, '').replace(/\/+$/, '');
    const segments = trimmed.split('/').filter(Boolean);
    if (segments.length > 2) {
      setFormatError('For a repo, use the format owner/repo, like jaegertracing/jaeger.');
      return;
    }
    setFormatError(null);
    if (!trimmed) return;
    setLoading(true);
    router.push(buildTracePath(trimmed));
  };

  return (
    <>
      <form className="searchForm" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="username, org, or owner/repo"
          autoComplete="off"
        />
        <button type="submit" className="traceBtn" disabled={loading}>Trace</button>
      </form>
      {formatError && <div className="error-box fade-in">{formatError}</div>}
    </>
  );
}
