import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  PROJECT_MODAL_SLIDE_INTERVAL_MS,
  getAdjacentProjectId,
  getProjectVisitUrl,
  preloadProjectGallery,
} from './projectModal.js';
import { getCompactProjectTools } from './projectTechnology.js';
import './ProjectShowcaseModal.css';

export default function ProjectShowcaseModal({
  project,
  projects,
  onClose,
  onSelectProject,
  scrollController,
}) {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const visualRef = useRef(null);
  const closeRef = useRef(null);
  const closingRef = useRef(false);
  const switchingRef = useRef(false);
  const previousProjectRef = useRef(project.id);
  const previousSlideRef = useRef(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [readyProjectId, setReadyProjectId] = useState(null);

  const gallery = useMemo(
    () => (project.gallery?.length ? project.gallery : [project.img]),
    [project],
  );
  const visitUrl = getProjectVisitUrl(project);
  const galleryReady = readyProjectId === project.id;
  const reducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    if (!window.gsap || reducedMotion) {
      onClose();
      return;
    }

    window.gsap.to(rootRef.current, {
      autoAlpha: 0,
      duration: 0.32,
      ease: 'power2.inOut',
      onComplete: onClose,
    });
  }, [onClose, reducedMotion]);

  const selectAdjacentProject = useCallback((direction) => {
    if (switchingRef.current) return;

    const projectId = getAdjacentProjectId(projects, project.id, direction);
    if (!projectId || projectId === project.id) return;

    switchingRef.current = true;

    const commit = () => onSelectProject(projectId);
    if (!window.gsap || reducedMotion) {
      commit();
      return;
    }

    window.gsap.to(panelRef.current, {
      autoAlpha: 0,
      duration: 0.24,
      ease: 'power2.inOut',
      onComplete: commit,
    });
  }, [onSelectProject, project.id, projects, reducedMotion]);

  useLayoutEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    scrollController?.stop?.();
    closeRef.current?.focus({ preventScroll: true });

    if (!window.gsap || reducedMotion) {
      if (rootRef.current) rootRef.current.style.opacity = '1';
      return () => {
        document.body.style.overflow = originalOverflow;
        scrollController?.start?.();
      };
    }

    const tween = window.gsap.fromTo(rootRef.current, {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      duration: 0.36,
      ease: 'power2.out',
    });

    return () => {
      tween.kill();
      document.body.style.overflow = originalOverflow;
      scrollController?.start?.();
    };
  }, [reducedMotion, scrollController]);

  useLayoutEffect(() => {
    if (previousProjectRef.current === project.id) return;
    previousProjectRef.current = project.id;
    previousSlideRef.current = 0;
    setActiveSlide(0);

    if (!window.gsap || reducedMotion) {
      switchingRef.current = false;
      return;
    }

    window.gsap.fromTo(panelRef.current, {
      autoAlpha: 0,
    }, {
      autoAlpha: 1,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => { switchingRef.current = false; },
    });
  }, [project.id, reducedMotion]);

  useEffect(() => {
    let cancelled = false;

    preloadProjectGallery(gallery).then(() => {
      if (!cancelled) setReadyProjectId(project.id);
    });

    return () => { cancelled = true; };
  }, [gallery, project.id]);

  useEffect(() => {
    if (!galleryReady || gallery.length < 2 || reducedMotion) return undefined;

    const interval = window.setInterval(() => {
      setActiveSlide((current) => {
        previousSlideRef.current = current;
        return (current + 1) % gallery.length;
      });
    }, PROJECT_MODAL_SLIDE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [gallery.length, galleryReady, project.id, reducedMotion]);

  useLayoutEffect(() => {
    const slides = visualRef.current?.querySelectorAll('[data-project-modal-slide]');
    if (!slides?.length || !window.gsap || reducedMotion) return;

    const previousIndex = previousSlideRef.current;
    const nextSlide = slides[activeSlide];

    window.gsap.killTweensOf(slides);
    if (previousIndex === activeSlide) {
      window.gsap.set(slides, { autoAlpha: 0 });
      window.gsap.set(nextSlide, { autoAlpha: 1 });
      return;
    }

    const previousSlide = slides[previousIndex];
    window.gsap.timeline()
      .fromTo(previousSlide, { autoAlpha: 1 }, {
        autoAlpha: 0,
        duration: 0.78,
        ease: 'power2.inOut',
      }, 0)
      .fromTo(nextSlide, { autoAlpha: 0 }, {
        autoAlpha: 1,
        duration: 0.78,
        ease: 'power2.inOut',
      }, 0);
  }, [activeSlide, project.id, reducedMotion]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        selectAdjacentProject(-1);
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        selectAdjacentProject(1);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusable = [...panelRef.current.querySelectorAll('button, a[href]')]
        .filter((element) => !element.hasAttribute('disabled'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [requestClose, selectAdjacentProject]);

  return (
    <div
      ref={rootRef}
      className="project-modal"
      data-project-modal
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        className="project-modal__backdrop"
        aria-hidden="true"
        onClick={requestClose}
      />

      <section ref={panelRef} className="project-modal__panel">
        <div ref={visualRef} className="project-modal__visual">
          <img className="project-modal__ambient" src={project.bgImg || project.img} alt="" aria-hidden="true" />
          <span className="project-modal__visual-veil" aria-hidden="true" />
          <div className="project-modal__gallery">
            {gallery.map((src, index) => (
              <img
                key={`${project.id}-${index}`}
                src={src}
                alt={index === activeSlide ? `${project.title} screenshot ${index + 1}` : ''}
                aria-hidden={index !== activeSlide}
                data-project-modal-slide
                style={{ opacity: index === activeSlide ? 1 : 0 }}
              />
            ))}
          </div>
          <span className="project-modal__slide-count" aria-hidden="true">
            {String(activeSlide + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}
          </span>
        </div>

        <div className="project-modal__details">
          <button
            ref={closeRef}
            type="button"
            className="project-modal__close"
            aria-label="Close project details"
            onClick={requestClose}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>

          <h2 id="project-modal-title" className="project-modal__title">{project.title}</h2>
          <p className="project-modal__summary">{project.modalSummary || project.summary || project.desc}</p>

          <div className="project-modal__footer">
            <div className="project-modal__meta">
              <p>{project.category}</p>
              <p>Role: {project.roles}</p>
              {project.tools?.length > 0 && <p>{getCompactProjectTools(project.tools).join(', ')}</p>}
            </div>

            <div className="project-modal__actions">
              {visitUrl && (
                <a href={visitUrl} target="_blank" rel="noopener noreferrer" className="project-modal__visit">
                  Visit <span aria-hidden="true">↗</span>
                </a>
              )}
              <div className="project-modal__navigation" aria-label="Project navigation">
                <button type="button" aria-label="Previous project" onClick={() => selectAdjacentProject(-1)}>←</button>
                <button type="button" aria-label="Next project" onClick={() => selectAdjacentProject(1)}>→</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
