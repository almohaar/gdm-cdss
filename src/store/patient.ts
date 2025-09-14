import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BloodGlucoseReading, Patient } from '../../types/app';
import { api } from '../lib/constants/fetcher';

interface PatientState {
  patients: Patient[];
  readingsByPatient: Record<string, BloodGlucoseReading[]>;
  loadPatients: () => Promise<void>;
  loadReadings: (patientId: string) => Promise<void>;
  addReading: (
    patientId: string,
    payload: Omit<BloodGlucoseReading, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Promise<void>;
}

export const usePatientStore = create<PatientState>()(
  persist(
    (set, get) => ({
      patients: [],
      readingsByPatient: {},
      async loadPatients() {
        const data = await api<Patient[]>('/api/patients');
        set({ patients: data });
      },
      async loadReadings(patientId) {
        const data = await api<BloodGlucoseReading[]>(
          `/api/patients/${patientId}/readings`,
        );
        set(s => ({
          readingsByPatient: { ...s.readingsByPatient, [patientId]: data },
        }));
      },
      async addReading(patientId, payload) {
        const created = await api<BloodGlucoseReading>(
          `/api/patients/${patientId}/readings`,
          { method: 'POST', body: JSON.stringify(payload) },
        );
        set(s => ({
          readingsByPatient: {
            ...s.readingsByPatient,
            [patientId]: [created, ...(s.readingsByPatient[patientId] || [])],
          },
        }));
      },
    }),
    { name: 'cdss-patient' },
  ),
);
