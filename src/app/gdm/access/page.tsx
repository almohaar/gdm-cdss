// 'use client';

// import React from 'react';
// import Image from 'next/image';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FileText, Info } from 'lucide-react';

// import {
//   gdmAssessmentSchema,
//   type GdmAssessmentInput,
// } from '@/lib/validators/gdm';

// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select } from '@/components/ui/select';
// import { Checkbox } from '@/components/ui/checkbox';

// import DecisionSupportModal from '@/components/DecisionSupportModal';
// import { assessGDM } from '../../../lib/validators/risk';

// const container = {
//   hidden: { opacity: 0 },
//   show: { opacity: 1, transition: { staggerChildren: 0.06 } },
// };
// const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

// export default function GdmAssessPage() {
//   // use the schema type directly
//   // const { register, handleSubmit, formState, watch, reset } =
//   //   useForm<GdmAssessmentInput>({
//   //     resolver: zodResolver(gdmAssessmentSchema),
//   //     defaultValues: {
//   //       age: 18,
//   //       heightCm: 24,
//   //       ethnicityRisk: 'LOW',
//   //       historyGDM: false,
//   //       familyHistoryDM: false,
//   //       ogtt1h: null,
//   //       ogtt2h: null,
//   //       systolicBP: null,
//   //     },
//   //   });

//   const [result, setResult] = React.useState<ReturnType<
//     typeof assessGDM
//   > | null>(null);
//   const [open, setOpen] = React.useState(false);

//   const onSubmit = (data: GdmAssessmentInput) => {
//     const r = assessGDM(data);
//     setResult(r);
//     setOpen(true);
//   };

//   const height = watch('heightCm');
//   const weight = watch('weightKg');
//   const bmi = React.useMemo(() => {
//     if (!height || !weight) return null;
//     const val = weight / Math.pow(height / 100, 2);
//     return Number.isFinite(val) ? val.toFixed(1) : null;
//   }, [height, weight]);

//   return (
//     <div className="min-h-screen relative">
//       {/* Hero background */}
//       <div className="absolute inset-0 -z-10">
//         <Image
//           src="/gdm-hero-2.jpg"
//           alt="GDM hero"
//           fill
//           className="object-cover opacity-40 blur-sm"
//           priority
//         />
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <motion.header
//           initial="hidden"
//           animate="show"
//           variants={container}
//           className="mb-8"
//         >
//           <motion.h1
//             variants={item}
//             className="text-3xl md:text-4xl font-extrabold text-slate-900"
//           >
//             Gestational Diabetes — Risk Assessment
//           </motion.h1>
//           <motion.p variants={item} className="text-slate-600 mt-2 max-w-2xl">
//             Fast, auditable guidance aligned with WHO thresholds. Complete the
//             fields below and get an evidence-aligned decision and recommended
//             next steps.
//           </motion.p>
//         </motion.header>

//         <motion.main
//           initial="hidden"
//           animate="show"
//           variants={container}
//           className="grid grid-cols-1 lg:grid-cols-3 gap-6"
//         >
//           {/* Left column — form inputs */}
//           <motion.section variants={item}>
//             <Card className="p-6 backdrop-blur bg-white/70 border">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold text-slate-900">
//                     Patient details
//                   </h3>
//                   <p className="text-sm text-slate-600 mt-1">
//                     Demographics & history
//                   </p>
//                 </div>
//                 <Info className="text-slate-400" />
//               </div>

//               <div className="mt-5 space-y-4">
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <Label>Age (years)</Label>
//                     <Input
//                       type="number"
//                       {...register('age', { valueAsNumber: true })}
//                       className="mt-1"
//                     />
//                     {formState.errors.age && (
//                       <p className="text-rose-600 text-sm mt-1">
//                         {String(formState.errors.age?.message)}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <Label>Gestational age (weeks)</Label>
//                     <Input
//                       type="number"
//                       {...register('gestationalAgeWeeks', {
//                         valueAsNumber: true,
//                       })}
//                       className="mt-1"
//                     />
//                     {formState.errors.gestationalAgeWeeks && (
//                       <p className="text-rose-600 text-sm mt-1">
//                         {String(formState.errors.gestationalAgeWeeks?.message)}
//                       </p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <Label>Height (cm)</Label>
//                     <Input
//                       type="number"
//                       {...register('heightCm', { valueAsNumber: true })}
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label>Weight (kg)</Label>
//                     <Input
//                       type="number"
//                       {...register('weightKg', { valueAsNumber: true })}
//                       className="mt-1"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3 items-end">
//                   <div>
//                     <Label>Ethnicity risk</Label>
//                     <Select {...register('ethnicityRisk')}>
//                       <option value="LOW">Lower risk</option>
//                       <option value="HIGH">Higher risk</option>
//                     </Select>
//                   </div>

//                   <div>
//                     <Label className="mb-1">History</Label>
//                     <div className="flex gap-3">
//                       <label className="flex items-center gap-2">
//                         <Checkbox {...register('historyGDM')} />
//                         <span className="text-sm">Previous GDM</span>
//                       </label>
//                       <label className="flex items-center gap-2">
//                         <Checkbox {...register('familyHistoryDM')} />
//                         <span className="text-sm">Family DM</span>
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <Label>Systolic BP (mmHg) — optional</Label>
//                   <Input
//                     type="number"
//                     {...register('systolicBP', { valueAsNumber: true })}
//                     className="mt-1"
//                   />
//                 </div>

