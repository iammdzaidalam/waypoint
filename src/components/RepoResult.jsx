import { useState } from 'react';
import { timeAgo, filterPRs } from '../lib/utils';
import { ExportService } from '../lib/services';
import Image from 'next/image';
import { ResultHead, ResultSection, Bento, StatCell } from './ResultLayout';

export default function RepoResult({ data, onTrace }) {
  const { repoData, allPRs, allIssues } = data;
  const [timeSel, setTimeSel] = useState('90');
  const [branchSel, setBranchSel] = useState('all');
  const [showAllContribs, setShowAllContribs] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'count', direction: 'desc' });
  const [recentTab, setRecentTab] = useState('prs');

  const branches = Array.from(new Set(allPRs.map(p => p.base?.ref).filter(Boolean)));

  const filtered = filterPRs(allPRs, timeSel, branchSel);
  const filteredIssues = filterPRs(allIssues || [], timeSel, 'all');
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
      valA = a[1].count > 0 ? (a[1].merged / a[1].count) : 0;
      valB = b[1].count > 0 ? (b[1].merged / b[1].count) : 0;
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

  return (
    <div className="fade-in">
      <ResultHead
        avatar={`${repoData.owner.avatar_url}&s=112`}
        alt={`${repoData.owner.login} avatar`}
        name={repoData.full_name}
        meta={<><a className="hover:text-accent" href={repoData.html_url} target="_blank" rel="noopener noreferrer">view on github</a> · repository</>}
        bio={repoData.description}
        aside={<>{repoData.stargazers_count} stars{repoData.language ? ` · ${repoData.language}` : ''}<br />{repoData.open_issues_count} open issues</>}
      />

      <ResultSection
        label="analytics"
        title="Pull request analytics"
        note={`Based on the most recent ${allPRs.length} pull requests fetched (up to 1,000 or 6 months), filtered below.`}
        control={
          <div className="flex flex-wrap items-center gap-2">
            <select value={timeSel} onChange={e => setTimeSel(e.target.value)} className="font-mono text-xs">
              <option value="14">Last 2 weeks</option>
              <option value="30">Last month</option>
              <option value="90">Last 3 months</option>
              <option value="180">Last 6 months</option>
              <option value="all">All fetched</option>
            </select>
            <select value={branchSel} onChange={e => setBranchSel(e.target.value)} className="font-mono text-xs">
              <option value="all">All branches</option>
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <button className="btn btn-ghost h-9 px-3 text-xs" onClick={handleExportCSV}>Export CSV</button>
            <button className="btn btn-ghost h-9 px-3 text-xs" onClick={handleExportJSON}>Export JSON</button>
          </div>
        }
      >
        <Bento cols={5}>
          <StatCell value={filtered.length} label="PRs in view" />
          <StatCell value={merged.length} label="merged" />
          <StatCell value={open.length} label="open" />
          <StatCell value={mergeRate !== null ? `${mergeRate}%` : 'n/a'} label="merge rate (decided)" />
          <StatCell value={avgMergeDays !== null ? avgMergeDays : 'n/a'} label="avg days to merge" />
        </Bento>
      </ResultSection>

      {topLabels.length > 0 && (
        <ResultSection label="labels" title="Label distribution">
          {topLabels.map(([name, count]) => (
            <div key={name} className="bar-row">
              <div className="bar-label">{name}</div>
              <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.max(4, Math.round((count / maxLabel) * 100))}%` }}></div></div>
              <div className="bar-val">{count}</div>
            </div>
          ))}
        </ResultSection>
      )}

      <ResultSection
        label="people"
        title="Top contributors in view"
        control={
          <div className="flex items-center gap-2">
            <select className="font-mono text-xs" value={sortConfig.key} onChange={e => setSortConfig({ ...sortConfig, key: e.target.value })}>
              <option value="count">Total PRs</option>
              <option value="merged">Merged PRs</option>
              <option value="open">Open PRs</option>
              <option value="closed">Closed PRs</option>
              <option value="mergeRate">Merge rate</option>
            </select>
            <button
              className="btn btn-ghost h-9 w-9 p-0"
              aria-label={sortConfig.direction === 'desc' ? 'Sort ascending' : 'Sort descending'}
              onClick={() => setSortConfig({ ...sortConfig, direction: sortConfig.direction === 'desc' ? 'asc' : 'desc' })}
            >
              {sortConfig.direction === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        }
      >
        <Bento cols={4}>
          {topContributors.map(([login, pdata]) => {
            const rate = pdata.count > 0 ? Math.round((pdata.merged / pdata.count) * 100) : 0;
            return (
              <div key={login} className="flex flex-col items-start gap-3">
                <div className="flex items-center gap-3">
                  <Image src={`${pdata.avatar}&s=68`} alt={`${login} avatar`} width={34} height={34} className="border border-line" />
                  <div className="min-w-0">
                    <div className="truncate font-mono text-[13.5px]">{login}</div>
                    <div className="font-mono text-[11.5px] leading-snug text-text-faint">
                      <span className="text-accent">{pdata.count} PRs</span> · {pdata.merged} merged<br />
                      {rate}% merge rate
                    </div>
                  </div>
                </div>
                <button className="mt-auto font-mono text-xs text-accent hover:opacity-70" onClick={() => onTrace(login)}>Trace →</button>
              </div>
            );
          })}
        </Bento>
        {!showAllContribs && sortedContributors.length > 9 && (
          <div className="mt-6 text-center">
            <button className="btn btn-ghost" onClick={() => setShowAllContribs(true)}>Load all {sortedContributors.length} contributors ↓</button>
          </div>
        )}
      </ResultSection>

      <ResultSection
        label="recent traces"
        title={recentTab === 'prs' ? 'Latest pull requests' : 'Latest issues'}
        gutter
        control={
          <div className="inline-flex shrink-0 border border-line">
            <button
              type="button"
              onClick={() => setRecentTab('prs')}
              className={`px-3.5 py-1.5 text-xs transition-colors ${recentTab === 'prs' ? 'bg-btn-bg text-btn-text' : 'bg-transparent text-text-dim hover:text-text'}`}
            >
              Pull Requests
            </button>
            <button
              type="button"
              onClick={() => setRecentTab('issues')}
              className={`border-l border-line px-3.5 py-1.5 text-xs transition-colors ${recentTab === 'issues' ? 'bg-btn-bg text-btn-text' : 'bg-transparent text-text-dim hover:text-text'}`}
            >
              Issues
            </button>
          </div>
        }
      >
        {recentTab === 'prs' && (
          filtered.length === 0
            ? <p className="text-[13px] text-text-faint">No pull requests found in this time range.</p>
            : (
              <ul className="m-0 list-none border-t border-line p-0">
                {filtered.slice(0, 15).map(p => {
                  const state = p.merged_at ? 'merged' : (p.state === 'open' ? 'open' : 'closed');
                  return (
                    <li key={p.id} className="border-b border-line py-4">
                      <div className="flex justify-between gap-3 font-mono text-[11.5px] text-text-faint">
                        <span><span className={`state-badge ${state}`}>{state}</span> {p.user?.login || 'unknown'} · into {p.base?.ref || '?'}</span>
                        <span className="shrink-0">{timeAgo(p.created_at)}</span>
                      </div>
                      <div className="mt-1 text-sm"><a className="hover:text-accent" href={p.html_url} target="_blank" rel="noopener noreferrer">{p.title}</a></div>
                    </li>
                  );
                })}
              </ul>
            )
        )}
        {recentTab === 'issues' && (
          filteredIssues.length === 0
            ? <p className="text-[13px] text-text-faint">No issues found in this time range.</p>
            : (
              <ul className="m-0 list-none border-t border-line p-0">
                {filteredIssues.slice(0, 15).map(i => {
                  const state = i.state === 'open' ? 'open' : 'closed';
                  return (
                    <li key={i.id} className="border-b border-line py-4">
                      <div className="flex justify-between gap-3 font-mono text-[11.5px] text-text-faint">
                        <span><span className={`state-badge ${state}`}>{state}</span> {i.user?.login || 'unknown'}</span>
                        <span className="shrink-0">{timeAgo(i.created_at)}</span>
                      </div>
                      <div className="mt-1 text-sm"><a className="hover:text-accent" href={i.html_url} target="_blank" rel="noopener noreferrer">{i.title}</a></div>
                    </li>
                  );
                })}
              </ul>
            )
        )}
      </ResultSection>
    </div>
  );
}
