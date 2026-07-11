const REVALIDATE_SECONDS = 300;

// Single lightweight object fetch used only for per-page metadata (title/description
// for crawlers and link-preview bots) and an instant first-paint header. The heavy
// data (PRs, issues, contributors) is intentionally NOT fetched here - it loads
// client-side using the visitor's own optional personal token, same as before, so
// GitHub's rate limit is distributed across visitors instead of shared on the server.
export async function ghFetchLight(url) {
  const headers = { 'Accept': 'application/vnd.github+json' };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { headers, next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) {
    if (res.status === 404) throw new Error('NOT_FOUND');
    if (res.status === 403 || res.status === 429) throw new Error('RATE_LIMIT');
    throw new Error(`HTTP_${res.status}`);
  }
  return res.json();
}
