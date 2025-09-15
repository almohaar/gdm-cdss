// components/DecisionSupportModal.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, AlertTriangle, DownloadCloud } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { GdmAssessmentResult } from '@/lib/validators/risk';

type Props = {
  open: boolean;
  result: GdmAssessmentResult | null;
  onCloseAction: () => void;
};

/** UI color bucket keys */
type StatusColor = 'green' | 'amber' | 'red';

const colorMap: Record<
  StatusColor,
  { bg: string; text: string; icon: React.ReactNode }
> = {
  green: { bg: 'bg-green-50', text: 'text-green-700', icon: <CheckCircle /> },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    icon: <AlertTriangle />,
  },
  red: { bg: 'bg-rose-50', text: 'text-rose-700', icon: <AlertTriangle /> },
};

export default function DecisionSupportModal({ open, result, onCloseAction }: Props) {
  if (!result) return null;

  // determine UI color from the result
  const statusColor: StatusColor =
    result.diagnostic === 'GDM'
      ? 'red'
      : result.diagnostic === 'INDETERMINATE'
      ? 'amber'
      : // NO_GDM
      result.riskLevel === 'HIGH'
      ? 'amber'
      : 'green';

  const bandLabel =
    result.diagnostic === 'GDM'
      ? 'GDM (diagnostic)'
      : result.diagnostic === 'NO_GDM'
      ? 'No GDM'
      : 'Further testing required';

  const band = colorMap[statusColor];

  const exportPdf = () => {
    // placeholder — implement server-side PDF or client-side generator
    // Example: POST /api/export with input & result and return blob.
    alert(
      'Export PDF not implemented. Implement /api/export or client PDF generation.',
    );
  };

  // helper to render diagnostic criteria in readable form
  const renderCriteria = () => {
    const c = result.diagnosticCriteria;
    return (
      <ul className="list-disc pl-5 text-sm text-slate-700">
        <li>
          Fasting:{' '}
          {typeof c.fasting === 'boolean' ? String(c.fasting) : 'not available'}
        </li>
        {/* 1h used for WHO only */}
        <li>
          1-hour OGTT:{' '}
          {typeof c.ogtt1h === 'boolean'
            ? String(c.ogtt1h)
            : 'not applicable / not provided'}
        </li>
        <li>
          2-hour OGTT:{' '}
          {typeof c.ogtt2h === 'boolean' ? String(c.ogtt2h) : 'not available'}
        </li>
      </ul>
    );
  };

  // attempt to extract BMI line from explanation (if present)
  const bmiLine = result.explanation.find(x => /BMI[:\s]/i.test(x));
  const bmiValue = bmiLine ? bmiLine : undefined;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCloseAction}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: 40, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.22, type: 'spring' }}
            className="relative w-full max-w-2xl mx-4"
            role="dialog"
            aria-modal="true"
            aria-label="GDM assessment result"
          >
            <Card className="p-6 rounded-2xl shadow-2xl">
              <div className="flex items-start gap-4">
                {/* Status */}
                <div className={`${band.bg} p-3 rounded-lg`}>
                  <div
                    className={`${band.text} flex items-center gap-2 font-semibold`}
                  >
                    <span className="text-lg">{band.icon}</span>
                    <span className="uppercase text-xs">{bandLabel}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Assessment result
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {`Guideline used: ${result.guidelineUsed} — advisory only`}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-4xl font-extrabold">
                        {Math.round(result.riskScore)}%
                      </div>
                      <div className="text-xs text-slate-500">Risk score</div>
                      <div className="text-xs text-slate-400 mt-1">
                        Level:{' '}
                        <strong className="capitalize">
                          {result.riskLevel.toLowerCase()}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Grid */}
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Left col: diagnostic + BMI + criteria */}
                    <div>
                      <div className="text-sm text-slate-600">Diagnosis</div>
                      <div className="mt-1 font-medium text-slate-900">
                        {bandLabel}
                      </div>

                      <div className="mt-3 text-sm text-slate-600">
                        Diagnostic criteria
                      </div>
                      <div className="mt-2">{renderCriteria()}</div>

                      <div className="mt-3 text-sm text-slate-600">BMI</div>
                      <div className="mt-1 font-medium">{bmiValue ?? '—'}</div>
                    </div>

                    {/* Right col: reasons & recommendations */}
                    <div>
                      <div className="text-sm text-slate-600">
                        Key explanations
                      </div>
                      <div className="mt-2 flex flex-col gap-2 max-h-44 overflow-auto pr-2">
                        {result.explanation.length === 0 ? (
                          <div className="text-sm text-slate-500">
                            No explanation available.
                          </div>
                        ) : (
                          result.explanation.map((line, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.03 }}
                              className="text-sm px-3 py-2 rounded-md bg-slate-50 text-slate-700"
                            >
                              {line}
                            </motion.div>
                          ))
                        )}
                      </div>

                      <div className="mt-4 text-sm text-slate-600">
                        Recommendations
                      </div>
                      <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 max-h-40 overflow-auto pr-2">
                        {result.recommendations.length === 0 ? (
                          <li>No recommendations generated.</li>
                        ) : (
                          result.recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                          ))
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="text-xs text-slate-500">
                      Decision support only — combine with clinical judgement
                      and local protocols.
                    </div>

                    <div className="flex items-center gap-2">
                      {/* references from result.references */}
                      {result.references.map((ref, i) => (
                        <Link
                          key={i}
                          href={ref.url}
                          target="_blank"
                          className="text-sm text-indigo-600 underline"
                          rel="noreferrer"
                        >
                          {ref.title}
                        </Link>
                      ))}

                      <Button
                        variant="outline"
                        onClick={exportPdf}
                        className="flex items-center gap-2"
                      >
                        <DownloadCloud size={16} /> Export
                      </Button>

                      <Button onClick={onCloseAction}>Close</Button>
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
