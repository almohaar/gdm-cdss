import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NICE_TARGETS, WHO_DIAGNOSTIC_OGTT } from '../../../lib/constants/guidelines';

export default function RulesPage() {
  return (
    <div className="container mx-auto p-6 grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>NICE targets (operational)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-5 text-sm space-y-1">
            <li>Fasting: ≤ {NICE_TARGETS.fasting_max} mmol/L</li>
            <li>1-hour post‑meal: ≤ {NICE_TARGETS.pp1h_max} mmol/L</li>
            <li>2-hour post‑meal: ≤ {NICE_TARGETS.pp2h_max} mmol/L</li>
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>WHO — 75g OGTT diagnostic cutoffs</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc ml-5 text-sm space-y-1">
            <li>Fasting ≥ {WHO_DIAGNOSTIC_OGTT.fasting_dx} mmol/L</li>
            <li>1-hour ≥ {WHO_DIAGNOSTIC_OGTT.one_hour_dx} mmol/L</li>
            <li>2-hour ≥ {WHO_DIAGNOSTIC_OGTT.two_hour_dx} mmol/L</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
