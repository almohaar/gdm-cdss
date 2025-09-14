'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, AlertTriangle, Info, DownloadCloud } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DecisionResult } from '../lib/validators/risk';

type Props = {
  open: boolean;
  result: DecisionResult | null;
  onClose: () => void;
};

export default function DecisionSupportModal({ open, result, onClose }: Props) {
  if (!result) return null;

  const colorMap = {
    green: { bg: 'bg-green-50', text: 'text-green-700', icon: <CheckCircle /> },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      icon: <AlertTriangle />,
    },
    red: { bg: 'bg-rose-50', text: 'text-rose-700', icon: <AlertTriangle /> },
  } as const;

  const band = colorMap[result.color];

  // would complete this soon - todo
  const exportPdf = () => {
    alert(
      'Export PDF not implemented in this demo. Hook up /api/export or client PDF generator.',
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />

          <motion.div
            initial={{ y: 40, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.18, type: 'spring' }}
            className="relative w-full max-w-2xl mx-4"
          >
            <Card className="p-6 rounded-2xl shadow-2xl">
              <div className="flex items-start gap-4">
                <div className={`${band.bg} p-3 rounded-lg`}>
                  <div
                    className={`${band.text} flex items-center gap-2 font-semibold`}
                  >
                    <span className="text-lg">{band.icon}</span>
                    <span className="uppercase text-xs">{result.band}</span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Assessment result
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Guideline-aligned decision support (WHO/NICE)
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-4xl font-extrabold">
                        {Math.round(result.score)}%
                      </div>
                      <div className="text-xs text-slate-500">Risk score</div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-slate-600">LCD label</div>
                      <div className="mt-1 font-medium">{result.lcd}</div>

                      <div className="mt-3 text-sm text-slate-600">Flags</div>
                      <ul className="mt-2 text-sm space-y-1">
                        <li>
                          • BMI: <strong>{result.bmi}</strong>
                        </li>
                        <li>
                          • Meets WHO diagnostic:{' '}
                          <strong
                            className={
                              result.flags.meetsWHO
                                ? 'text-rose-600'
                                : 'text-slate-600'
                            }
                          >
                            {String(result.flags.meetsWHO)}
                          </strong>
                        </li>
                        <li>
                          • Borderline WHO:{' '}
                          <strong
                            className={
                              result.flags.borderlineWHO
                                ? 'text-amber-700'
                                : 'text-slate-600'
                            }
                          >
                            {String(result.flags.borderlineWHO)}
                          </strong>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <div className="text-sm text-slate-600">Key reasons</div>
                      <div className="mt-2 flex flex-col gap-2">
                        {result.reasons.length === 0 ? (
                          <div className="text-sm text-slate-500">
                            No significant flags detected based on inputs.
                          </div>
                        ) : (
                          result.reasons.map((r, i) => (
                            <div
                              key={i}
                              className="text-sm px-3 py-2 rounded-md bg-slate-50 text-slate-700"
                            >
                              {r}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-500">
                      This is decision support — not a formal diagnosis. See
                      guidelines for definitive management.
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href="https://www.nice.org.uk/guidance/ng3"
                        target="_blank"
                        className="text-sm text-indigo-600 underline"
                      >
                        NICE NG3
                      </Link>

                      <Button
                        variant="outline"
                        onClick={exportPdf}
                        className="flex items-center gap-2"
                      >
                        <DownloadCloud size={16} /> Export
                      </Button>

                      <Button onClick={onClose}>Close</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
