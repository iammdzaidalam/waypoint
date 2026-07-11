import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { timeAgo, filterPRs } from '../lib/utils';

export default function ContributionsModal({ repo, login, prs, issues, rangeSel, onClose }) {
  const [tab, setTab] = useState('prs');

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const mergedCount = prs.filter(p => p.pull_request?.merged_at).length;
  const rangedIssues = filterPRs(issues, rangeSel, 'all');

  const renderList = (items, isPR) => (
    <ul className="timeline">
      {items.map(item => {
        const state = isPR
          ? (item.pull_request?.merged_at ? 'merged' : (item.state === 'open' ? 'open' : 'closed'))
          : (item.state === 'open' ? 'open' : 'closed');
        return (
          <li key={item.id}>
            <div className="tl-top">
              <span><span className={`state-badge ${state}`}>{state}</span></span>
              <span>{timeAgo(item.created_at)}</span>
            </div>
            <div className="tl-title">
              <a href={item.html_url} target="_blank" rel="noopener noreferrer">{item.title}</a>
            </div>
          </li>
        );
      })}
    </ul>
  );

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal fade-in" role="dialog" aria-modal="true" aria-label={`Contributions to ${repo}`} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <div className="modal-title">
              <a href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer">{repo}</a>
            </div>
            <div className="modal-sub">
              {tab === 'prs'
                ? `${prs.length} PRs · ${mergedCount} merged`
                : `${rangedIssues.length} issues in this range`}
            </div>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-tabs">
          <button type="button" className={`modal-tab ${tab === 'prs' ? 'active' : ''}`} onClick={() => setTab('prs')}>
            Pull Requests ({prs.length})
          </button>
          <button type="button" className={`modal-tab ${tab === 'issues' ? 'active' : ''}`} onClick={() => setTab('issues')}>
            Issues ({rangedIssues.length})
          </button>
        </div>
        <div className="modal-body">
          {tab === 'prs' && renderList(prs, true)}
          {tab === 'issues' && (
            rangedIssues.length > 0
              ? (
                <>
                  {issues.length >= 100 && <div className="note" style={{ marginTop: '14px', marginBottom: 0 }}>Showing the 100 most recent issues.</div>}
                  {renderList(rangedIssues, false)}
                </>
              )
              : <div className="note" style={{ marginTop: '14px' }}>No issues found in this time range.</div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
