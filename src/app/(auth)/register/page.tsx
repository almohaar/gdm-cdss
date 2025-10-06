'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Check } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RegisterInput, registerSchema } from '@/lib/validators/authSchemas';
import { createClient } from '../../../lib/supabase/client';
import { toast } from 'sonner';

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState, control, reset, watch } =
    useForm<RegisterInput>({
      resolver: zodResolver(registerSchema),
      defaultValues: { role: 'PATIENT' as const },
    });

  const [showPassword, setShowPassword] = useState(false);
  const [submittingState, setSubmittingState] = useState({
    loading: false,
    success: false,
  });

  const watchedRole = watch('role');

  const onSubmit = async (data: RegisterInput) => {
    setSubmittingState({ loading: true, success: false });
    try {
      const supabase = createClient();

      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        toast.error(error.message || 'Signup error');
        setSubmittingState({ loading: false, success: false });
        return;
      }

      // Insert into profiles
      if (signUpData?.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
          id: signUpData.user.id,
          name: data.name,
          role: data.role,
        });

        if (profileError) {
          console.error(profileError);
          toast.error('Failed to save profile');
          setSubmittingState({ loading: false, success: false });
          return;
        }
      }

      toast.success('Registered successfully — check your email to confirm.');
      setSubmittingState({ loading: false, success: true });

      // Clear form (gentle feedback) and redirect by role
      reset();
      // Note: all roles currently go to /gdm/access — keep here for future role splits
      router.push('/gdm/access');
    } catch (err) {
      console.error(err);
      toast.error('Registration failed — please try again.');
      setSubmittingState({ loading: false, success: false });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#F6D6E0] via-[#FFF6EA] to-[#DCEFF0] px-4 sm:px-6 lg:px-8">
      {/* Soft background illustration (decorative) */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/auth-hero-new.jpg"
          alt="Soft pastel abstract background showing gentle curves"
          fill
          className="object-cover "
          priority
        />
        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/70" /> */}
      </div>

      {/* Animated form container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-xl px-6"
      >
        <Card className="bg-white/95 border border-white/30 shadow-xl backdrop-blur-lg rounded-2xl">
          <CardHeader className="text-center space-y-2 py-6 px-6">
            <CardTitle className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#8FD3C7] via-[#DCCBF6] to-[#F6D6E0] bg-clip-text text-transparent">
              Create an Account
            </CardTitle>
            <p className="text-sm text-slate-700 max-w-prose mx-auto">
              A gentle, guideline-aligned care experience — for patients and
              clinicians.
            </p>
          </CardHeader>

          <CardContent className="px-6 pb-8">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              aria-live="polite"
            >
              {/* Full name */}
              <div>
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Jane Doe"
                  className="mt-1"
                  aria-invalid={!!formState.errors.name}
                  aria-describedby={
                    formState.errors.name ? 'name-error' : undefined
                  }
                />
                {formState.errors.name && (
                  <p
                    id="name-error"
                    className="text-rose-600 text-sm mt-1"
                    role="alert"
                  >
                    {String(formState.errors.name?.message)}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1"
                  aria-invalid={!!formState.errors.email}
                  aria-describedby={
                    formState.errors.email ? 'email-error' : 'email-help'
                  }
                />
                <p id="email-help" className="text-xs text-slate-600 mt-1">
                  We'll never share your email. Used for account sign-in and
                  notifications.
                </p>
                {formState.errors.email && (
                  <p
                    id="email-error"
                    className="text-rose-600 text-sm mt-1"
                    role="alert"
                  >
                    {String(formState.errors.email?.message)}
                  </p>
                )}
              </div>

              {/* Password with toggle */}
              <div className="relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  className="mt-1 pr-10"
                  aria-invalid={!!formState.errors.password}
                  aria-describedby={
                    formState.errors.password
                      ? 'password-error'
                      : 'password-help'
                  }
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 bottom-2.5 text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8FD3C7] rounded"
                >
                  {showPassword ? (
                    <EyeOff size={18} aria-hidden />
                  ) : (
                    <Eye size={18} aria-hidden />
                  )}
                </button>

                <p id="password-help" className="text-xs text-slate-600 mt-1">
                  Use at least 8 characters — mix letters and numbers for
                  safety.
                </p>
                {formState.errors.password && (
                  <p
                    id="password-error"
                    className="text-rose-600 text-sm mt-1"
                    role="alert"
                  >
                    {String(formState.errors.password?.message)}
                  </p>
                )}
              </div>

              {/* Role (Shadcn Select) */}
              <div>
                <Label htmlFor="role">Role</Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          id="role"
                          className="w-full mt-1"
                          aria-label="Select role"
                        >
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PATIENT">Patient</SelectItem>
                          <SelectItem value="CLINICIAN">Clinician</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-600 mt-1">
                        Selecting 'Clinician' or 'Admin' enables professional
                        features.
                      </p>
                      {fieldState.error && (
                        <p className="text-rose-600 text-sm mt-1" role="alert">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />

                {/* contextual hint for patients */}
                {watchedRole === 'PATIENT' && (
                  <div className="mt-2 text-sm text-slate-700 bg-[#FFF6EA] p-3 rounded-lg border">
                    Welcome — as a patient you'll get tailored recommendations
                    and reminders.
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={formState.isSubmitting || submittingState.loading}
                className="w-full rounded-full bg-gradient-to-r from-[#8FD3C7] via-[#DCCBF6] to-[#F6D6E0] hover:opacity-95 transition-all duration-200"
                aria-live="polite"
              >
                {submittingState.loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeOpacity="0.2"
                      ></circle>
                      <path
                        d="M22 12a10 10 0 00-10-10"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                      ></path>
                    </svg>
                    Creating...
                  </span>
                ) : submittingState.success ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check size={16} aria-hidden />
                    Registered
                  </span>
                ) : (
                  'Register'
                )}
              </Button>

              {/* Redirect to login */}
              <div className="text-center text-sm text-slate-700 mt-3">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/login')}
                  className="font-medium text-[#8FD3C7] hover:underline"
                >
                  Sign in
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
