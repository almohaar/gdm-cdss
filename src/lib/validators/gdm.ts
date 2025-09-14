// lib/validators/gdm.ts
import { z } from 'zod';

// mmol/L inputs. Height in cm, weight in kg.
export const gdmAssessmentSchema = z.object({
  age: z.coerce.number().int().min(13).max(60),
  heightCm: z.coerce.number().min(120).max(220),
  weightKg: z.coerce.number().min(30).max(200),
  gestationalAgeWeeks: z.coerce.number().min(4).max(42),
  fastingGlucose: z.coerce.number().min(3).max(15), // mmol/L
  ogtt1h: z.coerce.number().min(0).max(20).optional().nullable(),
  ogtt2h: z.coerce.number().min(0).max(20).optional().nullable(),
  historyGDM: z.boolean().default(false),
  familyHistoryDM: z.boolean().default(false),
  ethnicityRisk: z.enum(['LOW', 'HIGH']).default('LOW'), // You can expand options later
  systolicBP: z.coerce.number().min(70).max(220).optional().nullable(),
});

export type GdmAssessmentInput = z.infer<typeof gdmAssessmentSchema>;
