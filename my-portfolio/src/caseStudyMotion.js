export const getMilestoneProgressMotion = (isCompact) => (
  isCompact
    ? { from: { scaleX: 0 }, to: { scaleX: 1 } }
    : { from: { scaleY: 0 }, to: { scaleY: 1 } }
);

export const shouldInitializeCaseStudy = ({ isLoaded, hasGsap, hasScrollTrigger }) => (
  Boolean(isLoaded && hasGsap && hasScrollTrigger)
);

export const getCaseMilestoneTrigger = () => ({
  start: 'top 55%',
  end: 'bottom 45%',
});

export const CASE_STUDY_HANDOFF_THRESHOLD = 0.98;

export const getHandoffTriggerStart = (bannerHeight) => {
  const height = Math.max(0, Math.round(Number(bannerHeight) || 0));
  return height > 0 ? `top bottom-=${height}` : 'top bottom';
};

export const getHandoffScrollTriggerConfig = ({ bannerHeight, pin, onUpdate, onScrubComplete }) => ({
  start: getHandoffTriggerStart(bannerHeight),
  end: 'bottom bottom',
  scrub: 1.05,
  pin,
  pinSpacing: false,
  pinType: 'fixed',
  anticipatePin: 0,
  onUpdate,
  onScrubComplete,
});

export const clampHandoffProgress = (value) => {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
};

export const getCaseHeroParallaxMotion = () => ({
  yPercent: -5,
  ease: 'none',
  scrollTrigger: {
    start: 'top top+=80',
    end: 'bottom top',
    scrub: 0.8,
  },
});

const formatMilestone = (position, total) => (
  `${String(position).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
);

export const getHandoffLabels = (currentIndex, totalCount) => {
  const total = Math.max(1, Math.trunc(totalCount));
  const index = Math.min(Math.max(0, Math.trunc(currentIndex)), total - 1);
  return {
    current: formatMilestone(index + 1, total),
    destination: index < total - 1 ? formatMilestone(index + 2, total) : 'WORKS',
  };
};

export const shouldCompleteHandoff = ({
  progress,
  direction,
  isLocked,
  reducedMotion,
}) => (
  !reducedMotion
  && !isLocked
  && direction > 0
  && clampHandoffProgress(progress) >= CASE_STUDY_HANDOFF_THRESHOLD
);

export const createHandoffNavigator = ({
  destinationRef,
  lockRef,
  schedule = (callback) => callback(),
}) => () => {
  if (lockRef.current) return false;
  lockRef.current = true;
  schedule(() => {
    const { nextProject, onNext, onBack } = destinationRef.current;
    if (nextProject) {
      onNext(nextProject.id);
    } else {
      onBack();
    }
  });
  return true;
};

export const restoreCaseStudyScroll = (
  controller,
  fallbackScroll,
  schedule = requestAnimationFrame,
  { resume = true } = {},
) => {
  schedule(() => {
    if (!controller) {
      fallbackScroll();
      return;
    }

    controller.scrollTo(0, { immediate: true, force: true });
    if (resume) controller.start();
  });
};
