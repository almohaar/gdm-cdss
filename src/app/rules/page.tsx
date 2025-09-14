'use client';

// import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
// import { RequireAuth } from '../../components/RoleGate';

type Rule = {
  id: string;
  name: string;
  description?: string;
  severity: 'low' | 'moderate' | 'high';
};

export default function RulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [form, setForm] = useState<{
    name: string;
    description?: string;
    severity: Rule['severity'];
  }>({
    name: '',
    description: '',
    severity: 'moderate',
  });

  // const load = () => api.get('/rules').then(r => setRules(r.data));
  // useEffect(() => {
  //   load();
  // }, []);

  return (
    // <RequireAuth roles={['admin']}>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="font-semibold mb-2">Create Rule</h2>
          <div className="grid gap-2">
            <input
              className="border rounded p-2"
              placeholder="Name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <input
              className="border rounded p-2"
              placeholder="Description"
              value={form.description}
              onChange={e =>
                setForm(f => ({ ...f, description: e.target.value }))
              }
            />
            <select
              className="border rounded p-2"
              value={form.severity}
              onChange={e =>
                setForm(f => ({ ...f, severity: e.target.value as any }))
              }
            >
              <option value="low">low</option>
              <option value="moderate">moderate</option>
              <option value="high">high</option>
            </select>
            <button
              className="bg-black text-white rounded p-2"
              // onClick={async () => {
              //   try {
              //     await api.post('/rules', form);
              //     toast.success('Created');
              //     load();
              //   } catch (e: any) {
              //     toast.error(e?.response?.data?.error || 'Failed');
              //   }
              // }}
            >
              Save
            </button>
          </div>
        </div>
        <div className="card">
          <h2 className="font-semibold mb-2">Rules</h2>
          <ul className="space-y-2">
            {rules.map(r => (
              <li
                key={r.id}
                className="border rounded p-2 flex items-center justify-between"
              >
                <div>
                  <b>{r.name}</b> ·{' '}
                  <span className="font-mono">{r.severity}</span>
                  <div className="text-xs">{r.description}</div>
                </div>
                <button
                  className="text-sm underline"
                  // onClick={async () => {
                  //   await api.delete(`/rules/${r.id}`);
                  //   toast.success('Deleted');
                  //   load();
                  // }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    // </RequireAuth>
  );
}
