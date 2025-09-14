// =============================================================
// Next.js (App Router) CDSS for GDM — Solid Production Frontend
// Tech: Next.js 15 (app dir), TypeScript, shadcn/ui, lucide-react,
// Zustand (+persist & middleware), react-hook-form + zod,
// framer-motion. Roles: patient | clinician | admin.
// Color system: NICE-aligned targets w/ traffic-light coding.
// =============================================================

// =============================
// file: src/env.ts
// =============================
export const env = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
};

// =============================
// file: src/types/domain.ts
// =============================
export type Role = 'patient' | 'clinician' | 'admin' | 'researcher';

export interface User {
  id: string; name: string; email: string; role: Role; createdAt: string; updatedAt: string;
}

export interface Patient { id: string; userId: string; nhsNumber?: string; dob: string; ethnicity: string; gestationalAgeWeeks: number; prePregnancyBmi: number; pregnancyStartDate: string; createdAt: string; updatedAt: string; user?: User; }

export type BloodGlucoseReadingType = 'fasting' | 'postPrandial' | 'preMeal' | 'postMeal' | 'random' | 'cgm';
export type BloodGlucoseReadingSource = 'manual' | 'cgm' | 'lab';

export interface BloodGlucoseReading {
  id: string; patientId: string; glucose_level_mmol: number; timestamp: string; reading_type: BloodGlucoseReadingType; notes?: string; source: BloodGlucoseReadingSource; createdAt: string; updatedAt: string;
}

export interface Clinician { id: string; userId: string; department: string; hospital: string; licenseNumber: string; createdAt: string; updatedAt: string; user?: User; }

export interface Recommendation { id: string; patientId: string; clinicianId: string; type: string; description: string; status: string; createdAt: string; updatedAt: string; }

export interface Appointment { id: string; patientId: string; clinicianId: string; date: string; notes?: string; status: string; scheduledAt: string; visit_reason: string; createdAt: string; updatedAt: string; }

export type AlertSeverity = 'warning' | 'info' | 'critical';
export interface Alert { id: string; patientId: string; type: string; message: string; is_read: boolean; severity: AlertSeverity; createdAt: string; updatedAt: string; }

export type Severity = 'low' | 'moderate' | 'high';
export type HealthEventType =
  | 'diagnosis' | 'treatment' | 'medication' | 'lifestyle_change' | 'lab_result' | 'cgm_reading'
  | 'alert_triggered' | 'appointment_scheduled' | 'recommendation_made' | 'recommendation_accepted' | 'recommendation_rejected'
  | 'health_check' | 'follow_up' | 'referral' | 'emergency_contact' | 'patient_feedback' | 'clinician_note'
  | 'hospital_admission' | 'hospital_discharge' | 'test_result' | 'medication_change' | 'insulin_start' | 'insulin_stop' | 'insulin_adjustment' | 'diet_change';

export interface HealthEvent { id: string; patientId: string; eventType: HealthEventType; description?: string; timestamp: string; occuredAt: string; createdAt: string; updatedAt: string; }

// =============================
// file: src/lib/colors.ts
// =============================
export const colors = {
  // Traffic-light scheme tuned for accessibility (WCAG AA on white)
  ok: 'hsl(142, 70%, 45%)', // green
  caution: 'hsl(38, 92%, 50%)', // amber
  high: 'hsl(0, 84%, 60%)', // red
  info: 'hsl(221, 83%, 53%)', // blue
  bgSoft: 'hsl(210, 20%, 98%)',
  border: 'hsl(220, 13%, 91%)',
};

export type Traffic = 'ok' | 'caution' | 'high' | 'info';

// =============================
// file: src/lib/guidelines.ts
// (NICE targets + WHO diagnostic thresholds; values used for color coding)
// =============================
export const NICE_TARGETS = {
  fasting_max: 5.3, // mmol/L — aim below this
  pp1h_max: 7.8,    // 1-hour post‑meal target
  pp2h_max: 6.4,    // 2-hour post‑meal target
};

export const WHO_DIAGNOSTIC_OGTT = {
  fasting_dx: 5.1, // ≥ 5.1 mmol/L (diagnosis threshold)
  one_hour_dx: 10.0, // ≥ 10.0 mmol/L
  two_hour_dx: 8.5, // ≥ 8.5 mmol/L
};

export type ReadingContext = 'fasting' | 'postPrandial_1h' | 'postPrandial_2h' | 'random' | 'unknown';

