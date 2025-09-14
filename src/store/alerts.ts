import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Alert } from '../../types/app';
import { api } from '../lib/constants/fetcher';

interface AlertState {
  items: Alert[];
  load: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  create: (
    payload: Pick<Alert, 'patientId' | 'type' | 'message' | 'severity'>,
  ) => Promise<void>;
}

export const useAlertStore = create<AlertState>()(
  persist(
    (set, get) => ({
      items: [],
      async load() {
        const data = await api<Alert[]>('/api/alerts');
        set({ items: data });
      },
      async markRead(id) {
        await api(`/api/alerts/${id}/read`, { method: 'POST' });
        set(s => ({
          items: s.items.map(a => (a.id === id ? { ...a, is_read: true } : a)),
        }));
      },
      async create(payload) {
        const created = await api<Alert>('/api/alerts', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        set(s => ({ items: [created, ...s.items] }));
      },
    }),
    { name: 'cdss-alerts' },
  ),
);
