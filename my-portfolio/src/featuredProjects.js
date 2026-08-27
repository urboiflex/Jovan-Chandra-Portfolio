export const FEATURED_SLIDESHOW_DELAY_MS = 1500;
export const FEATURED_SLIDESHOW_INTERVAL_MS = 1000;

export const getNextFeaturedGalleryState = (state, imageCount) => ({
  activeIndex: (state.activeIndex + 1) % imageCount,
  previousIndex: state.activeIndex,
  transition: state.transition + 1,
});

const DESKTOP_MOTION = Object.freeze({
  enableSpatialMotion: true,
  pin: false,
  scrub: true,
  expandedHeight: 72,
  restingHeight: 28,
  expandedWidth: 60,
  restingWidth: 48,
  rowPadding: 0,
  topPadding: 0,
  useWidthCycle: true,
  sectionStart: 'top bottom',
  sectionEnd: 'bottom top',
});

const MOBILE_MOTION = Object.freeze({
  enableSpatialMotion: true,
  pin: false,
  scrub: true,
  expandedHeight: 50,
  restingHeight: 25,
  expandedWidth: 100,
  restingWidth: 100,
  rowPadding: 20,
  topPadding: 0,
  useWidthCycle: false,
  sectionStart: 'top bottom',
  sectionEnd: 'bottom top',
});

const REDUCED_MOTION = Object.freeze({
  enableSpatialMotion: false,
  pin: false,
  scrub: false,
  expandedHeight: 28,
  restingHeight: 28,
  expandedWidth: 100,
  restingWidth: 100,
  rowPadding: 0,
  topPadding: 0,
  useWidthCycle: false,
  sectionStart: null,
  sectionEnd: null,
});

export const getFeaturedProjectsMotion = (reducedMotion, mobile = false) => {
  if (reducedMotion) return { ...REDUCED_MOTION };
  return { ...(mobile ? MOBILE_MOTION : DESKTOP_MOTION) };
};

export const getFeaturedProjectBackground = (project) => project.bgImg || project.img;

const solveTimelinePosition = (positionAtTime, viewportTarget) => {
  let lower = 0;
  let upper = 3000;

  for (let iteration = 0; iteration < 50; iteration += 1) {
    const midpoint = (lower + upper) / 2;
    if (positionAtTime(midpoint) > viewportTarget) lower = midpoint;
    else upper = midpoint;
  }

  return (lower + upper) / 2;
};

export const getFeaturedProjectPhases = (projectCount, motion) => {
  const phases = [];
  const collapsedRowHeight = motion.restingHeight + motion.rowPadding;
  const expandedRowHeight = motion.expandedHeight + motion.rowPadding;
  const topPadding = motion.topPadding || 0;

  const rowHeightAt = (index, time) => {
    const phase = phases[index];
    if (time <= phase.heightStart) return collapsedRowHeight;
    if (time >= phase.heightEnd) return expandedRowHeight;

    const progress = (time - phase.heightStart) / (phase.heightEnd - phase.heightStart);
    return collapsedRowHeight + (expandedRowHeight - collapsedRowHeight) * progress;
  };

  for (let index = 0; index < projectCount; index += 1) {
    const rowTopAt = (time) => {
      let precedingHeight = 0;
      for (let previous = 0; previous < index; previous += 1) {
        precedingHeight += rowHeightAt(previous, time);
      }
      return 100 + topPadding - time + precedingHeight;
    };

    const heightStart = solveTimelinePosition(rowTopAt, 100);
    const heightEnd = solveTimelinePosition(rowTopAt, 10);
    const infoFadeStart = solveTimelinePosition(rowTopAt, 70);

    phases.push({
      heightStart,
      heightEnd,
      infoFadeStart,
      widthGrowEnd: heightStart,
      widthShrinkStart: heightStart,
      widthShrinkEnd: heightStart,
    });

    if (motion.useWidthCycle) {
      const rowCenterAt = (time) => rowTopAt(time) + rowHeightAt(index, time) / 2;
      const rowBottomAt = (time) => rowTopAt(time) + rowHeightAt(index, time);

      phases[index] = {
        ...phases[index],
        widthGrowEnd: solveTimelinePosition(rowCenterAt, 55),
        widthShrinkStart: solveTimelinePosition(rowCenterAt, 45),
        widthShrinkEnd: solveTimelinePosition(rowBottomAt, 0),
      };
    }
  }

  return phases;
};
