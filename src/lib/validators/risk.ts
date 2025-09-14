// lib/gdm/risk.ts
import type { GdmAssessmentInput } from '@/lib/validators/gdm';

export type DecisionResult = {
  score: number; // 0-100
  band: 'LOW' | 'MODERATE' | 'HIGH';
  color: 'green' | 'amber' | 'red';
  lcd: 'Low risk' | 'Consider diagnostic testing' | 'Diagnostic for GDM';
  reasons: string[];
  bmi: number;
  flags: {
    meetsWHO: boolean;
    borderlineWHO: boolean;
  };
};

export function calcBMI(heightCm: number, weightKg: number) {
  const h = heightCm / 100;
  return +(weightKg / (h * h)).toFixed(1);
}

export function assessGDM(input: GdmAssessmentInput): DecisionResult {
  const reasons: string[] = [];
  const bmi = calcBMI(input.heightCm, input.weightKg);
  let score = 0;

  // WHO 2013 diagnostic thresholds (any one is diagnostic)
  const meetsWHO =
    input.fastingGlucose >= 5.1 ||
    (!!input.ogtt1h && input.ogtt1h >= 10.0) ||
    (!!input.ogtt2h && input.ogtt2h >= 8.5);

  const borderlineWHO =
    (input.fastingGlucose >= 4.8 && input.fastingGlucose < 5.1) ||
    (!!input.ogtt2h && input.ogtt2h >= 8.2 && input.ogtt2h < 8.5);

  // Base points from glucose
  if (input.fastingGlucose >= 5.6) {
    score += 70;
    reasons.push(`Fasting glucose ${input.fastingGlucose} mmol/L (≥ 5.6)`);
  } else if (input.fastingGlucose >= 5.1) {
    score += 60;
    reasons.push(`Fasting glucose ${input.fastingGlucose} mmol/L (≥ 5.1)`);
  } else if (input.fastingGlucose >= 4.8) {
    score += 25;
    reasons.push(`Fasting glucose ${input.fastingGlucose} mmol/L (4.8–5.0)`);
  }

  if (input.ogtt1h != null) {
    if (input.ogtt1h >= 10.0) {
      score += 60;
      reasons.push(`1-h OGTT ${input.ogtt1h} mmol/L (≥ 10.0)`);
    } else if (input.ogtt1h >= 9.0) {
      score += 30;
      reasons.push(`1-h OGTT ${input.ogtt1h} mmol/L (9.0–9.9)`);
    }
  }

  if (input.ogtt2h != null) {
    if (input.ogtt2h >= 9.0) {
      score += 60;
      reasons.push(`2-h OGTT ${input.ogtt2h} mmol/L (≥ 9.0)`);
    } else if (input.ogtt2h >= 8.5) {
      score += 50;
      reasons.push(`2-h OGTT ${input.ogtt2h} mmol/L (≥ 8.5)`);
    } else if (input.ogtt2h >= 8.2) {
      score += 25;
      reasons.push(`2-h OGTT ${input.ogtt2h} mmol/L (8.2–8.49)`);
    }
  }

  // Demographic & history modifiers
  if (input.age >= 35) {
    score += 10;
    reasons.push(`Age ${input.age} (≥ 35)`);
  }
  if (bmi >= 30) {
    score += 20;
    reasons.push(`BMI ${bmi} (obesity)`);
  } else if (bmi >= 25) {
    score += 10;
    reasons.push(`BMI ${bmi} (overweight)`);
  }

  if (input.historyGDM) {
    score += 15;
    reasons.push('Previous GDM');
  }
  if (input.familyHistoryDM) {
    score += 10;
    reasons.push('Family history of diabetes');
  }
  if (input.ethnicityRisk === 'HIGH') {
    score += 10;
    reasons.push('Higher-risk ethnicity');
  }

  // Gestational age context (encourage OGTT timing ≥24 weeks)
  if (input.gestationalAgeWeeks < 24 && !meetsWHO) {
    reasons.push(
      `Early gestation (${input.gestationalAgeWeeks} weeks) — consider retesting at 24–28 weeks if screening`,
    );
  }

  // Cap
  if (score > 100) score = 100;

  // Band + color + LCD label
  let band: DecisionResult['band'] = 'LOW';
  let color: DecisionResult['color'] = 'green';
  let lcd: DecisionResult['lcd'] = 'Low risk';

  if (meetsWHO) {
    band = 'HIGH';
    color = 'red';
    lcd = 'Diagnostic for GDM';
  } else if (score >= 50) {
    band = 'HIGH';
    color = 'red';
    lcd = 'Consider diagnostic testing'; // high risk but not meeting WHO explicitly
  } else if (score >= 20 || borderlineWHO) {
    band = 'MODERATE';
    color = 'amber';
    lcd = 'Consider diagnostic testing';
  }

  return {
    score,
    band,
    color,
    lcd,
    reasons,
    bmi,
    flags: { meetsWHO, borderlineWHO },
  };
}
