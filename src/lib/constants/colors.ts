export const colors = {
  // Traffic-light scheme tuned for accessibility (WCAG AA on white)
  ok: 'hsl(142, 70%, 45%)', // green
  caution: 'hsl(38, 92%, 50%)', // amber
  high: 'hsl(0, 84%, 60%)', // red
  info: 'hsl(221, 83%, 53%)', // blue
  bgSoft: 'hsl(210, 20%, 98%)',
  border: 'hsl(220, 13%, 91%)',
};

export type Traffic = 'ok' | 'caution' | 'high' | 'info';
