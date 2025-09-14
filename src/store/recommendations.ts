import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Recommendation } from '../../types/app';
import { api } from '../lib/constants/fetcher';

interface RecommendationState {
  items: Recommendation[];
  load: () => Promise<void>;
  create: (
    payload: Pick<
      Recommendation,
      'patientId' | 'clinicianId' | 'type' | 'description' | 'status'
    >,
  ) => Promise<void>;
}

export const useRecommendationStore = create<RecommendationState>()(
  persist(
    set => ({
      items: [],
      async load() {
        const data = await api<Recommendation[]>('/api/recommendations');
        set({ items: data });
      },
      async create(payload) {
        const created = await api<Recommendation>('/api/recommendations', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        set(s => ({ items: [created, ...s.items] }));
      },
    }),
    { name: 'cdss-recommendations' },
  ),
);