export function classifyReading(mmol: number, ctx: ReadingContext): Traffic {
  if (ctx === 'fasting') return mmol < NICE_TARGETS.fasting_max ? 'ok' : mmol < NICE_TARGETS.fasting_max + 1 ? 'caution' : 'high';
  if (ctx === 'postPrandial_1h') return mmol < NICE_TARGETS.pp1h_max ? 'ok' : mmol < NICE_TARGETS.pp1h_max + 1 ? 'caution' : 'high';
  if (ctx === 'postPrandial_2h') return mmol < NICE_TARGETS.pp2h_max ? 'ok' : mmol < NICE_TARGETS.pp2h_max + 1 ? 'caution' : 'high';
  // random/unknown: be conservative
  return mmol < 7.8 ? 'ok' : mmol < 9.0 ? 'caution' : 'high';
}

export function ogttMeetsWHO(mmolFasting: number, mmol1h: number, mmol2h: number) {
  return (
    mmolFasting >= WHO_DIAGNOSTIC_OGTT.fasting_dx ||
    mmol1h >= WHO_DIAGNOSTIC_OGTT.one_hour_dx ||
    mmol2h >= WHO_DIAGNOSTIC_OGTT.two_hour_dx
  );
}

// =============================
// file: src/lib/rulesEngine.ts
// Lightweight client-side rules to complement backend /api/rules
// =============================
import { ReadingContext, classifyReading } from './guidelines';
import { Traffic } from './colors';

export type RuleOutcome = {
  traffic: Traffic;
  message: string;
  actions: Array<{ label: string; route?: string; kind: 'primary' | 'secondary' | 'destructive' }>;
};

export function evaluateGlucose(mmol: number, ctx: ReadingContext): RuleOutcome {
  const t = classifyReading(mmol, ctx);
  if (t === 'ok') {
    return { traffic: t, message: 'Within NICE target range', actions: [{ label: 'Log reading', kind: 'primary', route: '/readings' }] };
  }
  if (t === 'caution') {
    return { traffic: t, message: 'Slightly above target — reinforce diet/exercise and recheck', actions: [
      { label: 'See education', kind: 'secondary', route: '/education/gdm-basics' },
      { label: 'Schedule call', kind: 'primary', route: '/appointments/new' },
    ] };
  }
  return { traffic: t, message: 'High reading — follow escalation protocol', actions: [
    { label: 'Trigger clinician alert', kind: 'destructive', route: '/alerts/new?type=glycaemia' },
    { label: 'Create recommendation', kind: 'primary', route: '/recommendations/new' },
  ] };
}

// =============================
// file: src/lib/fetcher.ts
// =============================
import { env } from '../env';

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${env.API_URL}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store',
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

// =============================
// file: src/store/middleware.ts
// =============================
import { StateCreator } from 'zustand';

// Simple immer-like updaters and error boundary for stores
export const withSelectors = <S extends object, A extends S>(store: StateCreator<S, [], []>) => store as StateCreator<S>;

// =============================
// file: src/store/auth.ts
// =============================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role, User } from '../types/domain';

interface AuthState {
  user?: User; token?: string; role?: Role;
  setSession: (u: User, token: string) => void;
  clear: () => void;
}

export const useAuth = create<AuthState>()(persist((set) => ({
  user: undefined,
  token: undefined,
  role: undefined,
  setSession: (u, token) => set({ user: u, token, role: u.role }),
  clear: () => set({ user: undefined, token: undefined, role: undefined }),
}), { name: 'cdss-auth' }));

// =============================
// file: src/store/ui.ts
// =============================
import { create } from 'zustand';

interface UIState { sidebarOpen: boolean; setSidebar: (open: boolean) => void; }
export const useUI = create<UIState>((set) => ({ sidebarOpen: true, setSidebar: (open) => set({ sidebarOpen: open }) }));

// =============================
// file: src/store/patient.ts
// =============================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Patient, BloodGlucoseReading } from '../types/domain';
import { api } from '../lib/fetcher';

interface PatientState {
  patients: Patient[];
  readingsByPatient: Record<string, BloodGlucoseReading[]>;
  loadPatients: () => Promise<void>;
  loadReadings: (patientId: string) => Promise<void>;
  addReading: (patientId: string, payload: Omit<BloodGlucoseReading, 'id'|'createdAt'|'updatedAt'>) => Promise<void>;
}

