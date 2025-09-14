'use client';

import Link from 'next/link';
import { useAuth } from '../store/auth';

const linksByRole: Record<string, { href: string; label: string }[]> = {
  patient: [{ href: '/dashboard', label: 'Dashboard' }],
  clinician: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/patients', label: 'Patients' },
    { href: '/alerts', label: 'Alerts' },
    { href: '/appointments', label: 'Appointments' },
  ],
  admin: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/patients', label: 'Patients' },
    { href: '/clinicians', label: 'Clinicians' },
    { href: '/rules', label: 'Rules' },
    { href: '/audit-logs', label: 'Audit Logs' },
  ],
  researcher: [{ href: '/dashboard', label: 'Dashboard' }],
};

export function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || 'patient';
  const links = linksByRole[role] || [];
  return (
    <aside className="w-64 min-h-screen border-r bg-white p-4">
      <div className="mb-4 font-semibold">Menu</div>
      <nav className="flex flex-col gap-2">
        {links.map(l => (
          <Link key={l.href} className="text-sm hover:underline" href={l.href}>
            {l.label}
          </Link>
        ))}
        {!user && (
          <Link href="/login" className="text-sm hover:underline">
            Login
          </Link>
        )}
      </nav>
    </aside>
  );
}
