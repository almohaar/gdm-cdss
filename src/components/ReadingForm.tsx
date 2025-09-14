'use client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTransition, useState } from 'react';
import { TrafficPill } from './TrafficPill';
import { usePatientStore } from '../store/patient';
import { motion } from 'framer-motion';
import { evaluateGlucose } from '../lib/constants/rulesEngine';

//
// ✅ Schema
//
const schema = z.object({
  mmol: z
    .number({ error: 'Glucose must be a number' })
    .min(1)
    .max(30),
  context: z.enum(['fasting', 'postPrandial_1h', 'postPrandial_2h', 'random']),
  notes: z.string().max(240).optional(),
});

type ReadingFormValues = z.infer<typeof schema>;

//
// ✅ Component
//
export function ReadingForm({ patientId }: { patientId: string }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReadingFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { context: 'fasting' },
  });

  const [outcome, setOutcome] = useState<ReturnType<typeof evaluateGlucose>>();
  const [isPending, startTransition] = useTransition();
  const addReading = usePatientStore(s => s.addReading);

  const onSubmit = (data: ReadingFormValues) => {
    const result = evaluateGlucose(data.mmol, data.context);
    setOutcome(result);

    startTransition(async () => {
      await addReading(patientId, {
        id: '',
        patientId,
        glucose_level_mmol: data.mmol,
        timestamp: new Date().toISOString(),
        reading_type: mapCtxToType(data.context),
        notes: data.notes,
        source: 'manual',
        createdAt: '',
        updatedAt: '',
      } as any);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* mmol */}
      <div>
        <Label htmlFor="mmol">Blood glucose (mmol/L)</Label>
        <Input
          id="mmol"
          type="number"
          step="0.1"
          placeholder="e.g. 5.2"
          {...register('mmol', { valueAsNumber: true })} // ✅ ensures number
        />
        {errors.mmol && (
          <p className="text-red-600 text-sm mt-1">{errors.mmol.message}</p>
        )}
      </div>

      {/* context */}
      <div>
        <Label>Context</Label>
        <Select
          defaultValue="fasting"
          onValueChange={v => setValue('context', v as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select context" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="fasting">Fasting</SelectItem>
            <SelectItem value="postPrandial_1h">1 hr after meal</SelectItem>
            <SelectItem value="postPrandial_2h">2 hr after meal</SelectItem>
            <SelectItem value="random">Random</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* notes */}
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" placeholder="Optional notes" {...register('notes')} />
      </div>

      {/* classification */}
      {outcome && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <TrafficPill status={outcome.traffic} label={outcome.message} />
        </motion.div>
      )}

      <Button type="submit" disabled={isPending}>
        Save & Classify
      </Button>
    </form>
  );
}

//
// ✅ Helper
//
function mapCtxToType(
  ctx: 'fasting' | 'postPrandial_1h' | 'postPrandial_2h' | 'random',
) {
  if (ctx === 'fasting') return 'fasting';
  if (ctx === 'postPrandial_1h') return 'postPrandial';
  if (ctx === 'postPrandial_2h') return 'postMeal';
  return 'random';
}
