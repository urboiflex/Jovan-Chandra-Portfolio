import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import {
  clampHandoffProgress,
  createHandoffNavigator,
  getCaseHeroParallaxMotion,
  getCaseMilestoneTrigger,
  getHandoffScrollTriggerConfig,
  getHandoffLabels,
  getMilestoneProgressMotion,
  shouldCompleteHandoff,
  shouldInitializeCaseStudy,
} from './caseStudyMotion.js';
import SplitHoverText from './SplitHoverText.jsx';
import './ProjectCaseStudyView.css';

export default function ProjectCaseStudyView({
  project,
  nextProject,
  currentProjectIndex = 0,
  projectCount = 1,
  onBack,
  onNext,
  isLoaded = true,
}) {
  const projectLink = project.visitUrl || project.githubUrl;
  const projectLinkLabel = project.visitUrl ? 'Live site' : 'GitHub';
  const rootRef = useRef(null);
  const handoffLockedRef = useRef(false);
  const handoffDirectionRef = useRef(1);
  const handoffDestinationRef = useRef({ nextProject, onNext, onBack });
  const handoffNavigatorRef = useRef(null);
  const [activeScreen, setActiveScreen] = useState(0);
  const gallery = project.gallery?.length ? project.gallery : [project.img];
  const handoffLabels = getHandoffLabels(currentProjectIndex, projectCount);
  const handoffTitle = nextProject ? nextProject.title : 'Works';

  useLayoutEffect(() => {
    handoffDestinationRef.current = { nextProject, onNext, onBack };
  }, [nextProject, onBack, onNext]);

  useLayoutEffect(() => {
    handoffNavigatorRef.current = createHandoffNavigator({
      destinationRef: handoffDestinationRef,
      lockRef: handoffLockedRef,
      schedule: (callback) => window.requestAnimationFrame(callback),
    });
    return () => { handoffNavigatorRef.current = null; };
  }, []);

  const navigateToDestination = useCallback(() => handoffNavigatorRef.current?.(), []);

  useLayoutEffect(() => {
    handoffLockedRef.current = false;
    if (!rootRef.current || !shouldInitializeCaseStudy({
      isLoaded,
      hasGsap: Boolean(window.gsap),
      hasScrollTrigger: Boolean(window.ScrollTrigger),
    })) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return undefined;

    const gsap = window.gsap;
    const screens = Array.from(rootRef.current.querySelectorAll('[data-case-study-screen]'));
    const milestones = Array.from(rootRef.current.querySelectorAll('[data-screen-milestone]'));
    const progress = rootRef.current.querySelector('[data-milestone-progress]');
    const screenSequence = rootRef.current.querySelector('[data-screen-sequence]');

    const activateScreen = (index) => {
      setActiveScreen(index);
      gsap.to(milestones, {
        x: (itemIndex) => (itemIndex === index ? 8 : 0),
        opacity: (itemIndex) => (itemIndex === index ? 1 : 0.35),
        duration: 0.5,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    const context = gsap.context(() => {
      gsap.fromTo('[data-case-intro]',
        { y: 42, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.05, stagger: 0.08, ease: 'expo.out' });

      const heroImage = rootRef.current.querySelector('[data-case-hero-image]');
      const heroMedia = heroImage.closest('.case-study__hero-media');
      gsap.fromTo(heroMedia,
        { clipPath: 'inset(10% 8% 10% 8%)', scale: 1.08 },
        { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.4, ease: 'expo.inOut' });

      const heroMotion = getCaseHeroParallaxMotion();
      gsap.to(heroImage, {
        yPercent: heroMotion.yPercent,
        ease: heroMotion.ease,
        scrollTrigger: {
          trigger: heroImage,
          ...heroMotion.scrollTrigger,
        },
      });

      gsap.utils.toArray('[data-case-reveal]').forEach((element) => {
        gsap.fromTo(element,
          { y: 64, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'expo.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          });
      });

      screens.forEach((screen, index) => {
        window.ScrollTrigger.create({
          trigger: screen,
          ...getCaseMilestoneTrigger(),
          onEnter: () => activateScreen(index),
          onEnterBack: () => activateScreen(index),
        });
      });

      if (progress && screenSequence) {
        const progressMotion = getMilestoneProgressMotion(window.innerWidth <= 768);
        gsap.fromTo(progress, progressMotion.from, {
          ...progressMotion.to,
          ease: 'none',
          scrollTrigger: {
            trigger: screenSequence,
            start: 'top 52%',
            end: 'bottom 52%',
            scrub: 0.45,
          },
        });
      }

      const handoff = rootRef.current.querySelector('[data-case-handoff]');
      if (handoff) {
        const handoffPanel = handoff.querySelector('.case-study__handoff-panel');
        const handoffFill = handoff.querySelector('[data-handoff-progress]');
        const handoffInvert = handoff.querySelector('[data-handoff-invert]');

        const handoffTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: handoff,
            ...getHandoffScrollTriggerConfig({
              bannerHeight: handoffPanel?.offsetHeight,
              pin: rootRef.current,
              onUpdate: (self) => {
                handoffDirectionRef.current = self.direction;
              },
              onScrubComplete: (self) => {
                const progressValue = clampHandoffProgress(self.progress);
                if (shouldCompleteHandoff({
                  progress: progressValue,
                  direction: handoffDirectionRef.current,
                  isLocked: handoffLockedRef.current,
                  reducedMotion,
                })) {
                  navigateToDestination();
                }
              },
            }),
          },
        });

        handoffTimeline
          .to({}, { duration: 0.12 })
          .fromTo(handoffFill, { scaleX: 0 }, { scaleX: 1, duration: 0.88, ease: 'none' }, 0.12)
          .fromTo(handoffInvert,
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 0.88, ease: 'none' }, 0.12);
      }
    }, rootRef);

    return () => context.revert();
  }, [project.id, gallery.length, isLoaded, navigateToDestination]);

  const scrollToScreen = (index) => {
    const target = rootRef.current?.querySelector(`[data-case-study-screen="${index + 1}"]`);
    if (!target) return;
    if (window.portfolioLenis) {
      window.portfolioLenis.scrollTo(target, { offset: -48, duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <article ref={rootRef} className="case-study">
      <header className="case-study__header">
        <p data-case-intro>Website case study</p>
        <button type="button" className="case-study__back project-link group" aria-label="Back to Works" onClick={onBack}>
          <SplitHoverText text="Back" height="17px" distance="16px" />
        </button>
      </header>

      <section className="case-study__hero" aria-labelledby="case-study-title">
        <div className="case-study__heading" data-case-intro>
          <p>{project.category}</p>
          <h1 id="case-study-title">{project.title}</h1>
        </div>
        <p className="case-study__lead" data-case-intro>{project.desc}</p>
        <dl className="case-study__meta" data-case-intro>
          <div><dt>Role</dt><dd>{project.roles}</dd></div>
          <div><dt>Timeline</dt><dd>{project.duration}</dd></div>
          <div><dt>Technology</dt><dd>{project.tools.join(', ')}</dd></div>
          <div>
            <dt>{project.visitUrl ? 'Visit' : 'Source'}</dt>
            <dd><a href={projectLink} target="_blank" rel="noopener noreferrer">{projectLinkLabel} ↗</a></dd>
          </div>
        </dl>
      </section>

      <figure className="case-study__hero-media">
        <img data-case-image data-case-hero-image src={project.img} alt={`${project.title} homepage`} />
      </figure>

      <section className="case-study__overview" data-case-reveal>
        <h2>Overview</h2>
        <p>{project.summary || project.desc}</p>
        <div>
          <p>Built to balance visual impact with clarity, practical navigation, and a complete end-to-end website experience.</p>
          <ul>{project.tools.map((tool) => <li key={tool}>{tool}</li>)}</ul>
        </div>
      </section>

      <section className="case-study__screens" aria-labelledby="selected-screens-title">
        <aside className="case-study__milestones">
          <div className="case-study__milestone-heading">
            <p>Project journey</p>
            <h2 id="selected-screens-title">Selected screens</h2>
          </div>
          <nav aria-label="Selected screen milestones">
            <span className="case-study__milestone-track" aria-hidden="true">
              <span data-milestone-progress />
            </span>
            <ol>
              {gallery.map((source, index) => (
                <li key={`milestone-${project.id}-${source}`}>
                  <button
                    type="button"
                    data-screen-milestone={index + 1}
                    className={activeScreen === index ? 'is-active' : ''}
                    aria-current={activeScreen === index ? 'step' : undefined}
                    onClick={() => scrollToScreen(index)}
                  >
                    <span>{String(index + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="case-study__screen-sequence" data-screen-sequence>
          {gallery.map((source, index) => (
            <figure
              key={`${project.id}-${source}`}
              className={`case-study__screen case-study__screen--${(index % 3) + 1}`}
              data-case-study-screen={index + 1}
            >
              <span className="case-study__screen-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
              </span>
              <div className="case-study__screen-frame">
                <img data-case-screen-image src={source} alt={`${project.title} interface screen ${index + 1}`} />
              </div>
            </figure>
          ))}
        </div>
      </section>

      <footer className="case-study__handoff" data-case-handoff>
        <div className="case-study__handoff-panel">
          <div className="case-study__handoff-milestones" aria-hidden="true">
            <span>{handoffLabels.current}</span>
            <span>{handoffLabels.destination}</span>
          </div>
          <button
            type="button"
            className="case-study__handoff-link"
            aria-label={nextProject ? `Continue to ${nextProject.title}` : 'Return to Works'}
            onClick={navigateToDestination}
          >
            <span className="case-study__handoff-content" data-handoff-content>
              <span data-handoff-title>{handoffTitle}</span>
              <span className="case-study__handoff-arrow" data-handoff-arrow aria-hidden="true">↗</span>
            </span>
            <span className="case-study__handoff-fill" data-handoff-progress aria-hidden="true" />
            <span className="case-study__handoff-invert" data-handoff-invert aria-hidden="true">
              <span className="case-study__handoff-content" data-handoff-content>
                <span>{handoffTitle}</span>
                <span className="case-study__handoff-arrow" data-handoff-arrow>↗</span>
              </span>
            </span>
          </button>
        </div>
      </footer>
    </article>
  );
}
