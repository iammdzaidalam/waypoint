import { notFound } from 'next/navigation';
import { ghFetchLight } from '../../lib/analyzeServer';
import SearchBar from '../../components/SearchBar';
import LiveResult from '../../components/LiveResult';
import AsciiDissolve from '../../components/AsciiDissolve';

export const revalidate = 300;

async function safeLightFetch(owner) {
  try {
    return { data: await ghFetchLight(`https://api.github.com/users/${owner}`), error: null };
  } catch (e) {
    return { data: null, error: e.message };
  }
}

export async function generateMetadata({ params }) {
  const { owner } = await params;
  const { data: u } = await safeLightFetch(owner);

  if (!u) return { title: owner };

  if (u.type === 'Organization') {
    return {
      title: `${u.name || u.login} activity trace`,
      description: u.description || `Active repositories and key contributors for the ${u.login} GitHub organization.`,
      alternates: { canonical: `/${owner}` },
    };
  }

  const name = u.name || u.login;
  const desc = u.bio
    ? `${u.bio} · GitHub pull request activity, merge rate, and top repositories for @${u.login}.`
    : `GitHub pull request activity, merge rate, and top repositories for @${u.login}.`;
  return {
    title: `${name} (@${u.login}) activity trace`,
    description: desc,
    alternates: { canonical: `/${owner}` },
  };
}

export default async function UserOrOrgPage({ params }) {
  const { owner } = await params;
  const { data, error } = await safeLightFetch(owner);

  if (error === 'NOT_FOUND') notFound();

  return (
    <div className="wrap">
      <AsciiDissolve>
        <SearchBar initialQuery={owner} />
        <LiveResult query={owner} initial={data} />
      </AsciiDissolve>
    </div>
  );
}
