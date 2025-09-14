import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/constants/fetcher';

export interface RuleItem {
  id: string;
  name: string;
  description?: string;
  severity: 'low' | 'moderate' | 'high';
  createdAt: string;
  updatedAt: string;
}

interface RuleState {
  items: RuleItem[];
  load: () => Promise<void>;
  create: (
    payload: Pick<RuleItem, 'name' | 'description' | 'severity'>,
  ) => Promise<void>;
  update: (id: string, patch: Partial<RuleItem>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useRuleStore = create<RuleState>()(
  persist(
    (set, get) => ({
      items: [],
      async load() {
        const data = await api<RuleItem[]>('/api/rules');
        set({ items: data });
      },
      async create(payload) {
        const created = await api<RuleItem>('/api/rules', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        set(s => ({ items: [created, ...s.items] }));
      },
      async update(id, patch) {
        const updated = await api<RuleItem>(`/api/rules/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(patch),
        });
        set(s => ({ items: s.items.map(it => (it.id === id ? updated : it)) }));
      },
      async remove(id) {
        await api(`/api/rules/${id}`, { method: 'DELETE' });
        set(s => ({ items: s.items.filter(it => it.id !== id) }));
      },
    }),
    { name: 'cdss-rules' },
  ),
);