//                 <div className="mt-2 text-xs text-slate-500">
//                   BMI: <span className="font-medium">{bmi ?? '—'}</span>
//                 </div>
//               </div>
//             </Card>
//           </motion.section>

//           {/* Middle column — labs */}
//           <motion.section variants={item}>
//             <Card className="p-6 backdrop-blur bg-white/75 border">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-lg font-semibold text-slate-900">
//                     Glucose measurements
//                   </h3>
//                   <p className="text-sm text-slate-600 mt-1">
//                     Values in mmol/L (WHO 2013 thresholds used)
//                   </p>
//                 </div>
//                 <FileText className="text-slate-400" />
//               </div>

//               <div className="mt-5 space-y-4">
//                 <div>
//                   <Label>Fasting plasma glucose</Label>
//                   <Input
//                     type="number"
//                     step="0.1"
//                     {...register('fastingGlucose', { valueAsNumber: true })}
//                     className="mt-1"
//                   />
//                   {formState.errors.fastingGlucose && (
//                     <p className="text-rose-600 text-sm mt-1">
//                       {String(formState.errors.fastingGlucose?.message)}
//                     </p>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <Label>1-hour OGTT (optional)</Label>
//                     <Input
//                       type="number"
//                       step="0.1"
//                       {...register('ogtt1h', { valueAsNumber: true })}
//                       className="mt-1"
//                     />
//                   </div>
//                   <div>
//                     <Label>2-hour OGTT (optional)</Label>
//                     <Input
//                       type="number"
//                       step="0.1"
//                       {...register('ogtt2h', { valueAsNumber: true })}
//                       className="mt-1"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-3 rounded-md p-3 bg-slate-50 text-sm text-slate-700 border">
//                   <div className="font-medium">Quick guidance</div>
//                   <div className="mt-1 text-xs text-slate-600">
//                     WHO 2013: FPG ≥5.1, 1-h ≥10.0, 2-h ≥8.5 — any one diagnostic
//                     for GDM.
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           </motion.section>

//           {/* Right column — actions & preview */}
//           <motion.section variants={item}>
//             <Card className="p-6 flex flex-col justify-between h-full backdrop-blur bg-white/80 border">
//               <div>
//                 <h3 className="text-lg font-semibold text-slate-900">
//                   Run assessment
//                 </h3>
//                 <p className="text-sm text-slate-600 mt-1">
//                   Review the inputs and run the decision support engine.
//                 </p>

//                 <div className="mt-4 space-y-3">
//                   <div className="flex items-center justify-between">
//                     <div className="text-sm text-slate-600">Calculated BMI</div>
//                     <div className="font-semibold">{bmi ?? '—'}</div>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="text-sm text-slate-600">Current GA</div>
//                     <div className="font-semibold">
//                       {watch('gestationalAgeWeeks') ?? '—'} wks
//                     </div>
//                   </div>

//                   <div className="pt-2">
//                     {/* <Button
//                       size="lg"
//                       className="w-full"
//                       onClick={handleSubmit(onSubmit)}
//                     >
//                       Run assessment
//                     </Button> */}
//                   </div>

//                   <div className="pt-2">
//                     <Button
//                       variant="ghost"
//                       className="w-full"
//                       onClick={() => reset()}
//                     >
//                       Reset form
//                     </Button>
//                   </div>

//                   <div className="mt-4 text-xs text-slate-500">
//                     Results are advisory. Always combine with clinical judgement
//                     & local protocols.
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-6">
//                 <div className="text-xs text-slate-500 mb-2">Shortcuts</div>
//                 <div className="flex gap-2">
//                   <Button
//                     variant="outline"
//                     onClick={() => {
//                       const sample: GdmAssessmentInput = {
//                         // patientName: 'Jane Doe',
//                         age: 32,
//                         heightCm: 165,
//                         weightKg: 78,
//                         gestationalAgeWeeks: 28,
//                         fastingGlucose: 5.3,
//                         ogtt1h: 11.2,
//                         ogtt2h: 8.9,
//                         historyGDM: false,
//                         familyHistoryDM: true,
//                         ethnicityRisk: 'HIGH',
//                         systolicBP: 120,
//                       };
//                       reset(sample);
//                     }}
//                   >
//                     Use example
//                   </Button>

//                   <Button
//                     variant="ghost"
//                     onClick={() =>
//                       window.open(
//                         'https://www.nice.org.uk/guidance/ng3',
//                         '_blank',
//                       )
//                     }
//                   >
//                     Read NICE guidance
//                   </Button>
//                 </div>
//               </div>
//             </Card>
//           </motion.section>
//         </motion.main>
//       </div>

//       <AnimatePresence>
//         <DecisionSupportModal
//           open={open}
//           result={result}
//           onClose={() => setOpen(false)}
//         />
//       </AnimatePresence>
//     </div>
//   );
// }


export default function GdmAssessPage() {
  return <div>GDM assessment coming soon...</div>;
}
