'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { LoginInput, loginSchema } from '../../../lib/validators/authSchemas';
import { toast } from 'sonner';
import { createClient } from '../../../lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState, reset } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: loginData, error } = await supabase.auth.signInWithPassword(
        {
          email: data.email,
          password: data.password,
        },
      );

      if (error) {
        toast.error(error.message || 'Login error');
        setLoading(false);
        return;
      }

      const role = loginData.user?.user_metadata?.role ?? 'PATIENT';

      toast.success('Welcome back — signing you in');
      setSuccess(true);
      setLoading(false);
      reset();

      // route to main area; keep split for future role-specific routes
      router.push('/gdm/access');
    } catch (err) {
      console.error(err);
      toast.error('Login failed — please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#F6D6E0] via-[#FFF6EA] to-[#DCEFF0] px-4 sm:px-6 lg:px-8">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/auth-hero-new-2.jpg"
          alt="Soft pastel abstract background"
          fill
          className="object-cover"
          priority
        />
        {/* <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/70" /> */}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md sm:max-w-lg px-4"
      >
        <Card className="bg-white/95 border border-white/30 shadow-xl backdrop-blur-lg rounded-2xl">
          <CardHeader className="text-center space-y-3 py-6 px-6">
            <CardTitle className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#8FD3C7] via-[#DCCBF6] to-[#F6D6E0] bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <p className="text-sm text-slate-700 max-w-prose mx-auto">
              Sign in to access personalized pregnancy guidance, reports, and
              care.
            </p>
          </CardHeader>

          <CardContent className="px-6 pb-8">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
              aria-live="polite"
            >
              {/* Email */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2.5"
                  aria-invalid={!!formState.errors.email}
                  aria-describedby={
                    formState.errors.email ? 'email-error' : 'email-help'
                  }
                />
                <p id="email-help" className="text-xs text-slate-600 mt-1">
                  Use the email you registered with.
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

              {/* Password */}
              <div className="relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="mt-2.5 pr-10"
                  aria-invalid={!!formState.errors.password}
                  aria-describedby={
                    formState.errors.password
                      ? 'password-error'
                      : 'password-help'
                  }
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 bottom-3 text-slate-500 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8FD3C7] rounded"
                >
                  {showPassword ? (
                    <EyeOff size={18} aria-hidden />
                  ) : (
                    <Eye size={18} aria-hidden />
                  )}
                </button>
                <p id="password-help" className="text-xs text-slate-600 mt-1">
                  Forgot your password? Use the "Reset" link on the main page.
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

              {/* Submit */}
              <Button
                type="submit"
                disabled={formState.isSubmitting || loading}
                className="w-full rounded-full bg-gradient-to-r from-[#8FD3C7] via-[#DCCBF6] to-[#F6D6E0] hover:opacity-95 transition-all duration-200 text-lg font-semibold"
                size="lg"
              >
                {loading ? (
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
                    Signing in...
                  </span>
                ) : success ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check size={16} aria-hidden />
                    Signed in
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="flex items-center justify-between text-sm text-slate-700">
                <div>
                  <button
                    type="button"
                    onClick={() => router.push('/register')}
                    className="font-medium text-[#8FD3C7] hover:underline"
                  >
                    Register
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => router.push('/auth/forgot-password')}
                    className="text-slate-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
