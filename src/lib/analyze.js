import { buildUserAnalysis } from './utils';
import { CacheService } from './services';

const headersFor = (userToken = null) => {
  const h = { 'Accept': 'application/vnd.github+json' };
  if (userToken) {
    h['Authorization'] = `Bearer ${userToken}`;
  }
  return h;
};

const ghFetch = async (url, userToken = null) => {
  const cached = CacheService.get(url);
  if (cached) return cached;
  const res = await fetch(url, { headers: headersFor(userToken) });
  if (!res.ok) {
    if (res.status === 404) throw new Error('NOT_FOUND');
    if (res.status === 403 || res.status === 429) throw new Error('RATE_LIMIT');
    throw new Error(`HTTP_${res.status}`);
  }
  const data = await res.json();
  CacheService.set(url, data, 10);
  return data;
};

export async function analyzeQuery(query, forceType, userToken, setStatus) {
  const fetchGH = (url) => ghFetch(url, userToken);

  if (query.includes('/') || forceType === 'repo') {
    setStatus(`Reading ${query}...`);
    const parts = query.split('/').filter(Boolean);
    if (parts.length !== 2) throw new Error('BAD_REPO_FORMAT');
    const [owner, repo] = parts;
    
    const repoDataPromise = fetchGH(`https://api.github.com/repos/${owner}/${repo}`);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const pullsUrl = page => `https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=100&page=${page}&sort=created&direction=desc`;
    // The /issues endpoint returns both issues and PRs; a single recent page is
    // enough since the UI only shows the latest ~15 alongside the PR list.
    const issuesUrl = `https://api.github.com/repos/${owner}/${repo}/issues?state=all&per_page=100&sort=created&direction=desc`;

    setStatus('Scanning PRs...');
    const [firstBatch, issuesBatch] = await Promise.all([
      fetchGH(pullsUrl(1)).catch(() => []),
      fetchGH(issuesUrl).catch(() => [])
    ]);
    let allPRs = firstBatch || [];
    const allIssues = (issuesBatch || []).filter(i => !i.pull_request);

    // If page 1 is full and still within the window, grab the remaining pages in parallel
    if (allPRs.length === 100 && new Date(allPRs[99].created_at) >= sixMonthsAgo) {
      setStatus('Scanning more PRs...');
      const rest = await Promise.all([2, 3, 4, 5].map(p => fetchGH(pullsUrl(p)).catch(() => [])));
      for (const batch of rest) {
        if (!batch || batch.length === 0) break;
        allPRs = allPRs.concat(batch);
        if (batch.length < 100) break;
        if (new Date(batch[batch.length - 1].created_at) < sixMonthsAgo) break;
      }
    }
    const repoData = await repoDataPromise;
    return { type: 'repo', repoData, allPRs, allIssues, queryParamSaved: `${owner}/${repo}` };
  } else {
    setStatus(`Identifying ${query}...`);
    const userData = await fetchGH(`https://api.github.com/users/${query}`);
    if (userData.type === 'Organization' || forceType === 'org') {
      setStatus(`Mapping ${query} members...`);
      const [members, repos] = await Promise.all([
        fetchGH(`https://api.github.com/orgs/${query}/public_members?per_page=100`).catch(() => []),
        fetchGH(`https://api.github.com/orgs/${query}/repos?per_page=100&sort=pushed&direction=desc`).catch(() => [])
      ]);
      const activeRepos = repos.slice(0, 8);
      const sampleRepos = repos.slice(0, 5);
      
      setStatus(`Sampling activity in top ${sampleRepos.length} repos...`);
      const contributorLists = await Promise.all(
        sampleRepos.map(r => fetchGH(`https://api.github.com/repos/${query}/${r.name}/contributors?per_page=10`).catch(() => []))
      );
      
      const contribMap = {};
      contributorLists.forEach(list => {
        (list || []).forEach(c => {
          if (!c.login) return;
          if (!contribMap[c.login]) contribMap[c.login] = { total: 0, avatar: c.avatar_url };
          contribMap[c.login].total += c.contributions;
        });
      });
      const memberLogins = Array.from(new Set((members || []).map(m => m.login)));
      const keyContributors = Object.entries(contribMap).sort((a, b) => b[1].total - a[1].total).slice(0, 9);
      
      return { type: 'org', orgData: userData, activeRepos, keyContributors, members: members || [], memberLogins, queryParamSaved: query };
    } else {
      const login = query;

      setStatus(`Fetching public trail for ${login}...`);
      const prSearchUrl = page => `https://api.github.com/search/issues?q=author:${login}+type:pr&sort=created&order=desc&per_page=100&page=${page}`;
      // Issues are secondary to PRs (only needed if the contributions modal is opened),
      // so we cap them at one page instead of mirroring the PR pagination - that would
      // double the initial page's network round trips for heavy users.
      const issueSearchUrl = `https://api.github.com/search/issues?q=author:${login}+type:issue&sort=created&order=desc&per_page=100`;

      const eventsPromise = fetchGH(`https://api.github.com/users/${login}/events/public?per_page=100`).catch(() => []);
      // per_page=1 keeps the payload tiny; we only need total_count
      const mergedDataPromise = fetchGH(`https://api.github.com/search/issues?q=author:${login}+type:pr+is:merged&per_page=1`).catch(() => null);
      const firstPagePromise = fetchGH(prSearchUrl(1)).catch(() => null);
      // Fetched in the same batch (not on click) so opening a repo's contributions
      // modal never has to make its own network round trip.
      const issuesPromise = fetchGH(issueSearchUrl).catch(() => null);

      const [events, mergedData, firstPage, issuesPage] = await Promise.all([
        eventsPromise, mergedDataPromise, firstPagePromise, issuesPromise
      ]);

      // Page 1 already carries the lifetime total, so no separate count query needed.
      // Only fetch further pages when the user actually has more than 100 PRs.
      let allPRs = firstPage?.items || [];
      const totalPRs = firstPage ? firstPage.total_count : null;
      if (totalPRs > 100) {
        const maxPage = Math.min(5, Math.ceil(totalPRs / 100));
        const rest = await Promise.all(
          Array.from({ length: maxPage - 1 }, (_, i) => fetchGH(prSearchUrl(i + 2)).catch(() => ({ items: [] })))
        );
        for (const res of rest) {
          if (res && res.items) allPRs = allPRs.concat(res.items);
        }
      }

      const prLifetime = {
        total: totalPRs,
        merged: mergedData ? mergedData.total_count : null
      };
      return { type: 'user', userData, analysis: buildUserAnalysis(events), prLifetime, userPRs: allPRs, userIssues: issuesPage?.items || [], queryParamSaved: login };
    }
  }
}
