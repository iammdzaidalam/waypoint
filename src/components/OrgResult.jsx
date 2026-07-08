import { timeAgo } from '../lib/utils';

export default function OrgResult({ data, onTrace }) {
  const { orgData, activeRepos, keyContributors, members, memberLogins } = data;
  const getRepoName = r => r.full_name || `${orgData.login}/${r.name}`;
  
  const extraMembers = members.filter(m => !keyContributors.some(([login]) => login === m.login));

  return (
    <div className="fade-in">
      <div className="subject-card">
        <img src={`${orgData.avatar_url}&s=112`} alt="" />
        <div>
          <div className="name">{orgData.name || orgData.login}</div>
          <div className="login"><a href={orgData.html_url} target="_blank" rel="noopener noreferrer">@{orgData.login}</a> · organization</div>
          {orgData.description && <div className="bio">{orgData.description}</div>}
        </div>
      </div>

      <section className="block">
        <h2>Where the org is active right now</h2>
        <div className="repo-list">
          {activeRepos.length === 0 && <div className="note">No public repos found.</div>}
          {activeRepos.map(r => (
            <div key={r.id} className="repo-item">
              <div>
                <a className="rname" href={r.html_url} target="_blank" rel="noopener noreferrer">{r.name}</a>
                {r.description && <div className="rdesc">{r.description}</div>}
              </div>
              <div className="rlink">
                <div className="rstats">pushed {timeAgo(r.pushed_at)}<br/>★ {r.stargazers_count} · {r.open_issues_count} open issues</div>
                <button className="link-btn trace-repo-btn" onClick={() => onTrace(getRepoName(r))}>view repo analytics →</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="block">
        <h2>Likely maintainers / key contributors</h2>
        <div className="note">Inferred from top contributors on the org's {Math.min(5, activeRepos.length)} most recently active repos. Not an official role, GitHub doesn't expose team permissions publicly, treat as a strong hint, not certainty.</div>
        <div className="people-grid">
          {keyContributors.map(([login, pdata]) => (
            <div key={login} className="person-card">
              <div className="person-top">
                <img src={`${pdata.avatar}&s=68`} alt="" />
                <div>
                  <div className="person-login">{login}</div>
                  <div className="person-meta">{pdata.total} contributions</div>
                </div>
              </div>
              {memberLogins.has(login) && <span className="person-tag">public member</span>}
              <button className="trace-btn" onClick={() => onTrace(login)}>Trace this person →</button>
            </div>
          ))}
        </div>
      </section>

      {extraMembers.length > 0 && (
        <section className="block">
          <h2>Official Org Members (Potential Mentors/Maintainers)</h2>
          <div className="note">These individuals are officially listed as public members of the organization, making them prime candidates for mentors or maintainers if you are looking to get involved or ask for guidance.</div>
          <div className="people-grid">
            {extraMembers.slice(0, 12).map(m => (
              <div key={m.login} className="person-card">
                <div className="person-top">
                  <img src={`${m.avatar_url}&s=68`} alt="" />
                  <div className="person-login">{m.login}</div>
                </div>
                <button className="trace-btn" onClick={() => onTrace(m.login)}>Trace this person →</button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
