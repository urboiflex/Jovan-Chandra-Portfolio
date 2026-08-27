const CONTACT_WHEEL_DAMPING = 0.52;

const createContactWheelDamping = ({ documentLike, viewportLike }) => (input) => {
  const contactScene = documentLike?.querySelector?.('[data-contact-scroll-zone]');
  if (!contactScene || !viewportLike) return;

  const bounds = contactScene.getBoundingClientRect();
  const isContactVisible = bounds.top < viewportLike.innerHeight && bounds.bottom > 0;
  if (isContactVisible) input.deltaY *= CONTACT_WHEEL_DAMPING;
};

export const getSmoothScrollOptions = ({
  documentLike = typeof document === 'undefined' ? null : document,
  viewportLike = typeof window === 'undefined' ? null : window,
} = {}) => ({
  lerp: 0.08,
  smoothWheel: true,
  wheelMultiplier: 0.8,
  virtualScroll: createContactWheelDamping({ documentLike, viewportLike }),
});

export const resumeSmoothScroll = (controller) => {
  if (!controller) return false;
  controller.start();
  return true;
};

export const updateScrollProgress = (event, gsap, documentLike = document) => {
  const indicator = documentLike.querySelector('.scroll-progress-indicator');
  if (!indicator) return false;
  gsap.set(indicator, { scaleY: event.progress || 0 });
  return true;
};

export const createAnimationFrameLoop = (onFrame, scheduler = {
  request: (callback) => requestAnimationFrame(callback),
  cancel: (id) => cancelAnimationFrame(id),
}) => {
  let frameId = null;
  let running = false;

  const tick = (time) => {
    if (!running) return;
    onFrame(time);
    frameId = scheduler.request(tick);
  };

  return {
    start() {
      if (running) return;
      running = true;
      frameId = scheduler.request(tick);
    },
    stop() {
      if (!running) return;
      running = false;
      scheduler.cancel(frameId);
      frameId = null;
    },
  };
};
