import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import {
  FEATURED_SLIDESHOW_DELAY_MS,
  FEATURED_SLIDESHOW_INTERVAL_MS,
  getFeaturedProjectBackground,
  getFeaturedProjectPhases,
  getFeaturedProjectsMotion,
  getNextFeaturedGalleryState,
} from './featuredProjects.js';
import './FeaturedProjectsSection.css';

function HoverImageGallery({ project, index }) {
  const images = useMemo(
    () => (project.gallery?.length ? project.gallery : [project.img]),
    [project.gallery, project.img],
  );
  const [galleryState, setGalleryState] = useState({
    activeIndex: 0,
    previousIndex: null,
    transition: 0,
  });
  const [isHovered, setIsHovered] = useState(false);
  const { activeIndex, previousIndex, transition } = galleryState;

  useEffect(() => {
    if (!isHovered || images.length <= 1) return undefined;

    const nextImage = new Image();
    nextImage.src = images[(activeIndex + 1) % images.length];
    return () => { nextImage.src = ''; };
  }, [activeIndex, images, isHovered]);

  useEffect(() => {
    if (images.length <= 1 || !isHovered) return undefined;

    let interval;
    const delay = window.setTimeout(() => {
      setGalleryState((current) => getNextFeaturedGalleryState(current, images.length));
      interval = window.setInterval(() => {
        setGalleryState((current) => getNextFeaturedGalleryState(current, images.length));
      }, FEATURED_SLIDESHOW_INTERVAL_MS);
    }, FEATURED_SLIDESHOW_DELAY_MS);

    return () => {
      window.clearTimeout(delay);
      if (interval) window.clearInterval(interval);
    };
  }, [images.length, isHovered]);

  return (
    <span
      className="featured-projects__foreground-frame"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setGalleryState({ activeIndex: 0, previousIndex: null, transition: 0 });
      }}
    >
      {previousIndex !== null && previousIndex !== activeIndex && (
        <img
          className="featured-projects__foreground featured-projects__foreground--previous"
          key={`${project.id}-previous-${previousIndex}-${transition}`}
          src={images[previousIndex]}
          alt=""
          aria-hidden="true"
          decoding="async"
        />
      )}
      <img
        className="featured-projects__foreground featured-projects__foreground--active"
        key={`${project.id}-active-${activeIndex}-${transition}`}
        src={images[activeIndex]}
        alt={`${project.title} project preview`}
        loading={index === 0 ? 'eager' : 'lazy'}
        decoding="async"
      />
    </span>
  );
}

