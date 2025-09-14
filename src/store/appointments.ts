import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Appointment } from '../../types/app';
import { api } from '../lib/constants/fetcher';

interface AppointmentState {
  items: Appointment[];
  load: () => Promise<void>;
  create: (
    payload: Pick<
      Appointment,
      'patientId' | 'clinicianId' | 'date' | 'notes' | 'status' | 'visit_reason'
    >,
  ) => Promise<void>;
  update: (id: string, patch: Partial<Appointment>) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set, get) => ({
      items: [],
      async load() {
        const data = await api<Appointment[]>('/api/appointments');
        set({ items: data });
      },
      async create(payload) {
        const created = await api<Appointment>('/api/appointments', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        set(s => ({ items: [created, ...s.items] }));
      },
      async update(id, patch) {
        const updated = await api<Appointment>(`/api/appointments/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(patch),
        });
        set(s => ({ items: s.items.map(it => (it.id === id ? updated : it)) }));
      },
    }),
    { name: 'cdss-appointments' },
  ),
);
