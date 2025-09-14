'use client';

// import { api } from '@/lib/api';
// import { readingCreateSchema } from '@/lib/z';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { BloodGlucoseReading } from '../../../../../types/app';
// import { RequireAuth } from '../../../../components/RoleGate';

// type FormData = z.infer<typeof readingCreateSchema>;

export default function ReadingsTab() {
  const { id: patientId } = useParams<{ id: string }>();
  const [data, setData] = useState<BloodGlucoseReading[]>([]);
  // const {
  //   register,
  //   handleSubmit,
  //   reset,
  //   formState: { errors, isSubmitting },
  // } = useForm<FormData>({
  //   resolver: zodResolver(readingCreateSchema),
  //   defaultValues: {
  //     patientId,
  //     reading_type: 'fasting',
  //     source: 'manual',
  //   } as any,
  // });

  // const load = () =>
  //   api.get(`/readings/${patientId}`).then(r => setData(r.data));

  // useEffect(() => {
  //   load();
  // }, [patientId]);

  const onSubmit = async (fd: FormData) => {
    try {
      // await api.post('/readings', { ...fd, patientId });
      toast.success('Reading added');
      // reset({ patientId, reading_type: 'fasting', source: 'manual' } as any);
      // load();
    } catch (e: any) {
      toast.error(e?.response?.data?.error || 'Failed to add reading');
    }
  };

  return (
    // <RequireAuth roles={['clinician', 'admin']}>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-2">Add Reading</h3>
          <form
          // onSubmit={handleSubmit(onSubmit)}
          className="grid gap-2">
            <input
              placeholder="Glucose (mmol/L)"
              // {...register('glucose_level_mmol')}
              className="border rounded p-2"
            />
            <select
              // {...register('reading_type')}
              className="border rounded p-2"
            >
              <option value="fasting">Fasting</option>
              <option value="postPrandial">Post-prandial</option>
              <option value="preMeal">Pre-meal</option>
              <option value="postMeal">Post-meal</option>
              <option value="random">Random</option>
              <option value="cgm">CGM</option>
            </select>
            <select
            // {...register('source')}
             className="border rounded p-2">
              <option value="manual">Manual</option>
              <option value="cgm">CGM</option>
              <option value="lab">Lab</option>
            </select>
            <input
              placeholder="Timestamp (optional ISO)"
              // {...register('timestamp')}
              className="border rounded p-2"
            />
            <input
              placeholder="Notes"
              // {...register('notes')}
              className="border rounded p-2"
            />
            {/* {(errors as any).glucose_level_mmol && (
              <p className="text-sm text-red-600">Invalid value</p>
            )} */}
            <button
              // disabled={isSubmitting}
              className="bg-black text-white rounded p-2"
            >
              {/* {isSubmitting ? '...' : 'Save'} */}
            </button>
          </form>
        </div>

        <div className="card overflow-auto">
          <h3 className="font-semibold mb-2">Recent Readings</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">When</th>
                <th>Type</th>
                <th>Value</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {data.map(r => (
                <tr key={r.id} className="border-b">
                  <td className="py-2">
                    {new Date(r.timestamp).toLocaleString()}
                  </td>
                  <td>{r.reading_type}</td>
                  <td>{r.glucose_level_mmol} mmol/L</td>
                  <td>{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    // </RequireAuth>
  );
}
