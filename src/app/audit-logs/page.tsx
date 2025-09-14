'use client';

// import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
// import { RequireAuth } from '../../components/RoleGate';

type Log = {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  createdAt: string;
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  // useEffect(() => {
  //   api
  //     .get('/audit-logs')
  //     .then(r => setLogs(r.data))
  //     .catch(e =>
  //       toast.error(e?.response?.data?.error || 'Failed to load logs'),
  //     );
  // }, []);
  return (
    // <RequireAuth roles={['admin']}>
      <div className="card overflow-auto">
        <h1 className="text-xl font-semibold mb-2">Audit Logs</h1>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">When</th>
              <th>User</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} className="border-b">
                <td className="py-2">
                  {new Date(l.createdAt).toLocaleString()}
                </td>
                <td className="font-mono">{l.userId?.slice(0, 8)}…</td>
                <td>{l.action}</td>
                <td>
                  {l.resource}{' '}
                  {l.resourceId ? `(${l.resourceId.slice(0, 6)}…)` : ''}
                </td>
                <td className="truncate max-w-[420px]">{l.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    // </RequireAuth>
  );
}
