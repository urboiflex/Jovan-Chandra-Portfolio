export const SCROLL_SECTION_TRIGGER_RANGE = Object.freeze({
  start: 'top 55%',
  end: 'bottom 55%',
});

const SCROLL_RAIL_EXCLUDED_SECTIONS = new Set(['Home', 'Statement']);

export const getScrollRailSections = (sections) => sections.filter(
  (section) => !SCROLL_RAIL_EXCLUDED_SECTIONS.has(section.dataset.scrollSection),
);
