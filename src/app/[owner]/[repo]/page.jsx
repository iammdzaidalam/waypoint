import { notFound } from 'next/navigation';
import { ghFetchLight } from '../../../lib/analyzeServer';
import SearchBar from '../../../components/SearchBar';
import LiveResult from '../../../components/LiveResult';
import AsciiDissolve from '../../../components/AsciiDissolve';

export const revalidate = 300;

async function safeLightFetch(owner, repo) {
  try {
    return { data: await ghFetchLight(`https://api.github.com/repos/${owner}/${repo}`), error: null };
  } catch (e) {
    return { data: null, error: e.message };
  }
}

export async function generateMetadata({ params }) {
  const { owner, repo } = await params;
  const { data: r } = await safeLightFetch(owner, repo);
  const fullName = `${owner}/${repo}`;

  if (!r) return { title: fullName };

  return {
    title: `${fullName} pull request analytics`,
    description: r.description
      ? `${r.description} · Merge rates, review speed, and top contributors for ${fullName}.`
      : `Merge rates, review speed, and top contributors for ${fullName} on GitHub.`,
    alternates: { canonical: `/${fullName}` },
  };
}

export default async function RepoPage({ params }) {
  const { owner, repo } = await params;
  const { data, error } = await safeLightFetch(owner, repo);
  const fullName = `${owner}/${repo}`;

  if (error === 'NOT_FOUND') notFound();

  return (
    <div className="wrap">
      <AsciiDissolve>
        <SearchBar initialQuery={fullName} />
        <LiveResult query={fullName} forceType="repo" initial={data} />
      </AsciiDissolve>
    </div>
  );
}
