import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { buildUserAnalysis } from '../lib/utils';
import { CacheService, HistoryService } from '../lib/services';
import { analyzeQuery } from '../lib/analyze';

export function useWaypoint() {
  const [token, setToken] = useState('');
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const repoParam = searchParams.get('repo');
  const userParam = searchParams.get('user');
  const orgParam = searchParams.get('org');
  const qParam = searchParams.get('q');

  useEffect(() => {
    const savedToken = localStorage.getItem('waypoint_token');
    if (savedToken) setToken(savedToken);

    const activeQuery = repoParam || userParam || orgParam || qParam;
    if (activeQuery && activeQuery !== result?.queryParamSaved) {
      if (input !== activeQuery) setInput(activeQuery);
      if (repoParam) doSearch(activeQuery, 'repo');
      else if (orgParam) doSearch(activeQuery, 'org');
      else if (userParam) doSearch(activeQuery, 'user');
      else doSearch(activeQuery); // fallback
    } else if (!activeQuery && result) {
      setResult(null);
      setInput('');
    }
  }, [repoParam, userParam, orgParam, qParam]);

  const doSearch = async (rawInput, forceType) => {
    const query = (rawInput || '').trim().replace(/^@/, '');
    if (!query) return;
    setLoading(true);
    setStatus(`Looking up ${query}...`);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const data = await analyzeQuery(query, forceType, token, setStatus);
      
      setResult(data);
      HistoryService.addHistory(query, data.type);
      
      if (data.type === 'org' && forceType !== 'org') {
        router.replace(`/?org=${query}`);
      } else if (data.type === 'user' && forceType !== 'user') {
        router.replace(`/?user=${query}`);
      }
    } catch (err) {
      let msg = 'Something went wrong. Is the backend running?';
      if (err.message === 'NOT_FOUND') msg = `Couldn't find "${query}" as a user, org, or repo.`;
      if (err.message === 'RATE_LIMIT') msg = 'GitHub API rate limit hit on the backend.';
      if (err.message === 'BAD_REPO_FORMAT') msg = 'For a repo, use the format owner/repo, like jaegertracing/jaeger.';
      setError(msg);
      setStatus('');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  const runTrace = (rawInput) => {
    const query = (rawInput || '').trim().replace(/^@/, '');
    if (!query) {
      router.push('/');
      return;
    }
    if (query.includes('/')) {
      router.push(`/?repo=${query}`);
    } else {
      router.push(`/?user=${query}`);
    }
  };

  return {
    token, setToken,
    input, setInput,
    status, error, loading, result,
    runTrace
  };
}
