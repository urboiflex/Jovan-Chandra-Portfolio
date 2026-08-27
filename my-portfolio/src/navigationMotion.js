export const getNavigationVisibility = ({ currentY, previousY, visible }) => {
  if (currentY <= 48) return true;

  const delta = currentY - previousY;
  if (Math.abs(delta) < 6) return visible;
  return delta < 0;
};

export const getNavigationMotion = (isActive, reducedMotion, isNavigating = false) => ({
  autoAlpha: isActive ? 1 : 0,
  y: isActive ? 0 : -56,
  duration: reducedMotion ? 0 : (isNavigating ? 0.24 : (isActive ? 0.7 : 0.5)),
  ease: reducedMotion ? 'none' : (isNavigating ? 'power2.out' : (isActive ? 'power4.out' : 'power3.in')),
  overwrite: 'auto',
});

export const getFloatingNavigationActive = ({ currentView, isVisible, isNavigating }) => (
  currentView === 'home' && isVisible && !isNavigating
);
