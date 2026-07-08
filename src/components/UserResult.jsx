import { EVENT_LABELS, timeAgo } from '../lib/utils';

export default function UserResult({ data, onTrace }) {
  const { userData, analysis, prLifetime, userPRs } = data;
  const { topRepos, topTypes, timeline, totalEvents } = analysis;
  const maxTypeCount = topTypes.length ? topTypes[0][1] : 1;
  const mergeRate = prLifetime?.total > 0 ? Math.round((prLifetime.merged / prLifetime.total) * 100) : null;

  const repoPRs = {};
  if (userPRs) {
    userPRs.forEach(pr => {
      const repoName = pr.repository_url.split('/').slice(-2).join('/');
      if (!repoPRs[repoName]) repoPRs[repoName] = { prCount: 0, mergedCount: 0 };
      repoPRs[repoName].prCount++;
      if (pr.pull_request?.merged_at) repoPRs[repoName].mergedCount++;
    });
  }
  const topPRRepos = Object.entries(repoPRs).sort((a, b) => b[1].prCount - a[1].prCount);

  return (
    <div className="fade-in">
      <div className="subject-card">
        <img src={`${userData.avatar_url}&s=112`} alt="" />
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
            <div className="stat-box"><div className="val">{mergeRate !== null ? `${mergeRate}%` : '—'}</div><div className="lbl">merge rate</div></div>
          </div>
        )}

        {totalEvents === 0 && (
          <div className="note" style={{marginTop: 0, marginBottom: 0}}>No public events in the last ~90 days. Either they're quiet in public right now, or most of their recent work is on private repos. Lifetime PR numbers above still cover public repos going further back.</div>
        )}
      </section>

      {totalEvents > 0 && (
        <>

          <section className="block">
            <h2>Repository Contributions (last 6 months)</h2>
            <div className="trail">
              {topPRRepos.map(([repo, stats], i) => {
                const mergeRatePct = Math.round((stats.mergedCount / stats.prCount) * 100);
                return (
                  <div key={repo} className={`trail-node ${i === 0 ? 'top' : ''}`}>
                    <div className="row1">
                      <a className="repo" href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer">{repo}</a>
                      <span className="count">{stats.prCount} PRs</span>
                    </div>
                    <div className="meta">
                      <span className="badge">{mergeRatePct}% merged</span>
                      <button className="link-btn trace-repo-btn" onClick={() => onTrace(repo)}>view repo analytics →</button>
                    </div>
                  </div>
                );
              })}
              {topPRRepos.length === 0 && <div className="note" style={{marginTop: '10px'}}>No Pull Requests found in the last 6 months.</div>}
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
    </div>
  );
}
