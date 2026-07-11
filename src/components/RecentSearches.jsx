'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HistoryService } from '../lib/services';
import { buildTracePath } from '../lib/utils';

export default function RecentSearches() {
  const [history, setHistory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setHistory(HistoryService.getHistory());
  }, []);

  if (history.length === 0) return null;

  return (
    <div style={{ marginTop: '30px' }} className="fade-in">
      <div className="eyebrow" style={{ color: 'var(--text-dim)' }}>Recent Searches</div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {history.map((h, i) => (
          <button
            key={i}
            className="trace-btn"
            onClick={() => router.push(buildTracePath(h.query))}
          >
            {h.query} <span style={{ opacity: 0.5 }}>({h.type})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
