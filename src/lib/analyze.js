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
    let allPRs = [];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    for (let page = 1; page <= 5; page++) {
      setStatus(`Scanning PRs page ${page}...`);
      const batch = await fetchGH(`https://api.github.com/repos/${owner}/${repo}/pulls?state=all&per_page=100&page=${page}&sort=created&direction=desc`).catch(() => []);
      if (!batch || batch.length === 0) break;
      allPRs = allPRs.concat(batch);
      if (batch.length < 100) break;
      const lastDate = new Date(batch[batch.length - 1].created_at);
      if (lastDate < sixMonthsAgo) break;
    }
    const repoData = await repoDataPromise;
    return { type: 'repo', repoData, allPRs, queryParamSaved: `${owner}/${repo}` };
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
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const dateStr = sixMonthsAgo.toISOString().slice(0, 10);
      
      setStatus(`Fetching public trail for ${login}...`);
      const eventsPromise = fetchGH(`https://api.github.com/users/${login}/events/public?per_page=100`).catch(() => []);
      const totalDataPromise = fetchGH(`https://api.github.com/search/issues?q=author:${login}+type:pr`).catch(() => null);
      const mergedDataPromise = fetchGH(`https://api.github.com/search/issues?q=author:${login}+type:pr+is:merged`).catch(() => null);
      
      const prPromises = [];
      for (let page = 1; page <= 5; page++) {
        prPromises.push(
          fetchGH(`https://api.github.com/search/issues?q=author:${login}+type:pr+created:>=${dateStr}&sort=created&order=desc&per_page=100&page=${page}`).catch(() => ({ items: [] }))
        );
      }
      const prResults = await Promise.all(prPromises);
      let allPRs = [];
      for (const res of prResults) {
        if (res && res.items) allPRs = allPRs.concat(res.items);
      }
      
      const [events, totalData, mergedData] = await Promise.all([eventsPromise, totalDataPromise, mergedDataPromise]);
      const prLifetime = {
        total: totalData ? totalData.total_count : null,
        merged: mergedData ? mergedData.total_count : null
      };
      return { type: 'user', userData, analysis: buildUserAnalysis(events), prLifetime, userPRs: allPRs, queryParamSaved: login };
    }
  }
}