export default function FeaturedProjectsSection({ isLoaded, projects, onProjectClick }) {
  const rootRef = useRef(null);
  const surfaceRef = useRef(null);

  useLayoutEffect(() => {
    if (!isLoaded || typeof window === 'undefined' || !window.gsap || !window.ScrollTrigger || !rootRef.current) {
      return undefined;
    }

    const gsap = window.gsap;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rows = Array.from(rootRef.current.querySelectorAll('[data-featured-project]'));
    const panes = Array.from(rootRef.current.querySelectorAll('[data-featured-pane]'));
    const details = Array.from(rootRef.current.querySelectorAll('[data-featured-details]'));

    if (reducedMotion) {
      gsap.set([...panes, ...details, surfaceRef.current], { clearProps: 'all' });
      return undefined;
    }

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      const takeoverOffset = () => {
        const viewportUnits = Number.parseFloat(
          getComputedStyle(rootRef.current).getPropertyValue('--featured-takeover-distance'),
        );
        return window.innerHeight * viewportUnits / 100;
      };

      gsap.set(surfaceRef.current, { y: takeoverOffset });
      gsap.to(surfaceRef.current, {
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top bottom',
          end: 'top 62%',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      const createProjectTimeline = (mobile) => {
        const baseMotion = getFeaturedProjectsMotion(false, mobile);
        const topPadding = Number.parseFloat(
          getComputedStyle(rootRef.current).getPropertyValue('--featured-first-project-gap'),
        ) || 0;
        const motion = { ...baseMotion, topPadding };
        const phases = getFeaturedProjectPhases(rows.length, motion);
        const totalDuration = rows.length * (motion.expandedHeight + motion.rowPadding)
          + motion.topPadding
          + 100;

        gsap.set(surfaceRef.current, {
          height: `${rows.length * (motion.expandedHeight + motion.rowPadding) + motion.topPadding}svh`,
        });
        gsap.set(panes, {
          width: mobile ? `${motion.restingWidth}%` : `${motion.restingWidth}vw`,
          height: `${motion.restingHeight}svh`,
        });
        gsap.set(details, { autoAlpha: 0 });

        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: rootRef.current,
            start: motion.sectionStart,
            end: motion.sectionEnd,
            scrub: motion.scrub,
            invalidateOnRefresh: true,
          },
        });

        panes.forEach((pane, index) => {
          const phase = phases[index];
          const detail = details[index];

          timeline.fromTo(pane, {
            height: `${motion.restingHeight}svh`,
          }, {
            height: `${motion.expandedHeight}svh`,
            duration: phase.heightEnd - phase.heightStart,
          }, phase.heightStart);

          timeline.fromTo(detail, {
            autoAlpha: 0,
          }, {
            autoAlpha: 1,
            duration: 20,
          }, phase.infoFadeStart);

          if (motion.useWidthCycle) {
            timeline.fromTo(pane, {
              width: `${motion.restingWidth}vw`,
            }, {
              width: `${motion.expandedWidth}vw`,
              duration: phase.widthGrowEnd - phase.heightStart,
            }, phase.heightStart);

            timeline.fromTo(pane, {
              width: `${motion.expandedWidth}vw`,
            }, {
              width: `${motion.restingWidth}vw`,
              duration: phase.widthShrinkEnd - phase.widthShrinkStart,
              immediateRender: false,
            }, phase.widthShrinkStart);
          }
        });

        timeline.to({}, { duration: 0.01 }, totalDuration);
        return () => timeline.kill();
      };

      media.add('(min-width: 1025px)', () => createProjectTimeline(false));
      media.add('(max-width: 1024px)', () => createProjectTimeline(true));
    }, rootRef);

    window.ScrollTrigger.refresh();

    return () => {
      media.revert();
      context.revert();
    };
  }, [isLoaded, projects]);

  return (
    <section
      id="work"
      ref={rootRef}
      className="featured-projects"
      aria-labelledby="featured-projects-title"
      data-scroll-section="Projects"
    >
      <div ref={surfaceRef} className="featured-projects__surface">
        <h2 id="featured-projects-title" className="featured-projects__sr-title">Featured projects</h2>

        <div className="featured-projects__rows">
          {projects.map((project, index) => (
            <article className="featured-projects__project" data-featured-project key={project.id}>
              <button
                type="button"
                className="featured-projects__pane"
                data-featured-pane
                data-featured-project-trigger
                aria-label={`View ${project.title}`}
                onClick={() => onProjectClick(project.id)}
              >
                <img
                  className="featured-projects__backdrop"
                  data-featured-backdrop
                  src={getFeaturedProjectBackground(project)}
                  alt=""
                  aria-hidden="true"
                />
                <span className="featured-projects__veil" aria-hidden="true" />
                <HoverImageGallery project={project} index={index} />
              </button>

              <div className="featured-projects__details" data-featured-details>
                <button type="button" className="featured-projects__title-link" onClick={() => onProjectClick(project.id)}>
                  <span className="featured-projects__title-text">{project.title}</span>
                  <small>[Open]</small>
                </button>
                <div className="featured-projects__meta">
                  <p className="featured-projects__technologies" data-featured-technologies="true">
                    {project.featuredTools.join(' · ')}
                  </p>
                  <p className="featured-projects__project-type" data-featured-project-type="true">
                    {project.category}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
