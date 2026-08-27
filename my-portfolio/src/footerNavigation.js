export const handleFooterNavigation = (event, target, onNavigate, canAnimate) => {
  if (!canAnimate || typeof onNavigate !== 'function') return false;

  event.preventDefault();
  onNavigate(target, event.currentTarget);
  return true;
};
