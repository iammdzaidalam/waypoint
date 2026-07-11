'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import UserResult from './UserResult';
import OrgResult from './OrgResult';
import RepoResult from './RepoResult';
import { HistoryService } from '../lib/services';
import { buildTracePath } from '../lib/utils';

export default function ResultsClient({ data }) {
  const router = useRouter();

  useEffect(() => {
    if (data?.queryParamSaved) {
      HistoryService.addHistory(data.queryParamSaved, data.type);
    }
  }, [data]);

  const onTrace = query => router.push(buildTracePath(query));

  return (
    <div className="results">
      {data.type === 'user' && <UserResult data={data} onTrace={onTrace} />}
      {data.type === 'org' && <OrgResult data={data} onTrace={onTrace} />}
      {data.type === 'repo' && <RepoResult data={data} onTrace={onTrace} />}
    </div>
  );
}
