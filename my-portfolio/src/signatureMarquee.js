export const SIGNATURE_MARQUEE_CONTENT = {
  quote: 'No borrowed formulas. Just considered choices.',
  signature: 'Jovan',
  name: 'Jovan Chandra',
};

export const SIGNATURE_MARQUEE_REPEAT_COUNT = 4;

export const SIGNATURE_MARQUEE_SCROLL_TRIGGER = {
  card: { start: 'top bottom', end: 'bottom top', scrub: true },
  row: { start: 'top bottom+=10%', end: 'bottom top-=10%', scrub: true },
};

export const getSignatureMarqueeRows = () => [
  { id: 'first', direction: 'left' },
  { id: 'second', direction: 'right' },
  { id: 'third', direction: 'left' },
];

export const getSignatureMarqueeDistance = (textWidth, viewportWidth) => {
  if (!Number.isFinite(textWidth) || textWidth <= 0) return 0;
  if (!Number.isFinite(viewportWidth) || viewportWidth <= 0) return textWidth;
  return Math.min(textWidth, viewportWidth * 0.75);
};