export const usePatientStore = create<PatientState>()(persist((set, get) => ({
  patients: [],
  readingsByPatient: {},
  async loadPatients() {
    const data = await api<Patient[]>('/api/patients');
    set({ patients: data });
  },
  async loadReadings(patientId) {
    const data = await api<BloodGlucoseReading[]>(`/api/patients/${patientId}/readings`);
    set((s) => ({ readingsByPatient: { ...s.readingsByPatient, [patientId]: data } }));
  },
  async addReading(patientId, payload) {
    const created = await api<BloodGlucoseReading>(`/api/patients/${patientId}/readings`, { method: 'POST', body: JSON.stringify(payload) });
    set((s) => ({ readingsByPatient: { ...s.readingsByPatient, [patientId]: [created, ...(s.readingsByPatient[patientId] || [])] } }));
  },
}), { name: 'cdss-patient' }));

// =============================
// file: src/components/RoleGate.tsx
// =============================
'use client';
import { ReactNode } from 'react';
import { useAuth } from '../store/auth';

export default function RoleGate({ allow, children }: { allow: Array<'patient'|'clinician'|'admin'|'researcher'>; children: ReactNode }) {
  const role = useAuth((s) => s.role);
  if (!role || !allow.includes(role)) return null;
  return <>{children}</>;
}

// =============================
// file: src/components/TrafficPill.tsx
// =============================
'use client';
import { colors, Traffic } from '../lib/colors';

export function TrafficPill({ status, label }: { status: Traffic; label?: string }) {
  const bg = { ok: colors.ok, caution: colors.caution, high: colors.high, info: colors.info }[status];
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm" style={{ backgroundColor: bg }}>
      <span className="w-2 h-2 rounded-full bg-white/90" /> {label || status.toUpperCase()}
    </span>
  );
}

// =============================
// file: src/components/ReadingForm.tsx
// =============================
'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransition, useState } from 'react';
import { evaluateGlucose } from '../lib/rulesEngine';
import { TrafficPill } from './TrafficPill';
import { usePatientStore } from '../store/patient';
import { motion } from 'framer-motion';

const schema = z.object({
  mmol: z.coerce.number().min(1).max(30),
  context: z.enum(['fasting','postPrandial_1h','postPrandial_2h','random']),
  notes: z.string().max(240).optional(),
});

export type ReadingFormValues = z.infer<typeof schema>;

export function ReadingForm({ patientId }: { patientId: string }) {
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<ReadingFormValues>({ resolver: zodResolver(schema), defaultValues: { context: 'fasting' } as any });
  const [outcome, setOutcome] = useState<ReturnType<typeof evaluateGlucose>>();
  const [isPending, startTransition] = useTransition();
  const addReading = usePatientStore((s) => s.addReading);

  const onSubmit = (data: ReadingFormValues) => {
    const result = evaluateGlucose(data.mmol, data.context);
    setOutcome(result);
    startTransition(async () => {
      await addReading(patientId, { id: '', patientId, glucose_level_mmol: data.mmol, timestamp: new Date().toISOString(), reading_type: mapCtxToType(data.context), notes: data.notes, source: 'manual', createdAt: '', updatedAt: '' } as any);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="mmol">Blood glucose (mmol/L)</Label>
        <Input id="mmol" type="number" step="0.1" placeholder="e.g. 5.2" {...register('mmol')} />
        {errors.mmol && <p className="text-red-600 text-sm mt-1">{errors.mmol.message}</p>}
      </div>
      <div>
        <Label>Context</Label>
        <Select defaultValue="fasting" onValueChange={(v) => setValue('context', v as any)}>
          <SelectTrigger><SelectValue placeholder="Select context" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="fasting">Fasting</SelectItem>
            <SelectItem value="postPrandial_1h">1 hr after meal</SelectItem>
            <SelectItem value="postPrandial_2h">2 hr after meal</SelectItem>
            <SelectItem value="random">Random</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" placeholder="Optional notes" {...register('notes')} />
      </div>

      {outcome && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
          <TrafficPill status={outcome.traffic} label={outcome.message} />
        </motion.div>
      )}

      <Button type="submit" disabled={isPending}>Save & Classify</Button>
    </form>
  );
}

function mapCtxToType(ctx: 'fasting'|'postPrandial_1h'|'postPrandial_2h'|'random') {
  if (ctx==='fasting') return 'fasting';
  if (ctx==='postPrandial_1h') return 'postPrandial';
  if (ctx==='postPrandial_2h') return 'postMeal';
  return 'random';
}

// =============================
// file: src/components/AlertCard.tsx
// =============================
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BellRing, AlertTriangle, Info } from 'lucide-react';
import { colors } from '../lib/colors';
import { motion } from 'framer-motion';

