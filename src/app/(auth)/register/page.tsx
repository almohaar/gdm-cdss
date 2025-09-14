'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
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

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState, control } = useForm<RegisterInput>(
    {
      resolver: zodResolver(registerSchema),
      defaultValues: { role: 'PATIENT' as const },
    },
  );

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: RegisterInput) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error ?? JSON.stringify(json));
        return;
      }
      if (json.token) localStorage.setItem('token', json.token);

      const role = json.user?.role ?? 'PATIENT';
      if (role === 'CLINICIAN') router.push('/dashboard/clinician');
      else if (role === 'ADMIN') router.push('/dashboard/admin');
      else router.push('/dashboard/patient');
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4 sm:px-6 lg:px-8">
      {/* Background overlay */}
      <div className="absolute inset-0">
              <Image
                src="/auth-hero.webp"
                alt="Background"
                fill
                className="object-cover filter blur-sm brightness-75"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80" />
            </div>

      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-xl px-6"
      >
        <Card className="bg-white/90 dark:bg-slate-900/80 border border-white/20 shadow-2xl backdrop-blur-xl rounded-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Create an Account
            </CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Secure, auditable and guideline-aligned support for clinicians and
              patients.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full name */}
              <div>
                <Label>Full name</Label>
                <Input
                  {...register('name')}
                  placeholder="Jane Doe"
                  className="mt-1"
                />
                {formState.errors.name && (
                  <p className="text-rose-600 text-sm mt-1">
                    {String(formState.errors.name?.message)}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1"
                />
                {formState.errors.email && (
                  <p className="text-rose-600 text-sm mt-1">
                    {String(formState.errors.email?.message)}
                  </p>
                )}
              </div>

              {/* Password with toggle */}
              <div className="relative">
                <Label>Password</Label>
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="mt-1 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 bottom-2.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {formState.errors.password && (
                  <p className="text-rose-600 text-sm mt-1">
                    {String(formState.errors.password?.message)}
                  </p>
                )}
              </div>

              {/* Role (Shadcn Select) */}
              <div>
                <Label>Role</Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PATIENT">Patient</SelectItem>
                          <SelectItem value="CLINICIAN">Clinician</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldState.error && (
                        <p className="text-rose-600 text-sm mt-1">
                          {fieldState.error.message}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={formState.isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-90 transition-all duration-200"
              >
                {formState.isSubmitting ? 'Creating...' : 'Register'}
              </Button>

              {/* Redirect to login */}
              <div className="text-center text-sm text-slate-600 dark:text-slate-400 mt-3">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/auth/login')}
                  className="font-medium text-indigo-600 hover:underline"
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
