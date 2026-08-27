import { useLayoutEffect, useRef } from 'react';
import {
  SCROLL_SECTION_TRIGGER_RANGE,
  getScrollRailSections,
} from './scrollProgressRailMotion.js';

const ScrollProgressRail = ({ isLoaded, isVisible }) => {
  const labelRef = useRef(null);

  useLayoutEffect(() => {
    if (!isLoaded || !isVisible || !window.gsap || !window.ScrollTrigger || !labelRef.current) {
      return undefined;
    }

    const gsap = window.gsap;
    const label = labelRef.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sections = getScrollRailSections(gsap.utils.toArray('[data-scroll-section]'));
    let hideLabel = null;

    const showLabel = (title) => {
      hideLabel?.kill();
      gsap.killTweensOf(label);
      label.textContent = title;

      gsap.fromTo(
        label,
        { autoAlpha: 0, x: reducedMotion ? 0 : 10 },
        {
          autoAlpha: 1,
          x: 0,
          duration: reducedMotion ? 0 : 0.28,
          ease: 'power3.out',
          overwrite: true,
        },
      );

      hideLabel = gsap.delayedCall(0.9, () => {
        gsap.to(label, {
          autoAlpha: 0,
          x: reducedMotion ? 0 : 6,
          duration: reducedMotion ? 0 : 0.34,
          ease: 'power2.in',
        });
      });
    };

    const triggers = sections.map((section) => window.ScrollTrigger.create({
      trigger: section,
      ...SCROLL_SECTION_TRIGGER_RANGE,
      onEnter: () => showLabel(section.dataset.scrollSection),
      onEnterBack: () => showLabel(section.dataset.scrollSection),
    }));

    const currentSection = sections.find((section) => {
      const bounds = section.getBoundingClientRect();
      const threshold = window.innerHeight * 0.55;
      return bounds.top <= threshold && bounds.bottom > threshold;
    });

    if (currentSection) {
      showLabel(currentSection.dataset.scrollSection);
    }

    return () => {
      hideLabel?.kill();
      gsap.killTweensOf(label);
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [isLoaded, isVisible]);

  return (
    <>
      <span
        ref={labelRef}
        className={`pointer-events-none fixed right-12 top-1/2 z-[60] hidden -translate-y-1/2 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.22em] text-white mix-blend-difference opacity-0 md:right-16 md:block ${isVisible ? '' : '!opacity-0'}`}
        aria-hidden="true"
        data-scroll-section-label
      />
      <div className={`fixed right-6 top-1/4 z-[60] hidden h-1/2 w-px bg-black/10 mix-blend-difference transition-opacity duration-500 md:right-10 md:block ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="scroll-progress-indicator h-full w-full origin-top scale-y-0 bg-[#0b0b0b] shadow-[0_0_10px_rgba(11,11,11,0.25)]" />
      </div>
    </>
  );
};

export default ScrollProgressRail;