export function AlertCard({ title, message, level }: { title: string; message: string; level: 'critical'|'warning'|'info' }) {
  const icon = level==='critical'? <AlertTriangle/> : level==='warning'? <BellRing/> : <Info/>;
  const bg = level==='critical'? colors.high : level==='warning'? colors.caution : colors.info;
  return (
    <motion.div initial={{ scale: .98 }} animate={{ scale: 1 }}>
      <Card className="border-0 shadow-md overflow-hidden">
        <div style={{ backgroundColor: bg }} className="px-4 py-2 text-white">
          <div className="flex items-center gap-2">{icon}<span className="font-medium">{title}</span></div>
        </div>
        <CardContent className="p-4 text-sm text-gray-700">{message}</CardContent>
      </Card>
    </motion.div>
  );
}

// =============================
// file: src/app/layout.tsx
// =============================
import './globals.css';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'bg-[hsl(210,20%,98%)] text-gray-900')}>{children}</body>
    </html>
  );
}

// =============================
// file: src/app/(dashboard)/page.tsx
// =============================
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, User as UserIcon, Stethoscope, ShieldCheck } from 'lucide-react';
import RoleGate from '@/components/RoleGate';

export default async function DashboardPage() {
  return (
    <div className="container mx-auto p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><Activity/>Recent Activity</CardTitle></CardHeader><CardContent>Stream of readings, alerts, appointments...</CardContent></Card>
      <RoleGate allow={[ 'patient' ]}>
        <Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><UserIcon/>My GDM</CardTitle></CardHeader><CardContent>
          <div className="space-y-3">
            <p className="text-sm">Quick actions</p>
            <div className="flex gap-2">
              <Button asChild><a href="/readings/new">Log reading</a></Button>
              <Button variant="secondary" asChild><a href="/appointments/new">Book appointment</a></Button>
            </div>
          </div>
        </CardContent></Card>
      </RoleGate>
      <RoleGate allow={[ 'clinician', 'admin' ]}>
        <Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><Stethoscope/>Clinician Tools</CardTitle></CardHeader><CardContent>
          <div className="flex gap-2">
            <Button asChild><a href="/patients">Patients</a></Button>
            <Button variant="secondary" asChild><a href="/rules">Rules</a></Button>
          </div>
        </CardContent></Card>
      </RoleGate>
      <RoleGate allow={[ 'admin' ]}>
        <Card className="shadow-sm"><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck/>Admin</CardTitle></CardHeader><CardContent>
          <div className="flex gap-2">
            <Button asChild><a href="/users">Users</a></Button>
            <Button variant="secondary" asChild><a href="/audit-logs">Audit Logs</a></Button>
          </div>
        </CardContent></Card>
      </RoleGate>
    </div>
  );
}

