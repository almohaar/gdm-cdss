'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LoginInput, loginSchema } from '../../../lib/validators/authSchemas';

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await fetch('/api/auth/login', {
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
      alert('Login failed');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
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
        className="relative w-full max-w-md sm:max-w-lg px-4"
      >
        <Card className="bg-white/80 dark:bg-slate-900/70 border border-white/20 shadow-2xl backdrop-blur-xl rounded-2xl">
          <CardHeader className="text-center space-y-4 sm:space-y-6">
            <CardTitle className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-400">
              Sign in to access assessments, dashboards and reports.
            </p>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              {/* Email */}
              <div>
                <Label>Email</Label>
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="johnnydoe@ymail.com"
                  className="mt-2.5"
                />
                {formState.errors.email && (
                  <p className="text-rose-600 text-sm mt-2.5">
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
                  placeholder="********"
                  className="mt-2.5 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 bottom-2.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {formState.errors.password && (
                  <p className="text-rose-600 text-sm mt-2.5">
                    {String(formState.errors.password?.message)}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={formState.isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-90 font-semibold text-lg cursor-pointer transition-all duration-200"
                size="lg"
              >
                {formState.isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>

              <div className="text-center text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3">
                Don’t have an account?{' '}
                <button
                  type="button"
                  onClick={() => router.push('/register')}
                  className="font-semibold ml-1.5 text-indigo-600 cursor-pointer"
                >
                  Register
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
