export type Role = 'patient' | 'clinician' | 'admin' | 'researcher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  userId: string;
  nhsNumber?: string;
  dob: string;
  ethnicity: string;
  gestationalAgeWeeks: number;
  prePregnancyBmi: number;
  pregnancyStartDate: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export type BloodGlucoseReadingType =
  | 'fasting'
  | 'postPrandial'
  | 'preMeal'
  | 'postMeal'
  | 'random'
  | 'cgm';
export type BloodGlucoseReadingSource = 'manual' | 'cgm' | 'lab';

export interface BloodGlucoseReading {
  id: string;
  patientId: string;
  glucose_level_mmol: number;
  timestamp: string;
  reading_type: BloodGlucoseReadingType;
  notes?: string;
  source: BloodGlucoseReadingSource;
  createdAt: string;
  updatedAt: string;
}

export interface Clinician {
  id: string;
  userId: string;
  department: string;
  hospital: string;
  licenseNumber: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Recommendation {
  id: string;
  patientId: string;
  clinicianId: string;
  type: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  clinicianId: string;
  date: string;
  notes?: string;
  status: string;
  scheduledAt: string;
  visit_reason: string;
  createdAt: string;
  updatedAt: string;
}

export type AlertSeverity = 'warning' | 'info' | 'critical';
export interface Alert {
  id: string;
  patientId: string;
  type: string;
  message: string;
  is_read: boolean;
  severity: AlertSeverity;
  createdAt: string;
  updatedAt: string;
}

export type Severity = 'low' | 'moderate' | 'high';
export type HealthEventType =
  | 'diagnosis'
  | 'treatment'
  | 'medication'
  | 'lifestyle_change'
  | 'lab_result'
  | 'cgm_reading'
  | 'alert_triggered'
  | 'appointment_scheduled'
  | 'recommendation_made'
  | 'recommendation_accepted'
  | 'recommendation_rejected'
  | 'health_check'
  | 'follow_up'
  | 'referral'
  | 'emergency_contact'
  | 'patient_feedback'
  | 'clinician_note'
  | 'hospital_admission'
  | 'hospital_discharge'
  | 'test_result'
  | 'medication_change'
  | 'insulin_start'
  | 'insulin_stop'
  | 'insulin_adjustment'
  | 'diet_change';

export interface HealthEvent {
  id: string;
  patientId: string;
  eventType: HealthEventType;
  description?: string;
  timestamp: string;
  occuredAt: string;
  createdAt: string;
  updatedAt: string;
}
