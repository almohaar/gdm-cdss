import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/constants/fetcher';

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuditState {
  items: AuditLog[];
  load: () => Promise<void>;
}

export const useAuditStore = create<AuditState>()(
  persist(
    set => ({
      items: [],
      async load() {
        set({ items: await api<AuditLog[]>('/api/audit-logs') });
      },
    }),
    { name: 'cdss-audit' },
  ),
);
