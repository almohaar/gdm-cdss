'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BellRing, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { colors } from '../lib/constants/colors';

export function AlertCard({
  title,
  message,
  level,
}: {
  title: string;
  message: string;
  level: 'critical' | 'warning' | 'info';
}) {
  const icon =
    level === 'critical' ? (
      <AlertTriangle />
    ) : level === 'warning' ? (
      <BellRing />
    ) : (
      <Info />
    );
  const bg =
    level === 'critical'
      ? colors.high
      : level === 'warning'
      ? colors.caution
      : colors.info;
  return (
    <motion.div initial={{ scale: 0.98 }} animate={{ scale: 1 }}>
      <Card className="border-0 shadow-md overflow-hidden">
        <div style={{ backgroundColor: bg }} className="px-4 py-2 text-white">
          <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium">{title}</span>
          </div>
        </div>
        <CardContent className="p-4 text-sm text-gray-700">
          {message}
        </CardContent>
      </Card>
    </motion.div>
  );
}
