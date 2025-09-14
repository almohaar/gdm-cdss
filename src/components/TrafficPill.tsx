'use client';

import { colors, Traffic } from "../lib/constants/colors";

export function TrafficPill({
  status,
  label,
}: {
  status: Traffic;
  label?: string;
}) {
  const bg = {
    ok: colors.ok,
    caution: colors.caution,
    high: colors.high,
    info: colors.info,
  }[status];
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm"
      style={{ backgroundColor: bg }}
    >
      <span className="w-2 h-2 rounded-full bg-white/90" />{' '}
      {label || status.toUpperCase()}
    </span>
  );
}
