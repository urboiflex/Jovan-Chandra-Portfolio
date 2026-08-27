import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import {
  getNextOpenSkillGroup,
  getSkillPanelTransition,
  getLineTextContrastState,
  getStableLineContrastState,
  getLineSampleCount,
  getLineProgressFromDashOffset,
  getLineDashOffsetForProgress,
  SKILL_GROUPS,
  SKILLS_LINE_SCROLL_TRIGGER,
} from './skills.js';
import SplitHoverText from './SplitHoverText.jsx';

const panelMotion = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
};

const getContrastLayout = (element) => {
  const elementRect = element.getBoundingClientRect();
  const lineElements = Array.from(element.children);
  const elements = lineElements.length > 0 ? lineElements : [element];

  return {
    children: elements
      .map((child) => {
        const rect = child.getBoundingClientRect();
        return {
          left: rect.left - elementRect.left,
          top: rect.top - elementRect.top,
          right: rect.right - elementRect.left,
          bottom: rect.bottom - elementRect.top,
          width: rect.width,
          height: rect.height,
        };
      })
      .filter((rect) => rect.width > 0 && rect.height > 0),
  };
};

const getLineScreenGeometry = (linePath, lineSvg, drawnLength, strokeWidth) => {
  if (drawnLength <= 0) return null;

  const svgRect = lineSvg.getBoundingClientRect();
  const scale = Math.max(svgRect.width / 1400, svgRect.height / 1400);
  const xOffset = svgRect.left + ((svgRect.width - (1400 * scale)) / 2);
  const yOffset = svgRect.top + ((svgRect.height - (1400 * scale)) / 2);
  const padding = (strokeWidth * scale) / 2 + 2;
  const sampleCount = getLineSampleCount(drawnLength);
  const points = [];

  for (let index = 0; index <= sampleCount; index += 1) {
    const point = linePath.getPointAtLength((drawnLength * index) / sampleCount);
    points.push({
      x: xOffset + (point.x * scale),
      y: yOffset + (point.y * scale),
    });
  }

  return { padding, points };
};

const lineOverlapsElement = (geometry, elementRect, layout) => {
  if (!geometry || !layout || layout.children.length === 0) return false;

  return geometry.points.some((screenPoint) => {
    const localPoint = {
      x: screenPoint.x - elementRect.left,
      y: screenPoint.y - elementRect.top,
    };

    return layout.children.some((rect) => (
      localPoint.x >= rect.left - geometry.padding
      && localPoint.x <= rect.right + geometry.padding
      && localPoint.y >= rect.top - geometry.padding
      && localPoint.y <= rect.bottom + geometry.padding
    ));
  });
};

const getLineStrokeClipPath = (geometry, elementRect) => {
  if (!geometry) return 'none';
  const leftEdge = [];
  const rightEdge = [];

  geometry.points.forEach((point, index) => {
    const previous = geometry.points[Math.max(0, index - 1)];
    const next = geometry.points[Math.min(geometry.points.length - 1, index + 1)];
    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    const tangentLength = Math.hypot(dx, dy) || 1;
    const normalX = -dy / tangentLength;
    const normalY = dx / tangentLength;

    leftEdge.push({
      x: point.x + (normalX * geometry.padding),
      y: point.y + (normalY * geometry.padding),
    });
    rightEdge.push({
      x: point.x - (normalX * geometry.padding),
      y: point.y - (normalY * geometry.padding),
    });
  });

  const polygonPoints = [...leftEdge, ...rightEdge.reverse()]
    .map((point) => `${point.x - elementRect.left}px ${point.y - elementRect.top}px`)
    .join(', ');

  return `polygon(${polygonPoints})`;
};

