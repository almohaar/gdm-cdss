// lib/validators/risk.ts
export type GdmAssessmentInput = {
  age?: number | null;
  gestationalAgeWeeks?: number | null;
  heightCm?: number | null;
  weightKg?: number | null;
  ethnicityRisk?: 'LOW' | 'HIGH';
  historyGDM?: boolean;
  familyHistoryDM?: boolean;
  fastingGlucose?: number | null; // mmol/L
  ogtt1h?: number | null; // mmol/L
  ogtt2h?: number | null; // mmol/L
  systolicBP?: number | null;
};

export type GdmAssessmentResult = {
  diagnostic: 'GDM' | 'NO_GDM' | 'INDETERMINATE';
  diagnosticCriteria: {
    fasting?: boolean;
    ogtt1h?: boolean;
    ogtt2h?: boolean;
    // note: for NICE the ogtt1h will be undefined/unused
  };
  riskScore: number; // 0..100
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  recommendations: string[];
  explanation: string[]; // human-readable lines explaining what happened
  references: { title: string; url: string }[]; // NICE / WHO links
  guidelineUsed: 'WHO' | 'NICE';
};

export function assessGDM(
  input: GdmAssessmentInput,
  opts?: { guideline?: 'WHO' | 'NICE' },
): GdmAssessmentResult {
  const guideline = opts?.guideline ?? 'WHO';

  // thresholds
  const THRESHOLDS =
    guideline === 'WHO'
      ? { fasting: 5.1, ogtt1h: 10.0, ogtt2h: 8.5 }
      : { fasting: 5.6, ogtt1h: undefined, ogtt2h: 7.8 }; // NICE: 1h not diagnostic

  const references =
    guideline === 'WHO'
      ? [
          {
            title: 'WHO 2013 diagnostic criteria',
            url: 'https://www.who.int/publications/i/item/9789241506024',
          },
        ]
      : [
          {
            title: 'NICE NG3 — Diabetes in pregnancy',
            url: 'https://www.nice.org.uk/guidance/ng3',
          },
        ];

  const explanation: string[] = [];
  const recs: string[] = [];
  const criteria: Record<string, boolean | undefined> = {};

  // normalize labs
  const fasting =
    typeof input.fastingGlucose === 'number' ? input.fastingGlucose : null;
  const ogtt1h = typeof input.ogtt1h === 'number' ? input.ogtt1h : null;
  const ogtt2h = typeof input.ogtt2h === 'number' ? input.ogtt2h : null;

  // Evaluate criteria according to guideline
  if (fasting !== null) {
    criteria.fasting = fasting >= (THRESHOLDS.fasting as number);
    explanation.push(
      `Fasting: ${fasting} mmol/L (threshold ${THRESHOLDS.fasting} per ${guideline}).`,
    );
  } else {
    explanation.push('Fasting glucose: not provided.');
  }

  if (guideline === 'WHO') {
    if (ogtt1h !== null) {
      criteria.ogtt1h = ogtt1h >= (THRESHOLDS.ogtt1h as number);
      explanation.push(
        `1-h OGTT: ${ogtt1h} mmol/L (threshold ${THRESHOLDS.ogtt1h}).`,
      );
    } else {
      explanation.push('1-h OGTT: not provided.');
    }
  }

  if (ogtt2h !== null) {
    criteria.ogtt2h = ogtt2h >= (THRESHOLDS.ogtt2h as number);
    explanation.push(
      `2-h OGTT: ${ogtt2h} mmol/L (threshold ${THRESHOLDS.ogtt2h}).`,
    );
  } else {
    explanation.push('2-h OGTT: not provided.');
  }

  // Diagnostic logic:
  // WHO/IADPSG: any one of fasting/1h/2h above threshold => GDM.
  // NICE: fasting >=5.6 OR 2h >=7.8 => GDM (1h not used).
  let anyDiagnostic = false;
  if (guideline === 'WHO') {
    anyDiagnostic = !!(criteria.fasting || criteria.ogtt1h || criteria.ogtt2h);
  } else {
    // NICE
    anyDiagnostic = !!(criteria.fasting || criteria.ogtt2h);
  }

  let diagnostic: GdmAssessmentResult['diagnostic'] = 'INDETERMINATE';
  const anyLabProvided = fasting !== null || ogtt1h !== null || ogtt2h !== null;
  if (!anyLabProvided) diagnostic = 'INDETERMINATE';
  else diagnostic = anyDiagnostic ? 'GDM' : 'NO_GDM';

  // risk scoring heuristic (transparent, tunable)
  let score = 0;
  // age
  if (input.age && input.age >= 35) score += 18;
  else if (input.age && input.age >= 30) score += 8;

  // BMI
  let bmi: number | null = null;
  if (input.heightCm && input.weightKg) {
    const h = input.heightCm / 100;
    const b = input.weightKg / (h * h);
    if (Number.isFinite(b)) {
      bmi = Math.round(b * 10) / 10;
      if (b >= 30) score += 20;
      else if (b >= 25) score += 8;
    }
  }

  // ethnicity, history, family
  if (input.ethnicityRisk === 'HIGH') score += 10;
  if (input.historyGDM) score += 25;
  if (input.familyHistoryDM) score += 8;
  if (input.systolicBP && input.systolicBP >= 140) score += 6;

  // labs proximity scoring helper
  function proximityScore(value: number | null, threshold?: number) {
    if (typeof threshold !== 'number' || value === null) return 0;
    if (value >= threshold) return 50;
    const pct = value / threshold;
    if (pct >= 0.9) return 20;
    return 5;
  }

  score += proximityScore(fasting, THRESHOLDS.fasting);
  // add 1h only for WHO
  if (guideline === 'WHO') score += proximityScore(ogtt1h, THRESHOLDS.ogtt1h);
  score += proximityScore(ogtt2h, THRESHOLDS.ogtt2h);

  // clamp
  if (score > 100) score = 100;
  if (score < 0) score = 0;
  const riskScore = Math.round(score);

  let riskLevel: GdmAssessmentResult['riskLevel'] = 'LOW';
  if (riskScore >= 65) riskLevel = 'HIGH';
  else if (riskScore >= 30) riskLevel = 'MODERATE';

  // recommendations
  if (diagnostic === 'GDM') {
    recs.push(
      `${guideline} criteria met — treat as gestational diabetes (advise management pathway).`,
    );
    recs.push(
      'Initiate structured care: diet and physical activity advice, SMBG (targets per local guidance), consider specialist referral.',
    );
    recs.push(
      'If glycaemic targets not achieved with lifestyle, consider pharmacotherapy (metformin/insulin) according to local protocols.',
    );
  } else if (diagnostic === 'NO_GDM') {
    recs.push(
      'No diagnostic glucose value reached the selected guideline thresholds.',
    );
    const ga = input.gestationalAgeWeeks ?? null;
    if (ga === null || ga < 24) {
      recs.push(
        'If <24 weeks and high risk, consider early testing and repeat OGTT at 24–28 weeks.',
      );
    } else {
      recs.push(
        'Follow routine screening or repeat per local protocol (usually 24–28 weeks).',
      );
    }
    if (riskLevel === 'HIGH')
      recs.push(
        'High-risk features present — consider closer monitoring and lifestyle intervention.',
      );
    else recs.push('Advise lifestyle modification and routine antenatal care.');
  } else {
    recs.push(
      'No diagnostic labs provided — perform OGTT (fasting + 2-hour) or at least fasting glucose.',
    );
    if (input.gestationalAgeWeeks && input.gestationalAgeWeeks < 24) {
      recs.push(
        'If high-risk and <24 weeks, do early testing and repeat at 24–28 weeks.',
      );
    } else recs.push('Arrange testing at 24–28 weeks if not already done.');
  }

  // compose explanation list
  explanation.unshift(
    `Computed risk score: ${riskScore} (level: ${riskLevel}).`,
  );
  if (bmi !== null) explanation.push(`BMI: ${bmi} kg/m².`);

  return {
    diagnostic,
    diagnosticCriteria: {
      fasting: criteria.fasting,
      ogtt1h: criteria.ogtt1h,
      ogtt2h: criteria.ogtt2h,
    },
    riskScore,
    riskLevel,
    recommendations: recs,
    explanation,
    references,
    guidelineUsed: guideline,
  };
}
