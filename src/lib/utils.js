export function buildTracePath(rawQuery) {
  const trimmed = (rawQuery || '').trim().replace(/^@/, '').replace(/\/+$/, '');
  if (!trimmed) return '/';
  return '/' + trimmed.split('/').filter(Boolean).map(encodeURIComponent).join('/');
}

export const EVENT_LABELS = {
  PushEvent: 'commit',
  IssuesEvent: 'issue',
  IssueCommentEvent: 'comment',
  PullRequestEvent: 'pull request',
  PullRequestReviewEvent: 'review',
  PullRequestReviewCommentEvent: 'review comment',
  CreateEvent: 'create',
  ForkEvent: 'fork',
  WatchEvent: 'star',
  ReleaseEvent: 'release',
  DeleteEvent: 'delete',
  CommitCommentEvent: 'commit comment',
  GollumEvent: 'wiki edit',
  PublicEvent: 'made public',
  MemberEvent: 'member change'
};

export function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return mins + 'm ago';
  const hours = Math.floor(mins / 60);
  if (hours < 24) return hours + 'h ago';
  const days = Math.floor(hours / 24);
  if (days < 30) return days + 'd ago';
  const months = Math.floor(days / 30);
  return months + 'mo ago';
}

export function eventToTimelineItem(ev) {
  const repo = ev.repo.name;
  const date = ev.created_at;
  const type = ev.type;
  let title = null, url = null, action = ev.payload.action || '';

  if (type === 'IssuesEvent' && ev.payload.issue) {
    title = ev.payload.issue.title; url = ev.payload.issue.html_url;
  } else if (type === 'PullRequestEvent' && ev.payload.pull_request) {
    title = ev.payload.pull_request.title; url = ev.payload.pull_request.html_url;
  } else if (type === 'IssueCommentEvent' && ev.payload.issue) {
    title = ev.payload.issue.title; url = ev.payload.comment ? ev.payload.comment.html_url : ev.payload.issue.html_url;
  } else if (type === 'PullRequestReviewEvent' && ev.payload.pull_request) {
    title = ev.payload.pull_request.title; url = ev.payload.review ? ev.payload.review.html_url : ev.payload.pull_request.html_url;
  } else if (type === 'PullRequestReviewCommentEvent' && ev.payload.pull_request) {
    title = ev.payload.pull_request.title; url = ev.payload.comment ? ev.payload.comment.html_url : ev.payload.pull_request.html_url;
  } else if (type === 'PushEvent' && ev.payload.commits && ev.payload.commits.length) {
    const last = ev.payload.commits[ev.payload.commits.length - 1];
    title = last.message.split('\n')[0].slice(0, 90);
    url = 'https://github.com/' + repo + '/commit/' + last.sha;
    action = ev.payload.commits.length > 1 ? (ev.payload.commits.length + ' commits') : '1 commit';
  } else if (type === 'CreateEvent') {
    title = (ev.payload.ref_type || 'repo') + (ev.payload.ref ? ' ' + ev.payload.ref : '');
    url = 'https://github.com/' + repo;
  } else if (type === 'ReleaseEvent' && ev.payload.release) {
    title = ev.payload.release.name || ev.payload.release.tag_name;
    url = ev.payload.release.html_url;
  }

  return { repo, date, type, title, url, action };
}

export function buildUserAnalysis(events) {
  const repoStats = {};
  const typeCounts = {};
  const timeline = [];

  for (const ev of events) {
    const repo = ev.repo.name;
    if (!repoStats[repo]) repoStats[repo] = { count: 0, lastDate: ev.created_at, types: {} };
    repoStats[repo].count++;
    if (new Date(ev.created_at) > new Date(repoStats[repo].lastDate)) repoStats[repo].lastDate = ev.created_at;
    repoStats[repo].types[ev.type] = (repoStats[repo].types[ev.type] || 0) + 1;
    typeCounts[ev.type] = (typeCounts[ev.type] || 0) + 1;
    const item = eventToTimelineItem(ev);
    if (item.title) timeline.push(item);
  }

  const topRepos = Object.entries(repoStats).sort((a, b) => b[1].count - a[1].count).slice(0, 8);
  const topTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]).slice(0, 7);

  return { topRepos, topTypes, timeline: timeline.slice(0, 12), totalEvents: events.length };
}


export function filterPRs(prs, days, branch) {
  let filtered = prs;
  if (days !== 'all') {
    const cutoff = Date.now() - Number(days) * 86400000;
    filtered = filtered.filter(p => new Date(p.created_at).getTime() >= cutoff);
  }
  if (branch !== 'all') {
    filtered = filtered.filter(p => p.base && p.base.ref === branch);
  }
  return filtered;
}

export function bucketPRsByTime(prs) {
  if (!prs.length) return { granularity: 'week', buckets: [] };
  const dates = prs.map(p => new Date(p.created_at).getTime());
  const min = Math.min(...dates), max = Math.max(...dates);
  const rangeDays = (max - min) / 86400000;
  const granularity = rangeDays > 200 ? 'month' : 'week';
  
  const bucketsMap = new Map();
  let current = new Date(min);
  const end = new Date(max);
  
  while (current <= end) {
    let key, label;
    if (granularity === 'month') {
      key = current.getFullYear() + '-' + String(current.getMonth()).padStart(2, '0');
      label = current.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
      bucketsMap.set(key, { label, count: 0 });
      current.setMonth(current.getMonth() + 1);
    } else {
      const day = current.getDay();
      const diff = (day === 0 ? -6 : 1) - day;
      const monday = new Date(current);
      monday.setDate(current.getDate() + diff);
      key = monday.toISOString().slice(0, 10);
      label = monday.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      bucketsMap.set(key, { label, count: 0 });
      current.setDate(current.getDate() + 7);
    }
  }

  prs.forEach(p => {
    const d = new Date(p.created_at);
    let key;
    if (granularity === 'month') {
      key = d.getFullYear() + '-' + String(d.getMonth()).padStart(2, '0');
    } else {
      const day = d.getDay();
      const diff = (day === 0 ? -6 : 1) - day;
      const monday = new Date(d);
      monday.setDate(d.getDate() + diff);
      key = monday.toISOString().slice(0, 10);
    }
    if (bucketsMap.has(key)) {
      bucketsMap.get(key).count++;
    }
  });

  return { granularity, buckets: Array.from(bucketsMap.values()) };
}
