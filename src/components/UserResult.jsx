import { useState } from 'react';
import { EVENT_LABELS, timeAgo, filterPRs } from '../lib/utils';
import ContributionsModal from './ContributionsModal';
import { ResultHead, ResultSection, Bento, StatCell, RowList, Row } from './ResultLayout';

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
      <ResultHead
        avatar={`${userData.avatar_url}&s=112`}
        alt={`${userData.login} avatar`}
        name={userData.name || userData.login}
        meta={<a className="hover:text-accent" href={userData.html_url} target="_blank" rel="noopener noreferrer">@{userData.login}</a>}
        bio={userData.bio}
      />

      {prLifetime?.total !== null && (
        <ResultSection
          label="pull requests"
          title="Lifetime pull requests"
          note={totalEvents === 0 ? "No public events in the last ~90 days. Either they're quiet in public right now, or most of their recent work is on private repos. The lifetime numbers below still cover public repos going further back." : null}
        >
          <Bento cols={3}>
            <StatCell value={prLifetime.total} label="PRs opened, lifetime" />
            <StatCell value={prLifetime.merged} label="merged" />
            <StatCell value={mergeRate !== null ? `${mergeRate}%` : 'n/a'} label="merge rate" />
          </Bento>
        </ResultSection>
      )}

      {totalEvents > 0 && (
        <>
          <ResultSection
            label="contributions"
            title={`Repositories, ${RANGE_LABELS[rangeSel]}`}
            note={rangeSel === 'all' && (userPRs?.length || 0) >= 500
              ? `Based on the ${userPRs.length} most recent PRs the GitHub API returns. Older activity beyond that isn't included.`
              : null}
            control={
              <select value={rangeSel} onChange={e => setRangeSel(e.target.value)} className="font-mono text-xs">
                <option value="14">Last 2 weeks</option>
                <option value="30">Last month</option>
                <option value="90">Last 3 months</option>
                <option value="180">Last 6 months</option>
                <option value="all">All time</option>
              </select>
            }
          >
            {topPRRepos.length === 0
              ? <p className="text-[13px] text-text-faint">No pull requests found in this time range.</p>
              : (
                <Bento cols={2}>
                  {topPRRepos.map(([repo, stats]) => {
                    const mergeRatePct = Math.round((stats.mergedCount / stats.prCount) * 100);
                    const openModal = () => setModalRepo(repo);
                    return (
                      <div
                        key={repo}
                        className="group cursor-pointer"
                        onClick={openModal}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(); } }}
                        role="button"
                        tabIndex={0}
                        title={`View PRs to ${repo}`}
                      >
                        <div className="flex items-baseline justify-between gap-3">
                          <a
                            className="font-mono text-[15px] group-hover:text-accent"
                            href={`https://github.com/${repo}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                          >{repo}</a>
                          <span className="shrink-0 font-mono text-xs text-text-faint">{stats.prCount} PRs</span>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-text-faint">
                          <span>{mergeRatePct}% merged</span>
                          <button className="text-accent hover:opacity-70" onClick={e => { e.stopPropagation(); openModal(); }}>view PRs →</button>
                          <button className="text-accent hover:opacity-70" onClick={e => { e.stopPropagation(); onTrace(repo); }}>repo analytics →</button>
                        </div>
                      </div>
                    );
                  })}
                </Bento>
              )}
          </ResultSection>

          <ResultSection label="activity mix" title={`Last ~${totalEvents} public events`}>
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
          </ResultSection>

          <ResultSection
            label="recent trail"
            title="Latest public activity"
            gutter
            control={
              <a href={`https://github.com/${userData.login}`} className="font-mono text-xs text-accent hover:opacity-70" target="_blank" rel="noopener noreferrer">View all on GitHub →</a>
            }
          >
            <RowList>
              {timeline.map((item, i) => (
                <Row
                  key={i}
                  lead={<span className="truncate">{item.repo} · {EVENT_LABELS[item.type] || item.type}{item.action ? ` · ${item.action}` : ''}</span>}
                  when={timeAgo(item.date)}
                  title={item.url
                    ? <a href={item.url} target="_blank" rel="noopener noreferrer">{item.title}</a>
                    : item.title}
                />
              ))}
            </RowList>
          </ResultSection>
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