const SkillsAccordion = ({ sectionRef, isLoaded = false }) => {
  const [openSkillGroup, setOpenSkillGroup] = useState(SKILL_GROUPS[0].id);
  const prefersReducedMotion = useReducedMotion();
  const linePathRef = useRef(null);
  const lineSvgRef = useRef(null);
  const headingRef = useRef(null);
  const contrastCopyRef = useRef(null);
  const refreshFrameRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef?.current;
    const linePath = linePathRef.current;
    const lineSvg = lineSvgRef.current;
    const heading = headingRef.current;
    const contrastCopy = contrastCopyRef.current;

    if (!section || !linePath || !lineSvg || !heading || !contrastCopy || !isLoaded || !window.gsap || !window.ScrollTrigger) return undefined;

    const baseTextColor = window.getComputedStyle(heading).color;
    const lineColor = window.getComputedStyle(linePath).stroke;
    const strokeWidth = Number.parseFloat(window.getComputedStyle(linePath).strokeWidth) || 0;
    let lastProcessedLength = Number.NEGATIVE_INFINITY;
    let stableContrastState = 'dark';
    let clearFrames = 0;
    let contrastLayout = getContrastLayout(contrastCopy);
    const contrastResizeObserver = typeof window.ResizeObserver === 'function'
      ? new window.ResizeObserver(() => {
        contrastLayout = getContrastLayout(contrastCopy);
      })
      : null;
    contrastResizeObserver?.observe(contrastCopy);
    const resetContrast = () => {
      stableContrastState = 'dark';
      clearFrames = 0;
      contrastCopy.classList.remove('is-line-contrast');
      contrastCopy.style.clipPath = 'none';
    };

    const context = window.gsap.context(() => {
      const lineLength = linePath.getTotalLength();

      window.gsap.set(linePath, {
        strokeDasharray: lineLength,
        strokeDashoffset: prefersReducedMotion ? 0 : lineLength,
      });

      resetContrast();

      if (!prefersReducedMotion) {
        window.gsap.to(linePath, {
          strokeDashoffset: 0,
          ease: 'none',
          onUpdate: () => {
            const currentOffset = Number.parseFloat(window.gsap.getProperty(linePath, 'strokeDashoffset')) || 0;
            const drawnLength = Math.max(0, lineLength - currentOffset);
            const isFinished = drawnLength >= lineLength - 1;
            if (!isFinished && Math.abs(drawnLength - lastProcessedLength) < 8) return;
            lastProcessedLength = drawnLength;
            const geometry = getLineScreenGeometry(linePath, lineSvg, drawnLength, strokeWidth);
            const contrastRect = contrastCopy.getBoundingClientRect();
            const sampledState = getLineTextContrastState({
              lineColor,
              textColor: baseTextColor,
              overlaps: !isFinished && lineOverlapsElement(geometry, contrastRect, contrastLayout),
            });
            const stableState = getStableLineContrastState({
              currentState: stableContrastState,
              nextState: sampledState,
              clearFrames,
            });

            stableContrastState = stableState.state;
            clearFrames = stableState.clearFrames;

            if (stableContrastState === 'light') {
              contrastCopy.style.clipPath = getLineStrokeClipPath(geometry, contrastRect);
              contrastCopy.classList.add('is-line-contrast');
            } else {
              resetContrast();
            }
          },
          onComplete: resetContrast,
          scrollTrigger: {
            trigger: section,
            ...SKILLS_LINE_SCROLL_TRIGGER,
          },
        });
      }
    }, section);

    return () => {
      if (refreshFrameRef.current !== null) {
        window.cancelAnimationFrame(refreshFrameRef.current);
        refreshFrameRef.current = null;
      }
      contrastResizeObserver?.disconnect();
      context.revert();
    };
  }, [isLoaded, prefersReducedMotion, sectionRef]);

  const toggleSkillGroup = (selectedId) => {
    setOpenSkillGroup((currentId) => getNextOpenSkillGroup(currentId, selectedId));
  };

  const refreshScrollGeometry = () => {
    if (refreshFrameRef.current !== null) {
      window.cancelAnimationFrame(refreshFrameRef.current);
    }

    refreshFrameRef.current = window.requestAnimationFrame(() => {
      refreshFrameRef.current = null;

      const linePath = linePathRef.current;
      const lineLength = linePath?.getTotalLength?.();
      const currentOffset = linePath && window.gsap
        ? Number.parseFloat(window.gsap.getProperty(linePath, 'strokeDashoffset'))
        : Number.NaN;
      const currentProgress = getLineProgressFromDashOffset(currentOffset, lineLength);

      window.ScrollTrigger?.refresh();

      if (linePath && Number.isFinite(lineLength) && Number.isFinite(currentOffset)) {
        window.gsap?.set(linePath, {
          strokeDashoffset: getLineDashOffsetForProgress(currentProgress, lineLength),
        });
      }
    });
  };

  return (
    <section ref={sectionRef} className="skills-stage" aria-labelledby="skills-heading" data-scroll-section="Skills">
      <svg
        ref={lineSvgRef}
        className="skills-fluid-line-svg"
        viewBox="0 0 1400 1400"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <path
          ref={linePathRef}
          id="skills-fluid-line"
          className="skills-fluid-line"
          d="M -80,0 C 300,-20 600,150 540,400 C 490,650 0,655 300,1050 C 600,1385 650,1250 850,1200 C 1050,1150 1350,1250 1540,1300"
        />
      </svg>

      <div className="skills-layout">
        <div className="skills-intro">
          <div className="skills-intro__copy">
            <p className="skills-intro__eyebrow">Skills</p>
            <h2
              id="skills-heading"
              ref={headingRef}
              className="skills-intro__title"
              aria-label="From ideas to working digital products."
            >
              <span className="block" aria-hidden="true">From ideas to</span>
              <span className="block" aria-hidden="true">working digital</span>
              <span className="block" aria-hidden="true">products.</span>
            </h2>
            <p className="skills-intro__summary">
              I work across design, development, data, and automation, choosing the right tools for each problem.
            </p>
            <a className="skills-intro__contact group project-link" href="mailto:jovan.rc1212@gmail.com">
              <SplitHoverText text="Contact me" /> <span aria-hidden="true">↗</span>
            </a>
            <div ref={contrastCopyRef} className="skills-intro__contrast-copy" aria-hidden="true">
              <p className="skills-intro__eyebrow">Skills</p>
              <h2 className="skills-intro__title">
                <span className="block">From ideas to</span>
                <span className="block">working digital</span>
                <span className="block">products.</span>
              </h2>
              <p className="skills-intro__summary">
                I work across design, development, data, and automation, choosing the right tools for each problem.
              </p>
              <div className="skills-intro__contact">Contact me <span aria-hidden="true">↗</span></div>
            </div>
          </div>

        </div>

        <div className="skills-groups" aria-label="Skill disciplines">
          {SKILL_GROUPS.map((group) => {
            const isOpen = openSkillGroup === group.id;
            const buttonId = `skills-button-${group.id}`;
            const panelId = `skills-panel-${group.id}`;

            return (
              <div key={group.id} className={`skill-group${isOpen ? ' is-open' : ''}`}>
                <button
                  id={buttonId}
                  type="button"
                  className="skills-accordion-button skill-group__trigger"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleSkillGroup(group.id)}
                >
                  <span className="skill-group__title">{group.label}</span>
                  <span className="skill-group__icon" aria-hidden="true" />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="skill-group__panel"
                      {...panelMotion}
                      transition={getSkillPanelTransition(prefersReducedMotion)}
                      onAnimationComplete={refreshScrollGeometry}
                    >
                      <ul className="skill-group__list">
                        {group.skills.map((skill) => (
                          <li key={`${group.id}-${skill.name}`} className="skill-group__item">
                            {skill.name}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsAccordion;
