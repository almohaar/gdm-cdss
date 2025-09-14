'use client';
import { ReactNode } from 'react';
import { useAuth } from '../store/auth';

export default function RoleGate({
  allow,
  children,
}: {
  allow: Array<'patient' | 'clinician' | 'admin' | 'researcher'>;
  children: ReactNode;
}) {
  const role = useAuth(s => s.role);
  if (!role || !allow.includes(role)) return null;
  return <>{children}</>;
}
