'use client';

import React from 'react';
import Image from 'next/image';
import { Resolver, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { FileText, Info, Sparkles, Activity } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Toggle } from '@/components/ui/toggle';

import DecisionSupportModal from '@/components/DecisionSupportModal';
import { assessGDM, type GdmAssessmentResult } from '@/lib/validators/risk';
import { GdmFormValues, gdmSchema } from '@/lib/validators/gdm';

// Subtle motion helpers
const fade = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } };

export default function GdmAssessPageRefactor() {
  const { register, handleSubmit, formState, watch, reset } =
    useForm<GdmFormValues>({
      resolver: zodResolver(gdmSchema) as unknown as Resolver<GdmFormValues>,
      defaultValues: {
        age: 30,
        heightCm: 165,
        weightKg: 70,
        gestationalAgeWeeks: undefined,
        fastingGlucose: undefined,
        ogtt1h: undefined,
        ogtt2h: undefined,
        historyGDM: false,
        familyHistoryDM: false,
        ethnicityRisk: 'LOW',
        systolicBP: undefined,
      },
    });

  const [result, setResult] = React.useState<GdmAssessmentResult | null>(null);
  const [open, setOpen] = React.useState(false);
  const [guideline, setGuideline] = React.useState<'WHO' | 'NICE'>('WHO');

  // UI helpers
  const [showLabs, setShowLabs] = React.useState(true);

  const onRun = (data: GdmFormValues) => {
    const input = {
      age: data.age,
      heightCm: data.heightCm,
      weightKg: data.weightKg,
      gestationalAgeWeeks: data.gestationalAgeWeeks ?? undefined,
      fastingGlucose: data.fastingGlucose ?? undefined,
      ogtt1h: data.ogtt1h ?? undefined,
      ogtt2h: data.ogtt2h ?? undefined,
      historyGDM: data.historyGDM,
      familyHistoryDM: data.familyHistoryDM,
      ethnicityRisk: data.ethnicityRisk,
      systolicBP: data.systolicBP ?? undefined,
    };

    const r = assessGDM(input, { guideline });
    setResult(r);
    setOpen(true);
  };

  const doReset = (values?: Partial<GdmFormValues>) => {
    reset(values ?? undefined);
    // close modal and clear previous result
    setOpen(false);
    setResult(null);
  };

  const height = watch('heightCm');
  const weight = watch('weightKg');
  const bmi = React.useMemo(() => {
    if (!height || !weight) return null;
    const val = weight / Math.pow(height / 100, 2);
    return Number.isFinite(val) ? val.toFixed(1) : null;
  }, [height, weight]);

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-slate-50 to-white">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/gdm-hero-2.jpg"
          alt="GDM hero"
          fill
          className="object-cover opacity-10 blur-md"
          priority
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-8 flex items-start gap-6">
          <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/60 flex items-center justify-center border">
            <Sparkles className="w-7 h-7 text-slate-700" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              Quick GDM risk check
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-xl">
              A simple, friendly form for clinicians or patients — enter a few
              values and get an evidence-aligned recommendation. Optional fields
              are tucked away so the form feels short.
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit(onRun)}>
          <motion.div
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Left — essentials */}
            <motion.section variants={fade} className="md:col-span-2">
              <Card className="p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">Patient details</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Essentials only — simple inputs
                    </p>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    <span>Fast & private</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Age</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 32"
                      {...register('age', { valueAsNumber: true })}
                      className="mt-1"
                    />
                    {formState.errors.age && (
                      <p className="text-rose-600 text-sm mt-1">
                        {String(formState.errors.age?.message)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Gestational age (weeks) — optional</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 28"
                      {...register('gestationalAgeWeeks', {
                        valueAsNumber: true,
                      })}
                      className="mt-1"
                    />
                    {formState.errors.gestationalAgeWeeks && (
                      <p className="text-rose-600 text-sm mt-1">
                        {String(formState.errors.gestationalAgeWeeks?.message)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Height (cm)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 165"
                      {...register('heightCm', { valueAsNumber: true })}
                      className="mt-1"
                    />
                    {formState.errors.heightCm && (
                      <p className="text-rose-600 text-sm mt-1">
                        {String(formState.errors.heightCm?.message)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Weight (kg)</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 70"
                      {...register('weightKg', { valueAsNumber: true })}
                      className="mt-1"
                    />
                    {formState.errors.weightKg && (
                      <p className="text-rose-600 text-sm mt-1">
                        {String(formState.errors.weightKg?.message)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="mt-1">
                    <Label>Ethnicity</Label>
                    <Select {...register('ethnicityRisk')}>
                      <option value="LOW">Lower risk</option>
                      <option value="HIGH">Higher risk</option>
                    </Select>
                  </div>

                  <div>
                    <Label>Known history</Label>
                    <div className="flex gap-3 mt-2">
                      <label className="flex items-center gap-2">
                        <Checkbox {...register('historyGDM')} />
                        <span className="text-sm">Previous GDM</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox {...register('familyHistoryDM')} />
                        <span className="text-sm">Family diabetes</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Label>Systolic BP (mmHg) — optional</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 120"
                    {...register('systolicBP', { valueAsNumber: true })}
                    className="mt-1"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-slate-600">BMI</div>
                  <div className="text-lg font-semibold">{bmi ?? '—'}</div>
                </div>
              </Card>

              {/* Labs — collapsible-ish */}
              <motion.div variants={fade} className="mt-4">
                <Card className="p-4 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">
                        Glucose measurements
                      </h3>
                      <p className="text-xs text-slate-500">
                        Only fill if available — values in mmol/L
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Toggle
                        pressed={showLabs}
                        onPressedChange={() => setShowLabs(v => !v)}
                      />
                      <span className="text-xs text-slate-600">Show labs</span>
                    </div>
                  </div>

                  {showLabs && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <Label>Fasting plasma glucose</Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="e.g. 5.3"
                          {...register('fastingGlucose', {
                            valueAsNumber: true,
                          })}
                          className="mt-1"
                        />
                        {formState.errors.fastingGlucose && (
                          <p className="text-rose-600 text-sm mt-1">
                            {String(formState.errors.fastingGlucose?.message)}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label>1-hour OGTT</Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="e.g. 11.2"
                          {...register('ogtt1h', { valueAsNumber: true })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>2-hour OGTT</Label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="e.g. 8.9"
                          {...register('ogtt2h', { valueAsNumber: true })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-2 rounded">
                    WHO (2013): fasting ≥5.1, 1h ≥10.0, 2h ≥8.5. NICE uses
                    different thresholds.
                  </div>
                </Card>
              </motion.div>

              <div className="mt-4 flex gap-2">
                <Button type="submit" size="lg" className="flex-1">
                  Run assessment
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => doReset}
                  className="w-36"
                >
                  Reset
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    const sample: Partial<GdmFormValues> = {
                      age: 32,
                      heightCm: 165,
                      weightKg: 78,
                      gestationalAgeWeeks: 28,
                      fastingGlucose: 5.3,
                      ogtt1h: 11.2,
                      ogtt2h: 8.9,
                      historyGDM: false,
                      familyHistoryDM: true,
                      ethnicityRisk: 'HIGH',
                      systolicBP: 120,
                    };
                    doReset(sample as GdmFormValues);
                  }}
                >
                  Example
                </Button>
              </div>
            </motion.section>

            {/* Right — info card */}
            <motion.aside variants={fade} className="space-y-4">
              <Card className="p-4 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold">Guideline</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Choose thresholds used to interpret labs
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <select
                    value={guideline}
                    onChange={e =>
                      setGuideline(e.target.value as 'WHO' | 'NICE')
                    }
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="WHO">
                      WHO / IADPSG (fasting ≥5.1, 1h ≥10.0, 2h ≥8.5)
                    </option>
                    <option value="NICE">
                      NICE NG3 (fasting ≥5.6 OR 2h ≥7.8)
                    </option>
                  </select>
                </div>

                <div className="mt-4 text-sm">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Calculated BMI</span>
                    <span className="font-semibold">{bmi ?? '—'}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 mt-2">
                    <span>Current GA</span>
                    <span className="font-semibold">
                      {watch('gestationalAgeWeeks') ?? '—'} wks
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">
                  <Button onClick={handleSubmit(onRun)}>Run</Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      window.open(
                        'https://www.nice.org.uk/guidance/ng3',
                        '_blank',
                      )
                    }
                  >
                    Read NICE
                  </Button>
                </div>
              </Card>

              <Card className="p-4 text-xs text-slate-600">
                <div className="font-medium mb-1">Hints for patients</div>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Use one decimal for glucose (e.g. 5.3)</li>
                  <li>Leave optional fields blank if unknown</li>
                  <li>
                    If unsure, ask your clinician to help interpret results
                  </li>
                </ul>
              </Card>
            </motion.aside>
          </motion.div>
        </form>

        <DecisionSupportModal
          open={open}
          result={result}
          onCloseAction={() => setOpen(false)}
        />
      </div>
    </div>
  );
}
