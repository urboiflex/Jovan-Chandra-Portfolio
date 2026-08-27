const CURSOR_EASING = 0.06;
const CURSOR_SETTLE_DISTANCE = 0.05;

export const stepCursorFollower = (follower, target) => {
  const deltaX = target.x - follower.x;
  const deltaY = target.y - follower.y;
  const settled = Math.abs(deltaX) < CURSOR_SETTLE_DISTANCE
    && Math.abs(deltaY) < CURSOR_SETTLE_DISTANCE;

  if (settled) return { x: target.x, y: target.y, settled: true };

  return {
    x: follower.x + deltaX * CURSOR_EASING,
    y: follower.y + deltaY * CURSOR_EASING,
    settled: false,
  };
};