// =============================
// file: src/app/patients/page.tsx
// =============================
import { api } from '@/lib/fetcher';
import { Patient } from '@/types/domain';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function PatientsPage() {
  const patients = await api<Patient[]>('/api/patients', { cache: 'no-store' } as any);
  return (
    <div className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Patients</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {patients.map((p) => (
          <Card key={p.id}>
            <CardHeader><CardTitle className="text-base">{p.user?.name || p.id}</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">GA: {p.gestationalAgeWeeks} wks</div>
              <Button asChild size="sm"><a href={`/patients/${p.id}`}>Open</a></Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// =============================
// file: src/app/patients/[id]/page.tsx
// =============================
import { api } from '@/lib/fetcher';
import { BloodGlucoseReading, Patient } from '@/types/domain';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReadingForm } from '@/components/ReadingForm';
import { classifyReading } from '@/lib/guidelines';
import { TrafficPill } from '@/components/TrafficPill';

export default async function PatientDetail({ params }: { params: { id: string } }) {
  const patient = await api<Patient>(`/api/patients/${params.id}`, { cache: 'no-store' } as any);
  const readings = await api<BloodGlucoseReading[]>(`/api/patients/${params.id}/readings`, { cache: 'no-store' } as any);
  return (
    <div className="container mx-auto p-6 grid gap-6 md:grid-cols-2">
      <div>
        <h1 className="text-2xl font-semibold">{patient.user?.name || 'Patient'} — GA {patient.gestationalAgeWeeks} weeks</h1>
        <Card className="mt-4"><CardHeader><CardTitle>Log a reading</CardTitle></CardHeader><CardContent>
          <ReadingForm patientId={patient.id} />
        </CardContent></Card>
      </div>
      <div>
        <Card>
          <CardHeader><CardTitle>Recent readings</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {readings.slice(0, 12).map(r => {
                const ctx = r.reading_type === 'fasting' ? 'fasting' : r.reading_type === 'postPrandial' ? 'postPrandial_1h' : r.reading_type === 'postMeal' ? 'postPrandial_2h' : 'random';
                const status = classifyReading(r.glucose_level_mmol, ctx as any);
                return (
                  <li key={r.id} className="flex items-center justify-between p-2 rounded-md border">
                    <div className="text-sm">{new Date(r.timestamp).toLocaleString()} — <span className="font-medium">{r.glucose_level_mmol.toFixed(1)} mmol/L</span></div>
                    <TrafficPill status={status} />
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// =============================
// file: src/app/readings/new/page.tsx
// (Patient self-entry quick page)
// =============================
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReadingForm } from '@/components/ReadingForm';

export default function NewReadingPage() {
  // In a real app, derive patientId from auth user mapping
  const mockPatientId = 'self';
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader><CardTitle>Log blood glucose</CardTitle></CardHeader>
        <CardContent>
          <ReadingForm patientId={mockPatientId} />
        </CardContent>
      </Card>
    </div>
  );
}

// =============================
// file: src/app/rules/page.tsx
// =============================
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NICE_TARGETS, WHO_DIAGNOSTIC_OGTT } from '@/lib/guidelines';

export default function RulesPage() {
  return (
    <div className="container mx-auto p-6 grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>NICE targets (operational)</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc ml-5 text-sm space-y-1">
            <li>Fasting: ≤ {NICE_TARGETS.fasting_max} mmol/L</li>
            <li>1-hour post‑meal: ≤ {NICE_TARGETS.pp1h_max} mmol/L</li>
            <li>2-hour post‑meal: ≤ {NICE_TARGETS.pp2h_max} mmol/L</li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>WHO — 75g OGTT diagnostic cutoffs</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc ml-5 text-sm space-y-1">
            <li>Fasting ≥ {WHO_DIAGNOSTIC_OGTT.fasting_dx} mmol/L</li>
            <li>1-hour ≥ {WHO_DIAGNOSTIC_OGTT.one_hour_dx} mmol/L</li>
            <li>2-hour ≥ {WHO_DIAGNOSTIC_OGTT.two_hour_dx} mmol/L</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================
// file: src/app/globals.css
// =============================
@tailwind base;@tailwind components;@tailwind utilities;

:root{ --radius: 1rem; }

/* Subtle card polish */
.card-gradient{ background: linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.95)); }

// =============================
// file: src/lib/utils.ts
// =============================
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// =============================
// file: src/app/(auth)/login/page.tsx
// =============================
'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/store/auth';

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

type Values = z.infer<typeof schema>;

export default function LoginPage(){
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema) });
  const setSession = useAuth(s => s.setSession);
  const onSubmit = async (data: Values) => {
    // Replace with real API auth call
    setSession({ id: 'u', name: 'Demo User', email: data.email, role: 'clinician', createdAt: '', updatedAt: '' }, 'demo-token');
    window.location.href = '/';
  };
  return (
    <div className="container mx-auto p-6 max-w-md">
      <Card>
        <CardHeader><CardTitle>Sign in</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Input placeholder="Email" {...register('email')} />
            {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
            <Input placeholder="Password" type="password" {...register('password')} />
            {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
            <Button type="submit" className="w-full">Continue</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// =============================
// file: README-SETUP.md
// =============================
# CDSS Frontend (Next.js App Router)

## 1) Install & scaffold
```bash
# create app
pnpm create next-app@latest cdss-frontend --ts --eslint --app --tailwind --src-dir --import-alias @/*
cd cdss-frontend

# ui kit
pnpm add @radix-ui/react-icons lucide-react class-variance-authority clsx tailwind-merge
pnpm add framer-motion zustand zustand/middleware
pnpm add zod react-hook-form @hookform/resolvers

# shadcn/ui
pnpm dlx shadcn@latest init -d
pnpm dlx shadcn@latest add button card input label select

# env
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local
```

## 2) Drop the provided `src/*` files into your project
- Add files from this document into `src/` and pages under `src/app/`.

## 3) Connect to your backend
- Ensure your API base URL is set in `NEXT_PUBLIC_API_URL`.
- Endpoints expected:
  - `GET /api/patients`, `GET /api/patients/:id`, `GET /api/patients/:id/readings`, `POST /api/patients/:id/readings`
  - Add more routes similarly for appointments, alerts, recommendations, rules, audit logs.

## 4) Color‑coding (NICE targets)
- Implemented via `src/lib/guidelines.ts` and `classifyReading()`.
- Traffic‑light mapping: green = within target; amber = slightly raised; red = high (escalate).

## 5) Role‑aware UI
- `RoleGate` component shows features per role (patient/clinician/admin).

## 6) Animations
- Alerts and classification badges animate subtly via framer‑motion.

## 7) Forms & Validation
- `react-hook-form` + `zod` used in ReadingForm & Login.

## 8) State Management (Zustand + persist)
- `auth`, `ui`, and `patient` stores included. Expand with slices for alerts, appointments, rules as needed.

## 9) Hardening & TODOs
- Replace demo auth with real JWT/session integration.
- Add optimistic updates + error toasts.
- Add unit tests for `guidelines.ts` and `rulesEngine.ts`.
- Implement tables with pagination for Admin and Clinician views.
- Add audit trail logs view.

// =============================================================
// EXTENSION: Wire up A–Z sections (Users, Clinicians, Alerts,
// Appointments, Recommendations, Rules CRUD, Audit Logs,
// Health Events) with consistent UI and top‑notch UX.
// =============================================================

// =============================
// file: src/app/providers.tsx
// (shadcn Toaster provider + React Query optional hook-in)
// =============================
'use client';
import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/toaster';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}

// =============================
// UPDATE: src/app/layout.tsx — wrap with Providers
// =============================
// (Replace previous RootLayout with this one)
export const dynamic = 'force-dynamic';
import './globals.css';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import Providers from './providers';

const inter2 = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter2.className, 'bg-[hsl(210,20%,98%)] text-gray-900')}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

// =============================
// file: src/components/DataTable.tsx
// (Generic data table w/ pagination, search, actions)
// =============================
'use client';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type Column<T> = { key: keyof T | string; header: string; render?: (row: T) => React.ReactNode; className?: string };

export default function DataTable<T extends { id: string }>({
  rows,
  columns,
  onRefresh,
  pageSize = 10,
  rightActions,
}: {
  rows: T[];
  columns: Column<T>[];
  onRefresh?: () => void;
  pageSize?: number;
  rightActions?: React.ReactNode;
}) {
  const [q, setQ] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!q) return rows;
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));
  }, [rows, q]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = page * pageSize;
  const current = filtered.slice(start, start + pageSize);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
        {rightActions}
        {onRefresh && <Button variant="secondary" onClick={onRefresh}>Refresh</Button>}
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={String(c.key)} className={c.className}>{c.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {current.map((r) => (
              <TableRow key={r.id}>
                {columns.map((c) => (
                  <TableCell key={String(c.key)} className={c.className}>
                    {c.render ? c.render(r) : (r as any)[c.key as any]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {current.length === 0 && (
              <TableRow><TableCell colSpan={columns.length} className="text-center text-sm text-muted-foreground">No records</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">{filtered.length} records</div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft className="h-4 w-4"/></Button>
          <div className="text-sm">Page {page + 1} / {pages}</div>
          <Button variant="ghost" size="icon" onClick={() => setPage((p) => Math.min(pages - 1, p + 1))} disabled={page >= pages - 1}><ChevronRight className="h-4 w-4"/></Button>
        </div>
      </div>
    </div>
  );
}

// =============================
// file: src/store/alerts.ts
// =============================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Alert } from '@/types/domain';
import { api } from '@/lib/fetcher';

interface AlertState {
  items: Alert[];
  load: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  create: (payload: Pick<Alert, 'patientId'|'type'|'message'|'severity'>) => Promise<void>;
}

export const useAlertStore = create<AlertState>()(persist((set, get) => ({
  items: [],
  async load() {
    const data = await api<Alert[]>('/api/alerts');
    set({ items: data });
  },
  async markRead(id) {
    await api(`/api/alerts/${id}/read`, { method: 'POST' });
    set((s) => ({ items: s.items.map(a => a.id === id ? { ...a, is_read: true } : a) }));
  },
  async create(payload) {
    const created = await api<Alert>('/api/alerts', { method: 'POST', body: JSON.stringify(payload) });
    set((s) => ({ items: [created, ...s.items] }));
  },
}), { name: 'cdss-alerts' }));

// =============================
// file: src/store/appointments.ts
// =============================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Appointment } from '@/types/domain';
import { api } from '@/lib/fetcher';

interface AppointmentState {
  items: Appointment[];
  load: () => Promise<void>;
  create: (payload: Pick<Appointment, 'patientId'|'clinicianId'|'date'|'notes'|'status'|'visit_reason'>) => Promise<void>;
  update: (id: string, patch: Partial<Appointment>) => Promise<void>;
}

export const useAppointmentStore = create<AppointmentState>()(persist((set, get) => ({
  items: [],
  async load() {
    const data = await api<Appointment[]>('/api/appointments');
    set({ items: data });
  },
  async create(payload) {
    const created = await api<Appointment>('/api/appointments', { method: 'POST', body: JSON.stringify(payload) });
    set((s) => ({ items: [created, ...s.items] }));
  },
  async update(id, patch) {
    const updated = await api<Appointment>(`/api/appointments/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
    set((s) => ({ items: s.items.map(it => it.id === id ? updated : it) }));
  },
}), { name: 'cdss-appointments' }));

// =============================
// file: src/store/recommendations.ts
// =============================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Recommendation } from '@/types/domain';
import { api } from '@/lib/fetcher';

interface RecommendationState {
  items: Recommendation[];
  load: () => Promise<void>;
  create: (payload: Pick<Recommendation,'patientId'|'clinicianId'|'type'|'description'|'status'>) => Promise<void>;
}

export const useRecommendationStore = create<RecommendationState>()(persist((set) => ({
  items: [],
  async load() {
    const data = await api<Recommendation[]>('/api/recommendations');
    set({ items: data });
  },
  async create(payload) {
    const created = await api<Recommendation>('/api/recommendations', { method: 'POST', body: JSON.stringify(payload) });
    set((s) => ({ items: [created, ...s.items] }));
  },
}), { name: 'cdss-recommendations' }));

// =============================
// file: src/store/rules.ts
// =============================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/fetcher';

export interface RuleItem { id: string; name: string; description?: string; severity: 'low'|'moderate'|'high'; createdAt: string; updatedAt: string; }

interface RuleState {
  items: RuleItem[];
  load: () => Promise<void>;
  create: (payload: Pick<RuleItem,'name'|'description'|'severity'>) => Promise<void>;
  update: (id: string, patch: Partial<RuleItem>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useRuleStore = create<RuleState>()(persist((set, get) => ({
  items: [],
  async load() { const data = await api<RuleItem[]>('/api/rules'); set({ items: data }); },
  async create(payload) { const created = await api<RuleItem>('/api/rules', { method: 'POST', body: JSON.stringify(payload) }); set((s)=>({ items: [created, ...s.items] })); },
  async update(id, patch) { const updated = await api<RuleItem>(`/api/rules/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }); set((s)=>({ items: s.items.map(it=>it.id===id?updated:it) })); },
  async remove(id) { await api(`/api/rules/${id}`, { method: 'DELETE' }); set((s)=>({ items: s.items.filter(it=>it.id!==id) })); },
}), { name: 'cdss-rules' }));

// =============================
// file: src/store/users.ts
// =============================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Clinician, Patient } from '@/types/domain';
import { api } from '@/lib/fetcher';

interface UserState {
  users: User[]; clinicians: Clinician[]; patients: Patient[];
  loadUsers: () => Promise<void>;
  loadClinicians: () => Promise<void>;
  loadPatients: () => Promise<void>;
}

export const useUsersStore = create<UserState>()(persist((set) => ({
  users: [], clinicians: [], patients: [],
  async loadUsers(){ set({ users: await api<User[]>('/api/users') }); },
  async loadClinicians(){ set({ clinicians: await api<Clinician[]>('/api/clinicians') }); },
  async loadPatients(){ set({ patients: await api<Patient[]>('/api/patients') }); },
}), { name: 'cdss-users' }));

// =============================
// file: src/store/audit.ts
// =============================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/fetcher';

export interface AuditLog { id: string; userId: string; action: string; resource: string; resourceId?: string; details?: string; createdAt: string; updatedAt: string; }

interface AuditState { items: AuditLog[]; load: () => Promise<void>; }

export const useAuditStore = create<AuditState>()(persist((set) => ({
  items: [],
  async load(){ set({ items: await api<AuditLog[]>('/api/audit-logs') }); },
}), { name: 'cdss-audit' }));

// =============================
// COMPONENT: Create/Edit dialogs (RHF + Zod)
// =============================
'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// RuleDialog
export function RuleDialog({ onSubmit, trigger, initial }: { onSubmit: (v: any) => Promise<void>; trigger?: React.ReactNode; initial?: any }){
  const { toast } = useToast();
  const schema = z.object({ name: z.string().min(2), severity: z.enum(['low','moderate','high']), description: z.string().optional() });
  const { register, handleSubmit, setValue } = useForm({ resolver: zodResolver(schema), defaultValues: initial || { severity: 'moderate' } });
  const submit = async (v: any) => { await onSubmit(v); toast({ title: 'Saved' }); };
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger || <Button>New Rule</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{initial? 'Edit rule' : 'New rule'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
          <div><Label>Name</Label><Input {...register('name')} /></div>
          <div><Label>Severity</Label>
            <Select defaultValue={initial?.severity || 'moderate'} onValueChange={(v)=>setValue('severity', v as any)}>
              <SelectTrigger><SelectValue placeholder="Severity"/></SelectTrigger>
              <SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="moderate">Moderate</SelectItem><SelectItem value="high">High</SelectItem></SelectContent>
            </Select>
          </div>
          <div><Label>Description</Label><Textarea {...register('description')} placeholder="Optional"/></div>
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// RecommendationDialog
export function RecommendationDialog({ onSubmit, trigger, initial }: { onSubmit: (v:any)=>Promise<void>; trigger?: React.ReactNode; initial?: any }){
  const { toast } = useToast();
  const schema = z.object({ patientId: z.string(), clinicianId: z.string(), type: z.string().min(2), description: z.string().min(4), status: z.string().default('pending') });
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema), defaultValues: initial || {} });
  const submit = async (v:any)=>{ await onSubmit(v); toast({ title: 'Recommendation saved' }); };
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger || <Button>New Recommendation</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{initial? 'Edit recommendation' : 'New recommendation'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
          <div><Label>Patient ID</Label><Input {...register('patientId')} /></div>
          <div><Label>Clinician ID</Label><Input {...register('clinicianId')} /></div>
          <div><Label>Type</Label><Input {...register('type')} placeholder="diet / metformin / insulin"/></div>
          <div><Label>Description</Label><Textarea {...register('description')} /></div>
          <div><Label>Status</Label><Input {...register('status')} placeholder="pending / accepted / rejected"/></div>
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// AppointmentDialog
export function AppointmentDialog({ onSubmit, trigger, initial }: { onSubmit: (v:any)=>Promise<void>; trigger?: React.ReactNode; initial?: any }){
  const { toast } = useToast();
  const schema = z.object({ patientId: z.string(), clinicianId: z.string(), date: z.string(), notes: z.string().optional(), status: z.string().default('scheduled'), visit_reason: z.string().min(2) });
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema), defaultValues: initial || {} });
  const submit = async (v:any)=>{ await onSubmit(v); toast({ title: 'Appointment saved' }); };
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger || <Button>New Appointment</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>{initial? 'Edit appointment' : 'New appointment'}</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit(submit)} className="space-y-3">
          <div><Label>Patient ID</Label><Input {...register('patientId')} /></div>
          <div><Label>Clinician ID</Label><Input {...register('clinicianId')} /></div>
          <div><Label>Date</Label><Input type="datetime-local" {...register('date')} /></div>
          <div><Label>Visit reason</Label><Input {...register('visit_reason')} /></div>
          <div><Label>Notes</Label><Textarea {...register('notes')} /></div>
          <div><Label>Status</Label><Input {...register('status')} placeholder="scheduled / completed / cancelled"/></div>
          <Button type="submit" className="w-full">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// =============================
// PAGES — Users, Clinicians, Alerts, Appointments, Recommendations, Rules CRUD, Audit Logs, Health Events
// =============================

// file: src/app/users/page.tsx
import DataTable from '@/components/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '
