import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Clinician, Patient, User } from '../../types/app';
import { api } from '../lib/constants/fetcher';

interface UserState {
  users: User[];
  clinicians: Clinician[];
  patients: Patient[];
  loadUsers: () => Promise<void>;
  loadClinicians: () => Promise<void>;
  loadPatients: () => Promise<void>;
}

export const useUsersStore = create<UserState>()(
  persist(
    set => ({
      users: [],
      clinicians: [],
      patients: [],
      async loadUsers() {
        set({ users: await api<User[]>('/api/users') });
      },
      async loadClinicians() {
        set({ clinicians: await api<Clinician[]>('/api/clinicians') });
      },
      async loadPatients() {
        set({ patients: await api<Patient[]>('/api/patients') });
      },
    }),
    { name: 'cdss-users' },
  ),
);
