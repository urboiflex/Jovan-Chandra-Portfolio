const clamp = (minimum, value, maximum) => Math.min(maximum, Math.max(minimum, value));

export const createInfoTransitionPlan = ({
  destinationView = 'info',
  sourceRect,
  sourceFontSize,
  viewportWidth,
  prefersReducedMotion,
}) => {
  const compact = viewportWidth < 768;
  const duration = prefersReducedMotion ? 0 : 1;
  const worksTitle = destinationView === 'works';
  const destinationFontSize = worksTitle
    ? compact
      ? 38
      : Math.round(clamp(43.2, viewportWidth * 0.0415, 60.8) * 1000) / 1000
    : clamp(40, viewportWidth * 0.05, 72);

  return {
    start: {
      left: sourceRect.left,
      top: sourceRect.top,
      fontSize: sourceFontSize,
    },
    end: {
      left: compact ? 24 : 48,
      top: compact ? 24 : worksTitle ? 46 : 48,
      fontSize: destinationFontSize,
      lineHeight: worksTitle ? 0.9 : 1.2,
      letterSpacing: worksTitle ? '-0.06em' : '-0.055em',
    },
    timing: {
      coverDuration: prefersReducedMotion ? 0 : 0.7,
      labelDelay: prefersReducedMotion ? 0 : 0.2,
      labelDuration: duration,
    },
  };
};

export const getPortfolioViewFromPath = (pathname) => {
  if (/^\/info\/?$/.test(pathname)) return 'info';
  if (/^\/contact\/?$/.test(pathname)) return 'contact';
  if (/^\/works\/?$/.test(pathname)) return 'works';
  if (/^\/works\/[^/]+\/?$/.test(pathname)) return 'project';
  return 'home';
};

export const getInfoTransitionSwapDelayMs = (timing) => {
  if (timing.labelDelay === 0 && timing.labelDuration === 0) return 0;
  return Math.round((timing.labelDelay + timing.labelDuration + 0.1) * 1000);
};

export const getFlyingLabelHandoffTiming = () => ({
  delay: 0.1,
  duration: 0.9,
});

export const getDetailArrivalReleaseTime = ({ coverDelay, coverDuration }) => (
  coverDelay + coverDuration
);

export const getDetailNavigationMode = ({
  hasSourceElement,
  isNavigating,
  hasAnimationRuntime,
}) => {
  if (!hasSourceElement || isNavigating) return 'blocked';
  return hasAnimationRuntime ? 'animated' : 'immediate';
};
