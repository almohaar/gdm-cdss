import { ReadingContext, classifyReading } from './guidelines';
import { Traffic } from './colors';

export type RuleOutcome = {
  traffic: Traffic;
  message: string;
  actions: Array<{
    label: string;
    route?: string;
    kind: 'primary' | 'secondary' | 'destructive';
  }>;
};

export function evaluateGlucose(
  mmol: number,
  ctx: ReadingContext,
): RuleOutcome {
  const t = classifyReading(mmol, ctx);
  if (t === 'ok') {
    return {
      traffic: t,
      message: 'Within NICE target range',
      actions: [{ label: 'Log reading', kind: 'primary', route: '/readings' }],
    };
  }
  if (t === 'caution') {
    return {
      traffic: t,
      message: 'Slightly above target — reinforce diet/exercise and recheck',
      actions: [
        {
          label: 'See education',
          kind: 'secondary',
          route: '/education/gdm-basics',
        },
        { label: 'Schedule call', kind: 'primary', route: '/appointments/new' },
      ],
    };
  }
  return {
    traffic: t,
    message: 'High reading — follow escalation protocol',
    actions: [
      {
        label: 'Trigger clinician alert',
        kind: 'destructive',
        route: '/alerts/new?type=glycaemia',
      },
      {
        label: 'Create recommendation',
        kind: 'primary',
        route: '/recommendations/new',
      },
    ],
  };
}
