import { Traffic } from './colors';

export const NICE_TARGETS = {
  fasting_max: 5.3, // mmol/L — aim below this
  pp1h_max: 7.8, // 1-hour post-meal target
  pp2h_max: 6.4, // 2-hour post-meal target
};

export const WHO_DIAGNOSTIC_OGTT = {
  fasting_dx: 5.1, // ≥ 5.1 mmol/L (diagnosis threshold)
  one_hour_dx: 10.0, // ≥ 10.0 mmol/L
  two_hour_dx: 8.5, // ≥ 8.5 mmol/L
};

export type ReadingContext =
  | 'fasting'
  | 'postPrandial_1h'
  | 'postPrandial_2h'
  | 'random'
  | 'unknown';

export function classifyReading(mmol: number, ctx: ReadingContext): Traffic {
  if (ctx === 'fasting')
    return mmol < NICE_TARGETS.fasting_max
      ? 'ok'
      : mmol < NICE_TARGETS.fasting_max + 1
      ? 'caution'
      : 'high';

  if (ctx === 'postPrandial_1h')
    return mmol < NICE_TARGETS.pp1h_max
      ? 'ok'
      : mmol < NICE_TARGETS.pp1h_max + 1
      ? 'caution'
      : 'high';

  if (ctx === 'postPrandial_2h')
    return mmol < NICE_TARGETS.pp2h_max
      ? 'ok'
      : mmol < NICE_TARGETS.pp2h_max + 1
      ? 'caution'
      : 'high';

  // random/unknown: be conservative
  return mmol < 7.8 ? 'ok' : mmol < 9.0 ? 'caution' : 'high';
}

export function ogttMeetsWHO(
  mmolFasting: number,
  mmol1h: number,
  mmol2h: number,
) {
  return (
    mmolFasting >= WHO_DIAGNOSTIC_OGTT.fasting_dx ||
    mmol1h >= WHO_DIAGNOSTIC_OGTT.one_hour_dx ||
    mmol2h >= WHO_DIAGNOSTIC_OGTT.two_hour_dx
  );
}
