'use client';

// import { api } from '@/lib/api';
// import { patientCreateSchema } from '@/lib/z';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
// import { RequireAuth } from '../../../components/RoleGate';

// type FormData = z.infer<typeof patientCreateSchema>;

export default function NewPatientPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    // resolver: zodResolver(patientCreateSchema),
  });
  const router = useRouter();

  // const onSubmit = async (data: FormData) => {
  //   try {
  //     const res = await api.post('/patients', data);
  //     toast.success('Patient created');
  //     router.push(`/patients/${res.data.id}`);
  //   } catch (e: any) {
  //     toast.error(e?.response?.data?.error || 'Failed to create patient');
  //   }
  // };

  return (
    // <RequireAuth roles={['clinician', 'admin']}>
      <div className="max-w-lg card">
        <h1 className="text-xl font-semibold mb-4">New Patient</h1>
        <form
        // onSubmit={handleSubmit(onSubmit)}
         className="grid gap-3">
          <input
            placeholder="User ID (UUID)"
            // {...register('userId')}
            className="border rounded p-2"
          />
          {/* {errors.userId && (
            <p className="text-sm text-red-600">{errors.userId.message}</p>
          )} */}
          <input
            placeholder="NHS Number (optional)"
            // {...register('nhsNumber')}
            className="border rounded p-2"
          />
          <input
            placeholder="DOB (YYYY-MM-DD)"
            // {...register('dob')}
            className="border rounded p-2"
          />
          <input
            placeholder="Ethnicity"
            // {...register('ethnicity')}
            className="border rounded p-2"
          />
          <input
            placeholder="Gestational Age Weeks"
            // {...register('gestationalAgeWeeks')}
            className="border rounded p-2"
          />
          <input
            placeholder="Pre-pregnancy BMI"
            // {...register('prePregnancyBmi')}
            className="border rounded p-2"
          />
          <input
            placeholder="Pregnancy Start Date (YYYY-MM-DD)"
            // {...register('pregnancyStartDate')}
            className="border rounded p-2"
          />
          <button
            disabled={isSubmitting}
            className="bg-black text-white rounded p-2"
          >
            {isSubmitting ? '...' : 'Create'}
          </button>
        </form>
      </div>
    // </RequireAuth>
  );
}
