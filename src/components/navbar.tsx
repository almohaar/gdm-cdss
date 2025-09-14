'use client';

import { useAuth } from "../store/auth";

export function Navbar() {
  const { user, clear } = useAuth();
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b bg-white">
      <div className="font-semibold">CDSS · GDM</div>
      <div className="flex items-center gap-4">
        <span className="text-sm">
          {user ? `${user.name} (${user.role})` : ''}
        </span>
        {user && (
          <button className="text-sm underline" onClick={clear}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
