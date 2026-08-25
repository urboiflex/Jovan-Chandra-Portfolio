import { forwardRef, useLayoutEffect, useRef, useState } from 'react';

import SplitHoverText from './SplitHoverText.jsx';
import {
  getWorksStickyExitDistance,
  getWorksThumbnailPlacement,
  shouldInitializeWorksArchive,
} from './worksArchive.js';
import './WorksArchiveView.css';

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

const getCompactStatement = (description) => (
  description.match(/^.*?[.!?](?=\s+[A-Z]|$)/)?.[0]?.trim() || description
);

const WorksArchiveView = forwardRef(function WorksArchiveView({
  projects,
  isLoaded = true,
  onBack,
  onProjectClick,
}, titleRef) {
  const rootRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    if (!rootRef.current || !shouldInitializeWorksArchive({
      isLoaded,
      hasGsap: Boolean(window.gsap),
      hasScrollTrigger: Boolean(window.ScrollTrigger),
    })) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return undefined;

    const gsap = window.gsap;
    const thumbnails = Array.from(rootRef.current.querySelectorAll('[data-works-thumbnail]'));
    const allImages = Array.from(rootRef.current.querySelectorAll('[data-gsap-image]'));
    const progress = rootRef.current.querySelector('[data-works-progress]');
    const sticky = rootRef.current.querySelector('[data-works-sticky]');
    const stickyExitDistance = getWorksStickyExitDistance(false);

    const context = gsap.context(() => {
      allImages.forEach((image) => {
        gsap.fromTo(image,
          { scale: 1.055, yPercent: 2 },
          {
            scale: 1,
            yPercent: -2,
            ease: 'none',
            scrollTrigger: {
              trigger: image.closest('button, figure') || image,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.75,
            },
          });
      });

      if (window.innerWidth < 769) return;

      thumbnails.forEach((thumbnail, index) => {
        const media = thumbnail.querySelector('[data-works-thumbnail-media]');

        window.ScrollTrigger.create({
          trigger: thumbnail,
          start: 'top-=1 50%',
          end: 'bottom+=120 50%',
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });

        gsap.timeline({
          scrollTrigger: {
            trigger: thumbnail,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
          },
        })
          .from(media, { scale: 0.78, opacity: 0.32, duration: 1 }, 0)
          .to(media, { scale: 0.78, opacity: 0.32, duration: 1 }, 1);
      });

      if (progress) {
        gsap.fromTo(progress, { scaleX: 0 }, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        });
      }

      if (sticky && stickyExitDistance !== 0) {
        gsap.to(sticky, {
          y: `${stickyExitDistance}vh`,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'bottom bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, rootRef);

    return () => context.revert();
  }, [isLoaded, projects]);

  const animateHero = (button, entering) => {
    if (!window.gsap) return;
    const image = button.querySelector('[data-gsap-image]');
    const cue = button.querySelector('[data-project-arrow]');
    window.gsap.to(image, {
      scale: entering ? 1.025 : 1,
      duration: entering ? 0.9 : 0.75,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    window.gsap.to(cue, {
      autoAlpha: entering ? 1 : 0,
      scale: entering ? 1 : 0.68,
      duration: entering ? 0.55 : 0.35,
      ease: entering ? 'back.out(1.7)' : 'power2.in',
      overwrite: 'auto',
    });
  };

  return (
    <section ref={rootRef} className="works-archive" aria-labelledby="works-archive-title">
      <h1 ref={titleRef} id="works-archive-title" className="works-archive__title" tabIndex="-1">Works</h1>

      <button type="button" className="works-archive__back project-link" aria-label="Back" onClick={onBack} data-detail-back>
        <SplitHoverText text="back" height="15px" distance="14px" />
      </button>

      <div className="works-archive__content" data-detail-main>
        <div className="works-archive__desktop" aria-hidden="false">
        <div className="works-archive__sticky" data-works-sticky>
          <span className="works-archive__rule" aria-hidden="true"><span data-works-progress /></span>

          {projects.map((project, index) => (
            <article
              key={project.id}
              className={`works-archive__panel ${activeIndex === index ? 'is-active' : ''}`}
              data-works-panel={project.id}
              aria-hidden={activeIndex !== index}
            >
              <div className="works-archive__copy">
                <p className="works-archive__statement">{getCompactStatement(project.desc)}</p>
                <div className="works-archive__project-meta">
                  <p>{project.roles}</p>
                  <p>{project.tools.join(' · ')}</p>
                </div>
              </div>

              <button
                type="button"
                className="works-archive__hero project-link"
                data-hide-project-cursor
                aria-label={`Open ${project.title}`}
                onClick={() => onProjectClick(project.id)}
                onMouseEnter={(event) => animateHero(event.currentTarget, true)}
                onMouseLeave={(event) => animateHero(event.currentTarget, false)}
                onFocus={(event) => animateHero(event.currentTarget, true)}
                onBlur={(event) => animateHero(event.currentTarget, false)}
                tabIndex={activeIndex === index ? 0 : -1}
              >
                <img data-gsap-image src={project.img} alt={`${project.title} website preview`} />
                <span className="works-archive__open-cue" data-project-arrow aria-hidden="true"><ArrowIcon /></span>
              </button>

              <div className="works-archive__identity">
                <button type="button" onClick={() => onProjectClick(project.id)} tabIndex={activeIndex === index ? 0 : -1}>
                  {project.title}
                </button>
                <p>{project.category}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="works-archive__rail" aria-label="Project index">
          {projects.map((project, index) => {
            const placement = getWorksThumbnailPlacement(index);
            return (
              <button
                key={project.id}
                type="button"
                className="works-archive__thumbnail project-link"
                data-works-thumbnail={project.id}
                aria-label={`Open ${project.title}`}
                onClick={() => onProjectClick(project.id)}
              >
                <span
                  data-works-thumbnail-media
                  style={{
                    '--works-thumb-left': `${placement.left}%`,
                    '--works-thumb-width': `${placement.width}%`,
                    '--works-thumb-aspect': placement.aspect,
                  }}
                >
                  <img data-gsap-image src={project.img} alt="" />
                </span>
              </button>
            );
          })}
        </div>
        </div>

        <div className="works-archive__mobile">
          {projects.map((project) => (
            <article key={project.id} className="works-archive__mobile-project">
              <button type="button" onClick={() => onProjectClick(project.id)} aria-label={`Open ${project.title}`}>
                <img data-gsap-image src={project.img} alt={`${project.title} website preview`} />
                <span className="works-archive__mobile-arrow" aria-hidden="true"><ArrowIcon /></span>
              </button>
              <div><h2>{project.title}</h2><p>{project.category}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});

export default WorksArchiveView;
