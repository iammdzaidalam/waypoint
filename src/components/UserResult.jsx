import { useState } from 'react';
import Image from 'next/image';
import { EVENT_LABELS, timeAgo, filterPRs } from '../lib/utils';
import ContributionsModal from './ContributionsModal';

const RANGE_LABELS = {
  '14': 'last 2 weeks',
  '30': 'last month',
  '90': 'last 3 months',
  '180': 'last 6 months',
  'all': 'all time'
};

export default function UserResult({ data, onTrace }) {
  const { userData, analysis, prLifetime, userPRs, userIssues } = data;
  let { topRepos, topTypes, timeline, totalEvents } = analysis;
  const [rangeSel, setRangeSel] = useState('180');
  const [modalRepo, setModalRepo] = useState(null);
  const maxTypeCount = topTypes.length ? topTypes[0][1] : 1;
  const mergeRate = prLifetime?.total > 0 ? Math.round((prLifetime.merged / prLifetime.total) * 100) : null;

  const rangedPRs = filterPRs(userPRs || [], rangeSel, 'all');

  const repoPRs = {};
  rangedPRs.forEach(pr => {
    const repoName = pr.repository_url.split('/').slice(-2).join('/');
    if (!repoPRs[repoName]) repoPRs[repoName] = { prCount: 0, mergedCount: 0, prs: [] };
    repoPRs[repoName].prCount++;
    if (pr.pull_request?.merged_at) repoPRs[repoName].mergedCount++;
    repoPRs[repoName].prs.push(pr);
  });
  const topPRRepos = Object.entries(repoPRs).sort((a, b) => b[1].prCount - a[1].prCount);

  // Issues are already fetched up front alongside PRs, so the modal never has to
  // make its own network call; just group them by repo the same way as PRs.
  const repoIssues = {};
  (userIssues || []).forEach(issue => {
    const repoName = issue.repository_url.split('/').slice(-2).join('/');
    if (!repoIssues[repoName]) repoIssues[repoName] = [];
    repoIssues[repoName].push(issue);
  });

  // Augment timeline with our robust PR data (fixes missing events for highly active bots)
  if (userPRs && userPRs.length > 0) {
    const prItems = userPRs.map(pr => {
      const repoName = pr.repository_url.split('/').slice(-2).join('/');
      return {
        repo: repoName,
        date: pr.created_at,
        type: 'PullRequestEvent',
        title: pr.title,
        url: pr.html_url,
        action: 'opened'
      };
    });

    const combined = [...timeline, ...prItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const unique = [];
    const seen = new Set();

    for (const item of combined) {
      if (item.url) {
        if (!seen.has(item.url)) { seen.add(item.url); unique.push(item); }
      } else {
        unique.push(item);
      }
    }
    timeline = unique.slice(0, 12);
  }

  return (
    <div className="fade-in">
      <div className="subject-card">
        <Image src={`${userData.avatar_url}&s=112`} alt={`${userData.login} avatar`} width={56} height={56} />
        <div>
          <div className="name">{userData.name || userData.login}</div>
          <div className="login"><a href={userData.html_url} target="_blank" rel="noopener noreferrer">@{userData.login}</a></div>
          {userData.bio && <div className="bio">{userData.bio}</div>}
        </div>
      </div>

      <section className="block">
        <h2>Lifetime Pull Requests</h2>
        {prLifetime?.total !== null && (
          <div className="stat-strip" style={{marginBottom: totalEvents === 0 ? '24px' : 0}}>
            <div className="stat-box"><div className="val">{prLifetime.total}</div><div className="lbl">PRs opened, lifetime</div></div>
            <div className="stat-box"><div className="val">{prLifetime.merged}</div><div className="lbl">merged</div></div>
            <div className="stat-box"><div className="val">{mergeRate !== null ? `${mergeRate}%` : 'n/a'}</div><div className="lbl">merge rate</div></div>
          </div>
        )}

        {totalEvents === 0 && (
          <div className="note" style={{marginTop: 0, marginBottom: 0}}>No public events in the last ~90 days. Either they're quiet in public right now, or most of their recent work is on private repos. Lifetime PR numbers above still cover public repos going further back.</div>
        )}
      </section>

      {totalEvents > 0 && (
        <>

          <section className="block">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <h2 style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>Repository Contributions ({RANGE_LABELS[rangeSel]})</h2>
              <select value={rangeSel} onChange={e => setRangeSel(e.target.value)} style={{ padding: '6px 10px', fontSize: '12px' }}>
                <option value="14">Last 2 weeks</option>
                <option value="30">Last month</option>
                <option value="90">Last 3 months</option>
                <option value="180">Last 6 months</option>
                <option value="all">All time</option>
              </select>
            </div>
            {rangeSel === 'all' && (userPRs?.length || 0) >= 500 && (
              <div className="note">Based on the {userPRs.length} most recent PRs the GitHub API returns. Older activity beyond that isn't included.</div>
            )}
            <div className="trail">
              {topPRRepos.map(([repo, stats], i) => {
                const mergeRatePct = Math.round((stats.mergedCount / stats.prCount) * 100);
                const openModal = () => setModalRepo(repo);
                return (
                  <div
                    key={repo}
                    className={`trail-node clickable ${i === 0 ? 'top' : ''}`}
                    onClick={openModal}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); } }}
                    role="button"
                    tabIndex={0}
                    title={`View PRs to ${repo}`}
                  >
                    <div className="row1">
                      <a className="repo" href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>{repo}</a>
                      <span className="count">{stats.prCount} PRs</span>
                    </div>
                    <div className="meta">
                      <span className="badge">{mergeRatePct}% merged</span>
                      <button className="link-btn" onClick={e => { e.stopPropagation(); openModal(); }}>view PRs →</button>
                      <button className="link-btn trace-repo-btn" onClick={e => { e.stopPropagation(); onTrace(repo); }}>view repo analytics →</button>
                    </div>
                  </div>
                );
              })}
              {topPRRepos.length === 0 && <div className="note" style={{marginTop: '10px'}}>No Pull Requests found in this time range.</div>}
            </div>
          </section>

          <section className="block">
            <h2>Activity mix (last ~{totalEvents} public events)</h2>
            {topTypes.map(([type, count]) => {
              const pct = Math.max(4, Math.round((count / maxTypeCount) * 100));
              return (
                <div key={type} className="bar-row">
                  <div className="bar-label">{EVENT_LABELS[type] || type}</div>
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${pct}%` }}></div></div>
                  <div className="bar-val">{count}</div>
                </div>
              );
            })}
          </section>

          <section className="block">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '24px' }}>
              <h2 style={{ marginBottom: 0 }}>Recent trail</h2>
              <a href={`https://github.com/${userData.login}`} className="link-btn" target="_blank" rel="noopener noreferrer">View all on GitHub →</a>
            </div>
            <ul className="timeline">
              {timeline.map((item, i) => (
                <li key={i}>
                  <div className="tl-top">
                    <span>{item.repo} · {EVENT_LABELS[item.type] || item.type}{item.action ? ` · ${item.action}` : ''}</span>
                    <span>{timeAgo(item.date)}</span>
                  </div>
                  <div className="tl-title">
                    {item.url ? <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a> : item.title}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {modalRepo && repoPRs[modalRepo] && (
        <ContributionsModal
          repo={modalRepo}
          login={userData.login}
          prs={repoPRs[modalRepo].prs}
          issues={repoIssues[modalRepo] || []}
          rangeSel={rangeSel}
          onClose={() => setModalRepo(null)}
        />
      )}
    </div>
  );
}
