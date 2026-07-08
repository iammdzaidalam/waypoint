import { useState } from 'react';
import { timeAgo, filterPRs, bucketPRsByTime } from '../lib/utils';
import { ExportService } from '../lib/services';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function RepoResult({ data, onTrace }) {
  const { repoData, allPRs } = data;
  const [timeSel, setTimeSel] = useState('90');
  const [branchSel, setBranchSel] = useState('all');
  const [showAllContribs, setShowAllContribs] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'count', direction: 'desc' });
  
  const branches = Array.from(new Set(allPRs.map(p => p.base?.ref).filter(Boolean)));
  
  const filtered = filterPRs(allPRs, timeSel, branchSel);
  const merged = filtered.filter(p => p.merged_at);
  const closedNotMerged = filtered.filter(p => p.state === 'closed' && !p.merged_at);
  const open = filtered.filter(p => p.state === 'open');
  const decided = merged.length + closedNotMerged.length;
  const mergeRate = decided > 0 ? Math.round((merged.length / decided) * 100) : null;

  let avgMergeDays = null;
  if (merged.length) {
    const totalDays = merged.reduce((sum, p) => sum + (new Date(p.merged_at) - new Date(p.created_at)) / 86400000, 0);
    avgMergeDays = (totalDays / merged.length).toFixed(1);
  }

  const labelCounts = {};
  filtered.forEach(p => (p.labels || []).forEach(l => { labelCounts[l.name] = (labelCounts[l.name] || 0) + 1; }));
  const topLabels = Object.entries(labelCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const maxLabel = topLabels.length ? topLabels[0][1] : 1;

  const contribCounts = {};
  filtered.forEach(p => {
    if (!p.user?.login) return;
    const login = p.user.login;
    if (!contribCounts[login]) {
      contribCounts[login] = { 
        count: 0, 
        merged: 0, 
        open: 0, 
        closed: 0, 
        avatar: p.user.avatar_url 
      };
    }
    contribCounts[login].count++;
    if (p.merged_at) contribCounts[login].merged++;
    else if (p.state === 'open') contribCounts[login].open++;
    else contribCounts[login].closed++;
  });
  
  const sortedContributors = Object.entries(contribCounts).sort((a, b) => {
    let valA = a[1][sortConfig.key];
    let valB = b[1][sortConfig.key];
    
    if (sortConfig.key === 'mergeRate') {
      valA = a[1].merged + a[1].closed > 0 ? (a[1].merged / (a[1].merged + a[1].closed)) : 0;
      valB = b[1].merged + b[1].closed > 0 ? (b[1].merged / (b[1].merged + b[1].closed)) : 0;
    }
    
    if (valA < valB) return sortConfig.direction === 'desc' ? 1 : -1;
    if (valA > valB) return sortConfig.direction === 'desc' ? -1 : 1;
    return 0;
  });
  
  const topContributors = showAllContribs ? sortedContributors : sortedContributors.slice(0, 9);

  const handleExportJSON = () => {
    ExportService.exportToJSON(filtered, `${repoData.name}-prs`);
  };
  const handleExportCSV = () => {
    const headers = ['Title', 'Author', 'State', 'Created At', 'Merged At', 'URL'];
    const rows = filtered.map(p => [
      p.title,
      p.user?.login || 'unknown',
      p.merged_at ? 'merged' : p.state,
      p.created_at,
      p.merged_at || '',
      p.html_url
    ]);
    ExportService.exportToCSV(headers, rows, `${repoData.name}-prs`);
  };

  const { buckets } = bucketPRsByTime(filtered);
  const maxBucket = buckets.length ? Math.max(...buckets.map(b => b.count)) : 1;
  const showLabelEvery = Math.max(1, Math.ceil(buckets.length / 10));

  return (
    <div className="fade-in">
      <div className="subject-card">
        <img src={`${repoData.owner.avatar_url}&s=112`} alt="" />
        <div>
          <div className="name">{repoData.full_name}</div>
          <div className="login"><a href={repoData.html_url} target="_blank" rel="noopener noreferrer">view on github</a> · repository</div>
          {repoData.description && <div className="bio">{repoData.description}</div>}
        </div>
        <div className="rstats-inline">★ {repoData.stargazers_count} · {repoData.language || ''}<br/>{repoData.open_issues_count} open issues</div>
      </div>

      <section className="block">
        <h2>Pull Request Analytics</h2>
        <div className="note" style={{marginTop: 0, marginBottom: '24px'}}>Analytics are based on the most recent {allPRs.length} pull requests fetched (up to 1,000 or 6 months), filtered below.</div>

        <div className="controls-row">
          <select value={timeSel} onChange={e => setTimeSel(e.target.value)}>
            <option value="14">Last 2 weeks</option>
            <option value="30">Last month</option>
            <option value="90">Last 3 months</option>
            <option value="180">Last 6 months</option>
            <option value="all">All fetched</option>
          </select>
          <select value={branchSel} onChange={e => setBranchSel(e.target.value)}>
            <option value="all">All branches</option>
            {branches.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
            <button className="traceBtn" style={{ padding: '8px 12px', fontSize: '12px' }} onClick={handleExportCSV}>Export CSV</button>
            <button className="traceBtn" style={{ padding: '8px 12px', fontSize: '12px' }} onClick={handleExportJSON}>Export JSON</button>
          </div>
        </div>

        <div className="stat-strip" style={{marginBottom: 0}}>
          <div className="stat-box"><div className="val">{filtered.length}</div><div className="lbl">PRs in view</div></div>
          <div className="stat-box"><div className="val">{merged.length}</div><div className="lbl">merged</div></div>
          <div className="stat-box"><div className="val">{open.length}</div><div className="lbl">open</div></div>
          <div className="stat-box"><div className="val">{mergeRate !== null ? `${mergeRate}%` : '—'}</div><div className="lbl">merge rate (decided)</div></div>
          <div className="stat-box"><div className="val">{avgMergeDays !== null ? avgMergeDays : '—'}</div><div className="lbl">avg days to merge</div></div>
        </div>
      </section>

      {topLabels.length > 0 && (
        <section className="block">
          <h2>Label distribution</h2>
          {topLabels.map(([name, count]) => (
            <div key={name} className="bar-row">
              <div className="bar-label">{name}</div>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.max(4, Math.round((count / maxLabel) * 100))}%` }}></div></div>
              <div className="bar-val">{count}</div>
            </div>
          ))}
        </section>
      )}

      <section className="block">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '16px' }}>
          <h2 style={{ margin: 0 }}>Top contributors in view</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Sort:</span>
            <select style={{ padding: '2px 6px', fontSize: '12px' }} value={sortConfig.key} onChange={e => setSortConfig({...sortConfig, key: e.target.value})}>
              <option value="count">Total PRs</option>
              <option value="merged">Merged PRs</option>
              <option value="open">Open PRs</option>
              <option value="closed">Closed PRs</option>
              <option value="mergeRate">Merge Rate</option>
            </select>
            <button className="trace-btn" style={{ padding: '2px 8px', minWidth: '28px' }} onClick={() => setSortConfig({...sortConfig, direction: sortConfig.direction === 'desc' ? 'asc' : 'desc'})}>
              {sortConfig.direction === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        </div>
        <div className="people-grid">
          {topContributors.map(([login, pdata]) => {
            const decided = pdata.merged + pdata.closed;
            const rate = decided > 0 ? Math.round((pdata.merged / decided) * 100) : 0;
            return (
              <div key={login} className="person-card">
                <div className="person-top">
                  <img src={`${pdata.avatar}&s=68`} alt="" />
                  <div>
                    <div className="person-login">{login}</div>
                    <div className="person-meta" style={{ lineHeight: '1.4' }}>
                      <span style={{ color: 'var(--accent)' }}>{pdata.count} PRs</span> · {pdata.merged} merged · {pdata.open} open<br/>
                      {rate}% merge rate
                    </div>
                  </div>
                </div>
                <button className="trace-btn" onClick={() => onTrace(login)}>Trace this person →</button>
              </div>
            );
          })}
        </div>
        {!showAllContribs && sortedContributors.length > 9 && (
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <button className="trace-btn" onClick={() => setShowAllContribs(true)}>Load all {sortedContributors.length} contributors ↓</button>
          </div>
        )}
      </section>

      <section className="block">
        <h2>Recent pull requests</h2>
        <ul className="timeline">
          {filtered.slice(0, 15).map(p => {
            const state = p.merged_at ? 'merged' : (p.state === 'open' ? 'open' : 'closed');
            return (
              <li key={p.id}>
                <div className="tl-top">
                  <span><span className={`state-badge ${state}`}>{state}</span> {p.user?.login || 'unknown'} · into {p.base?.ref || '?'}</span>
                  <span>{timeAgo(p.created_at)}</span>
                </div>
                <div className="tl-title"><a href={p.html_url} target="_blank" rel="noopener noreferrer">{p.title}</a></div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
