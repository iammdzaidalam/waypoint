import { timeAgo } from '../lib/utils';
import { ResultHead, ResultSection, Bento, PersonCell } from './ResultLayout';

export default function OrgResult({ data, onTrace }) {
  const { orgData, activeRepos, keyContributors, members, memberLogins } = data;
  const getRepoName = r => r.full_name || `${orgData.login}/${r.name}`;
  
  const extraMembers = members.filter(m => !keyContributors.some(([login]) => login === m.login));

  return (
    <div className="fade-in">
      <ResultHead
        avatar={`${orgData.avatar_url}&s=112`}
        alt={`${orgData.login} avatar`}
        name={orgData.name || orgData.login}
        meta={<><a className="hover:text-accent" href={orgData.html_url} target="_blank" rel="noopener noreferrer">@{orgData.login}</a> · organization</>}
        bio={orgData.description}
      />

      <ResultSection label="activity" title="Where the org is active right now">
        {activeRepos.length === 0
          ? <p className="text-[13px] text-text-faint">No public repos found.</p>
          : (
            <Bento cols={2}>
              {activeRepos.map(r => (
                <div key={r.id}>
                  <a className="font-mono text-[15px] hover:text-accent" href={r.html_url} target="_blank" rel="noopener noreferrer">{r.name}</a>
                  {r.description && <p className="mt-2 max-w-[46ch] text-[13px] leading-relaxed text-text-faint">{r.description}</p>}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-text-faint">
                    <span>{r.stargazers_count} stars</span>
                    <span>{r.open_issues_count} open issues</span>
                    <span>pushed {timeAgo(r.pushed_at)}</span>
                    <button className="text-accent hover:opacity-70" onClick={() => onTrace(getRepoName(r))}>repo analytics →</button>
                  </div>
                </div>
              ))}
            </Bento>
          )}
      </ResultSection>

      <ResultSection
        label="people"
        title="Likely maintainers"
        note={`Inferred from top contributors on the org's ${Math.min(5, activeRepos.length)} most recently active repos. Not an official role, GitHub doesn't expose team permissions publicly, so treat this as a strong hint rather than certainty.`}
      >
        <Bento cols={3}>
          {keyContributors.map(([login, pdata]) => (
            <PersonCell
              key={login}
              avatar={`${pdata.avatar}&s=112`}
              login={login}
              meta={`${pdata.total} contributions`}
              tag={memberLogins.includes(login) ? 'public member' : null}
              onTrace={onTrace}
            />
          ))}
        </Bento>
      </ResultSection>

      {extraMembers.length > 0 && (
        <ResultSection
          label="org members"
          title="Public members"
          gutter
          note="Listed publicly as members of the organization, which makes them good candidates to ask for guidance if you want to get involved."
        >
          <Bento cols={3}>
            {extraMembers.slice(0, 12).map(m => (
              <PersonCell
                key={m.login}
                avatar={`${m.avatar_url}&s=112`}
                login={m.login}
                onTrace={onTrace}
              />
            ))}
          </Bento>
        </ResultSection>
      )}
    </div>
  );
}

