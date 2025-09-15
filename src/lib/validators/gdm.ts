// lib/validators/gdm.ts
import { z } from 'zod';

/**
 * Coerce input (string | number | undefined) into a number or undefined.
 */
const coerceToNumber = (val: unknown): number | undefined => {
  if (val === '' || val === null || val === undefined) return undefined;
  if (typeof val === 'number') return Number.isNaN(val) ? undefined : val;
  if (typeof val === 'string') {
    const cleaned = val.replace(',', '.').trim();
    const n = Number(cleaned);
    return Number.isNaN(n) ? undefined : n;
  }
  return undefined;
};

export const gdmSchema = z.object({
  age: z.preprocess(
    coerceToNumber,
    z.number().int().min(15, 'Age too low').max(55, 'Age too high'),
  ),
  heightCm: z.preprocess(
    coerceToNumber,
    z
      .number()
      .int()
      .min(100, 'Height unrealistic')
      .max(250, 'Height unrealistic'),
  ),
  weightKg: z.preprocess(
    coerceToNumber,
    z.number().min(30, 'Weight too low').max(200, 'Weight too high'),
  ),

  // optional pregnancy-related
  gestationalAgeWeeks: z.preprocess(
    coerceToNumber,
    z.number().int().min(1, 'Invalid GA').max(42, 'Beyond term').optional(),
  ),

  // optional glucose
  fastingGlucose: z.preprocess(
    coerceToNumber,
    z.number().min(0, 'Invalid value').max(30, 'Unrealistic value').optional(),
  ),
  ogtt1h: z.preprocess(coerceToNumber, z.number().min(0).max(50).optional()),
  ogtt2h: z.preprocess(coerceToNumber, z.number().min(0).max(50).optional()),

  historyGDM: z.boolean(),
  familyHistoryDM: z.boolean(),
  ethnicityRisk: z.enum(['LOW', 'HIGH']),

  systolicBP: z.preprocess(
    coerceToNumber,
    z.number().min(50).max(250).optional(),
  ),
});

export type GdmFormValues = z.infer<typeof gdmSchema>;
