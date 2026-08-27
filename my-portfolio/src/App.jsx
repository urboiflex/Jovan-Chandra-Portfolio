import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import EditorialHero from './EditorialHero.jsx';
import ProfileStorySection from './ProfileStorySection.jsx';
import FeaturedProjectsSection from './FeaturedProjectsSection.jsx';
import ProjectShowcaseModal from './ProjectShowcaseModal.jsx';
import SkillsAccordion from './SkillsAccordion.jsx';
import SignatureMarqueeSection from './SignatureMarqueeSection.jsx';
import CinematicContactSection from './CinematicContactSection.jsx';
import ScrollProgressRail from './ScrollProgressRail.jsx';
import SplitHoverText from './SplitHoverText.jsx';
import InfoView from './InfoView.jsx';
import ContactView from './ContactView.jsx';
import WorksArchiveView from './WorksArchiveView.jsx';
import ProjectCaseStudyView from './ProjectCaseStudyView.jsx';
import {
  createAnimationFrameLoop,
  getSmoothScrollOptions,
  resumeSmoothScroll,
  updateScrollProgress,
} from './smoothScroll.js';
import {
  createInfoTransitionPlan,
  getDetailArrivalReleaseTime,
  getDetailNavigationMode,
  getFlyingLabelHandoffTiming,
  getInfoTransitionSwapDelayMs,
  getPortfolioViewFromPath,
} from './infoTransition.js';
import { getProjectIdFromPath, getProjectPath } from './worksArchive.js';
import { restoreCaseStudyScroll } from './caseStudyMotion.js';
import {
  getFloatingNavigationActive,
  getNavigationMotion,
  getNavigationVisibility,
} from './navigationMotion.js';
import { PROJECTS_DATA } from './projectData.js';

const FloatingHomeNav = ({ currentView, onSection, isLoaded, isNavigating }) => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollYRef = useRef(0);
  const frameRef = useRef(null);
  const motionRef = useRef(null);

  useEffect(() => {
    if (currentView !== 'home') return undefined;

    lastScrollYRef.current = window.scrollY;
    const handleScroll = () => {
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        setIsVisible((visible) => getNavigationVisibility({
          currentY,
          previousY: lastScrollYRef.current,
          visible,
        }));
        lastScrollYRef.current = currentY;
        frameRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [currentView]);

  const navItems = [
    { label: 'works', target: 'works' },
    { label: 'info', target: 'info' },
    { label: 'contact', target: 'contact' },
  ];

  const isActive = getFloatingNavigationActive({ currentView, isVisible, isNavigating });

  useLayoutEffect(() => {
    if (!isLoaded || !window.gsap || !motionRef.current) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tween = window.gsap.to(
      motionRef.current,
      getNavigationMotion(isActive, reducedMotion, isNavigating),
    );

    return () => tween.kill();
  }, [isActive, isLoaded, isNavigating]);

  return (
    <nav
      className={`floating-home-nav fixed left-1/2 top-6 z-[70] w-[min(78vw,27rem)] -translate-x-1/2 bg-transparent text-white mix-blend-difference md:top-8
        ${isActive ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-label="Portfolio navigation"
      aria-hidden={!isActive}
    >
      <div ref={motionRef} className="flex w-full items-center justify-between will-change-transform" data-nav-motion="true">
        {navItems.map((item) => (
          <a
            key={item.target}
            href={`/${item.target}/`}
            data-nav-target={item.target}
            onClick={(event) => {
              if (!window.gsap) return;
              event.preventDefault();
              onSection(item.target, event.currentTarget);
            }}
            tabIndex={isActive ? 0 : -1}
            className="group project-link bg-transparent p-0 text-[11px] font-medium leading-[14px] tracking-[0.04em] text-current focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-current md:text-[12px] md:leading-[15px]"
          >
            <SplitHoverText text={item.label} height="15px" distance="14px" />
          </a>
        ))}
      </div>
    </nav>
  );
};

// --- Page Components ---

const HomeView = ({ isLoaded, onProjectClick, onSection }) => {
  const skillsRef = useRef(null);

  return (
    <>
      <EditorialHero isLoaded={isLoaded} />
      <ProfileStorySection isLoaded={isLoaded} />

      <FeaturedProjectsSection
        isLoaded={isLoaded}
        projects={PROJECTS_DATA}
        onProjectClick={onProjectClick}
      />

      <SkillsAccordion sectionRef={skillsRef} isLoaded={isLoaded} />

      <SignatureMarqueeSection isLoaded={isLoaded} />

      <CinematicContactSection isLoaded={isLoaded} onNavigate={onSection} />
    </>
  );
};

// --- Main Application ---
export default function App() {
  const mainRef = useRef(null);
  const loaderRef = useRef(null);
  const introNameRef = useRef(null);
  const transitionCurtainRef = useRef(null);
  const inkCurtainRef = useRef(null);
  const detailCoverRef = useRef(null);
  const detailFlyingTextRef = useRef(null);
  const infoTitleRef = useRef(null);
  const contactTitleRef = useRef(null);
  const worksTitleRef = useRef(null);
  const detailSourceRef = useRef(null);
  const detailArrivalRef = useRef(false);
  const returningFromDetailRef = useRef(false);
  const currentViewRef = useRef('home');
  const detailSwapTimerRef = useRef(null);
  
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);
  const [currentView, setCurrentView] = useState(() => getPortfolioViewFromPath(
    typeof window === 'undefined' ? '/' : window.location.pathname,
  ));
  const [selectedProjectId, setSelectedProjectId] = useState(() => (
    typeof window === 'undefined' ? null : getProjectIdFromPath(window.location.pathname)
  ));
  const [isNavigating, setIsNavigating] = useState(false);
  const [scrollController, setScrollController] = useState(null);
  const lenisRef = useRef(null);
  const projectTriggerRef = useRef(null);

  useEffect(() => {
    currentViewRef.current = currentView;
  }, [currentView]);

  useEffect(() => {
    const initialView = getPortfolioViewFromPath(window.location.pathname);
    window.history.replaceState({
      ...window.history.state,
      portfolioView: initialView,
      enteredFromHome: false,
    }, '', window.location.href);

    const handlePopState = () => {
      const nextView = getPortfolioViewFromPath(window.location.pathname);
      if (['info', 'contact', 'works'].includes(currentViewRef.current) && nextView === 'home') {
        returningFromDetailRef.current = true;
        window.gsap?.set(detailCoverRef.current, { opacity: 1, pointerEvents: 'auto' });
      }
      setSelectedProjectId(getProjectIdFromPath(window.location.pathname));
      setCurrentView(nextView);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => () => {
    if (detailSwapTimerRef.current !== null) window.clearTimeout(detailSwapTimerRef.current);
  }, []);

  useEffect(() => {
    let disposed = false;
    let scrollLoop = null;
    let lenis = null;
    let onScroll = null;

    const releaseWithoutAnimations = () => {
      if (disposed) return;
      setIsPageReady(true);
      if (loaderRef.current) loaderRef.current.style.display = 'none';
    };

    const runtimeFallbackTimer = window.setTimeout(releaseWithoutAnimations, 5000);

    const initializeMotion = () => {
      try {
        window.clearTimeout(runtimeFallbackTimer);
        window.gsap = gsap;
        window.ScrollTrigger = ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        const supportsSmoothScroll = window.innerWidth >= 1025
          && !('ontouchstart' in window)
          && navigator.maxTouchPoints === 0;

        if (supportsSmoothScroll) {
          lenis = new Lenis(getSmoothScrollOptions());
          lenisRef.current = lenis;
          setScrollController(lenis);
          window.portfolioLenis = lenis;
          lenis.stop();
          scrollLoop = createAnimationFrameLoop((time) => lenis.raf(time));
          scrollLoop.start();
        }
        setScriptsLoaded(true);

        onScroll = (event) => {
          window.ScrollTrigger.update();
          updateScrollProgress(event, window.gsap);
        };
        lenis?.on('scroll', onScroll);

        document.fonts?.ready.then(() => {
          if (!disposed) ScrollTrigger.refresh();
        });
      } catch (error) {
        console.error('Motion runtime initialization failed.', error);
        window.clearTimeout(runtimeFallbackTimer);
        releaseWithoutAnimations();
      }
    };
    initializeMotion();

    return () => {
      disposed = true;
      window.clearTimeout(runtimeFallbackTimer);
      scrollLoop?.stop();
      if (onScroll) lenis?.off?.('scroll', onScroll);
      lenis?.destroy();
      if (lenisRef.current === lenis) lenisRef.current = null;
      setScrollController(null);
      if (window.portfolioLenis === lenis) delete window.portfolioLenis;
    };
  }, []);

  useEffect(() => {
    if (!scriptsLoaded) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const byRevealOrder = (first, second) => (
      Number(first.dataset.introOrder) - Number(second.dataset.introOrder)
    );
    const givenLetters = Array.from(
      introNameRef.current.querySelectorAll('.name-intro__letter--given'),
    ).sort(byRevealOrder);
    const surnameLetters = Array.from(
      introNameRef.current.querySelectorAll('.name-intro__letter--surname'),
    ).sort(byRevealOrder);
    let pageReleased = false;

    const releasePage = () => {
      if (pageReleased) return;
      pageReleased = true;
      setIsPageReady(true);
    };

    const masterTl = window.gsap.timeline({
      onComplete: () => {
        releasePage();
        if (loaderRef.current) loaderRef.current.style.display = 'none';
        if (lenisRef.current) lenisRef.current.start();
      }
    });

    if (reduceMotion) {
      masterTl
        .set(introNameRef.current, { opacity: 1, scale: 1 })
        .set([...givenLetters, ...surnameLetters], {
          opacity: 1,
          yPercent: 0,
          rotate: 0,
          scale: 1,
          filter: 'blur(0px)',
        })
        .to(introNameRef.current, { opacity: 0, duration: 0.2, delay: 0.3, ease: 'none' })
        .call(releasePage)
        .to(loaderRef.current, { autoAlpha: 0, duration: 0.2, ease: 'none' });
    } else {
      masterTl
        .set(introNameRef.current, { opacity: 1, scale: 0.96 }, 0.1)
        .fromTo(
          givenLetters,
          { opacity: 0, yPercent: 115, rotate: 7, scale: 0.82, filter: 'blur(8px)' },
          {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.72,
            stagger: 0.075,
            ease: 'expo.out',
          },
          0.18,
        )
        .fromTo(
          surnameLetters,
          { opacity: 0, yPercent: 115, rotate: -7, scale: 0.82, filter: 'blur(8px)' },
          {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            scale: 1,
            filter: 'blur(0px)',
            duration: 0.72,
            stagger: 0.075,
            ease: 'expo.out',
          },
          0.18,
        )
        .to(introNameRef.current, { scale: 1, duration: 0.9, ease: 'power3.out' }, 0.18)
        .to(
          introNameRef.current,
          { opacity: 0, scale: 1.2, filter: 'blur(4px)', duration: 0.72, ease: 'power3.in' },
          1.72,
        )
        .call(releasePage, null, 1.9)
        .to(loaderRef.current, { yPercent: -100, duration: 1.05, ease: 'expo.inOut' }, 1.9);
    }

    return () => masterTl.kill();
  }, [scriptsLoaded]);

  useLayoutEffect(() => {
    if (!scriptsLoaded || !window.gsap) return undefined;

    const gsap = window.gsap;
    const cover = detailCoverRef.current;
    const flyingText = detailFlyingTextRef.current;

    if (['info', 'contact', 'works'].includes(currentView)) {
      const title = currentView === 'contact'
        ? contactTitleRef.current
        : currentView === 'works'
          ? worksTitleRef.current
          : infoTitleRef.current;
      const main = document.querySelector('[data-detail-main]');
      const back = document.querySelector('[data-detail-back]');
      const footer = document.querySelector('[data-detail-footer]');
      const arrivedFromNavigation = detailArrivalRef.current;
      detailArrivalRef.current = false;

      gsap.killTweensOf([cover, flyingText, title, main, back, footer]);

      if (!arrivedFromNavigation) {
        gsap.set(cover, { opacity: 0, pointerEvents: 'none' });
        gsap.set(flyingText, { opacity: 0 });
        gsap.set([title, main, back, footer], { opacity: 1 });
        setIsNavigating(false);
        window.requestAnimationFrame(() => title?.focus({ preventScroll: true }));
        return undefined;
      }

      gsap.set(cover, { opacity: 1, pointerEvents: 'auto' });
      gsap.set(title, { opacity: 1 });
      gsap.set([main, back, footer], { opacity: 0 });

      const coverDelay = 0.1;
      const coverDuration = 0.9;
      const releaseTime = getDetailArrivalReleaseTime({ coverDelay, coverDuration });
      const releaseInteraction = () => {
        gsap.set(cover, { pointerEvents: 'none' });
        resumeSmoothScroll(lenisRef.current);
        setIsNavigating(false);
      };

      const timeline = gsap.timeline({
        onComplete: () => {
          title?.focus({ preventScroll: true });
        },
      });
      const labelHandoff = getFlyingLabelHandoffTiming();

      timeline
        .to(flyingText, {
          opacity: 0,
          duration: labelHandoff.duration,
          ease: 'power2.out',
        }, labelHandoff.delay)
        .to(cover, { opacity: 0, duration: coverDuration, ease: 'power2.out' }, coverDelay)
        .call(releaseInteraction, null, releaseTime)
        .to(main, { opacity: 1, duration: 1.1, ease: 'power2.out' }, 0.5)
        .to(back, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.7)
        .to(footer, { opacity: 1, duration: 0.7, ease: 'power2.out' }, 0.8);

      return () => timeline.kill();
    }

    if (returningFromDetailRef.current) {
      returningFromDetailRef.current = false;
      gsap.killTweensOf([cover, flyingText]);
      gsap.set(flyingText, { opacity: 0 });
      const tween = gsap.to(cover, {
        opacity: 0,
        duration: 0.65,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(cover, { pointerEvents: 'none' });
          setIsNavigating(false);
          if (detailSourceRef.current) {
            detailSourceRef.current.style.visibility = '';
            detailSourceRef.current = null;
          }
          if (lenisRef.current) lenisRef.current.start();
        },
      });
      return () => tween.kill();
    }

    return undefined;
  }, [currentView, scriptsLoaded]);

  const handleDetailNavigation = (view, sourceElement) => {
    const navigationMode = getDetailNavigationMode({
      hasSourceElement: Boolean(sourceElement),
      isNavigating,
      hasAnimationRuntime: Boolean(window.gsap),
    });

    if (navigationMode === 'blocked') return;

    if (navigationMode === 'immediate') {
      if (loaderRef.current) loaderRef.current.style.display = 'none';
      setIsPageReady(true);
      window.history.pushState({ portfolioView: view, enteredFromHome: true }, '', `/${view}/`);
      setCurrentView(view);
      window.scrollTo(0, 0);
      return;
    }

    const gsap = window.gsap;
    const sourceRect = sourceElement.getBoundingClientRect();
    const sourceStyle = window.getComputedStyle(sourceElement);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const plan = createInfoTransitionPlan({
      destinationView: view,
      sourceRect,
      sourceFontSize: Number.parseFloat(sourceStyle.fontSize),
      viewportWidth: window.innerWidth,
      prefersReducedMotion,
    });
    const swapDelay = getInfoTransitionSwapDelayMs(plan.timing);

    setIsNavigating(true);
    detailArrivalRef.current = true;
    detailSourceRef.current = sourceElement;
    sourceElement.style.visibility = 'hidden';
    lenisRef.current?.stop();

    detailFlyingTextRef.current.textContent = view === 'contact'
      ? 'Contact'
      : view === 'works'
        ? 'Works'
        : 'Info';
    gsap.killTweensOf([detailCoverRef.current, detailFlyingTextRef.current]);
    gsap.set(detailCoverRef.current, { opacity: 0, pointerEvents: 'auto' });
    gsap.set(detailFlyingTextRef.current, {
      left: plan.start.left,
      top: plan.start.top,
      fontSize: plan.start.fontSize,
      fontWeight: sourceStyle.fontWeight,
      lineHeight: sourceStyle.lineHeight,
      letterSpacing: sourceStyle.letterSpacing,
      opacity: 1,
      x: 0,
      y: 0,
    });

    gsap.timeline()
      .to(detailCoverRef.current, {
        opacity: 1,
        duration: plan.timing.coverDuration,
        ease: 'power2.inOut',
      }, 0)
      .to(detailFlyingTextRef.current, {
        left: plan.end.left,
        top: plan.end.top,
        fontSize: plan.end.fontSize,
        fontWeight: 400,
        lineHeight: plan.end.lineHeight,
        letterSpacing: plan.end.letterSpacing,
        duration: plan.timing.labelDuration,
        ease: 'power3.inOut',
      }, plan.timing.labelDelay);

    detailSwapTimerRef.current = window.setTimeout(() => {
      detailSwapTimerRef.current = null;
      window.history.pushState({ portfolioView: view, enteredFromHome: true }, '', `/${view}/`);
      setCurrentView(view);
      window.scrollTo(0, 0);
    }, swapDelay);
  };

  const handleDetailBack = () => {
    if (isNavigating || !window.gsap) return;

    const gsap = window.gsap;
    const title = currentView === 'contact'
      ? contactTitleRef.current
      : currentView === 'works'
        ? worksTitleRef.current
        : infoTitleRef.current;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsNavigating(true);

    const timeline = gsap.timeline({
      onComplete: () => {
        returningFromDetailRef.current = true;
        if (window.history.state?.enteredFromHome) {
          window.history.back();
          return;
        }
        window.history.replaceState({ portfolioView: 'home', enteredFromHome: false }, '', '/');
        setCurrentView('home');
      },
    });

    timeline
      .to(title, {
        opacity: 0,
        duration: prefersReducedMotion ? 0 : 0.4,
        ease: 'power2.inOut',
      }, 0)
      .to(detailCoverRef.current, {
        opacity: 1,
        duration: prefersReducedMotion ? 0 : 0.5,
        ease: 'power2.inOut',
        onStart: () => gsap.set(detailCoverRef.current, { pointerEvents: 'auto' }),
      }, prefersReducedMotion ? 0 : 0.1);
  };

  const handleSectionNavigation = (sectionId, sourceElement) => {
    if (['info', 'contact', 'works'].includes(sectionId)) {
      handleDetailNavigation(sectionId, sourceElement);
      return;
    }

    const section = document.getElementById(sectionId);
    if (!section) return;

    const offset = sectionId === 'contact' ? -120 : -24;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(section, { offset, duration: 1.25 });
      return;
    }

    const top = section.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const handleProjectOpen = (id) => {
    projectTriggerRef.current = document.activeElement;
    setSelectedProjectId(id);
  };

  const handleCaseStudyNavigation = (view, id, path, historyMethod = 'pushState') => {
    if (isNavigating || !window.gsap) return;

    const gsap = window.gsap;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsNavigating(true);
    lenisRef.current?.stop();
    gsap.killTweensOf(inkCurtainRef.current);
    gsap.set(inkCurtainRef.current, {
      backgroundColor: '#f5f5f2',
      opacity: 1,
      scaleY: 0,
      transformOrigin: 'bottom',
      pointerEvents: 'auto',
    });

    gsap.timeline({
      onComplete: () => {
        gsap.set(inkCurtainRef.current, {
          backgroundColor: '#070707',
          opacity: 1,
          scaleY: 0,
          pointerEvents: 'none',
        });
        lenisRef.current?.start();
        window.ScrollTrigger?.refresh();
        setIsNavigating(false);
      },
    })
      .to(inkCurtainRef.current, {
        scaleY: 1,
        duration: reducedMotion ? 0 : 1.15,
        ease: 'expo.inOut',
      })
      .call(() => {
        window.history[historyMethod]({ portfolioView: view, projectId: id }, '', path);
        setSelectedProjectId(id);
        setCurrentView(view);
        restoreCaseStudyScroll(
          lenisRef.current,
          () => window.scrollTo(0, 0),
          window.requestAnimationFrame,
          { resume: false },
        );
      })
      .to(inkCurtainRef.current, {
        opacity: 0,
        duration: reducedMotion ? 0 : 0.55,
        ease: 'power2.out',
      });
  };

  const handleWorkProjectOpen = (id) => {
    handleCaseStudyNavigation('project', id, getProjectPath(id));
  };

  const handleCaseStudyBack = () => {
    handleCaseStudyNavigation('works', null, '/works/', 'replaceState');
  };

  const handleNextCaseStudy = (id) => {
    handleCaseStudyNavigation('project', id, getProjectPath(id), 'replaceState');
  };

  const handleProjectClose = () => {
    setSelectedProjectId(null);
    window.requestAnimationFrame(() => projectTriggerRef.current?.focus?.({ preventScroll: true }));
  };

  const selectedProject = selectedProjectId ? PROJECTS_DATA.find(p => p.id === selectedProjectId) : null;
  const selectedProjectIndex = selectedProjectId ? PROJECTS_DATA.findIndex(p => p.id === selectedProjectId) : -1;
  const nextProject = selectedProjectIndex >= 0 && selectedProjectIndex < PROJECTS_DATA.length - 1 ? PROJECTS_DATA[selectedProjectIndex + 1] : null;

  return (
    <div ref={mainRef} className="min-h-screen w-full relative overflow-x-clip cursor-auto selection:bg-[#0b0b0b] selection:text-[#f5f5f2] bg-[#f5f5f2] text-[#0b0b0b]">
      {/* Grain noise overlay — premium tactile depth */}
      <div className="grain-overlay" aria-hidden="true" />

      <div ref={inkCurtainRef} className="fixed inset-0 bg-[#070707] z-[75] scale-y-0 origin-top pointer-events-none"></div>

      <div
        id="detail-transition-cover"
        ref={detailCoverRef}
        className="fixed inset-0 z-[10010] bg-[#f5f5f2] opacity-0 pointer-events-none"
        aria-hidden="true"
      />
      <div
        id="detail-transition-label"
        ref={detailFlyingTextRef}
        className="fixed z-[10011] whitespace-nowrap text-[#0b0b0b] opacity-0 pointer-events-none"
        style={{
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          lineHeight: 1.2,
          willChange: 'left, top, font-size',
        }}
        aria-hidden="true"
      >
        Info
      </div>

      <ScrollProgressRail isLoaded={isPageReady} isVisible={currentView === 'home'} />

      <div
        ref={loaderRef}
        className="name-intro pointer-events-none fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      >
        <div ref={introNameRef} className="name-intro__name" aria-label="Jovan Chandra">
          <span className="name-intro__given" aria-hidden="true">
            {'Jovan'.split('').map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="name-intro__letter name-intro__letter--given"
                data-intro-order={4 - index}
              >
                {letter}
              </span>
            ))}
          </span>
          <span className="name-intro__surname" aria-hidden="true">
            {'Chandra'.split('').map((letter, index) => (
              <span
                key={`${letter}-${index}`}
                className="name-intro__letter name-intro__letter--surname"
                data-intro-order={index}
              >
                {letter}
              </span>
            ))}
          </span>
        </div>
      </div>

      <FloatingHomeNav
        currentView={currentView}
        onSection={handleSectionNavigation}
        isLoaded={isPageReady}
        isNavigating={isNavigating}
      />

      {currentView === 'info' && (
        <InfoView ref={infoTitleRef} onBack={handleDetailBack} />
      )}

      {currentView === 'contact' && (
        <ContactView ref={contactTitleRef} onBack={handleDetailBack} />
      )}

      {currentView === 'works' && (
        <WorksArchiveView
          ref={worksTitleRef}
          isLoaded={isPageReady}
          projects={PROJECTS_DATA}
          onBack={handleDetailBack}
          onProjectClick={handleWorkProjectOpen}
        />
      )}

      {/* --- Main Content Container --- */}
      <main className={`relative z-50 transition-all duration-0
        ${currentView === 'project' ? 'px-0' : 'px-6 md:px-16 lg:px-24'}
        ${currentView === 'home' ? 'pt-0 pb-28 md:pb-32' : 'ml-0 pt-0'}
        ${currentView === 'works' ? 'pb-24 md:pb-32' : ''}
        ${currentView === 'project' ? 'pb-0' : ''}
      `}>
        <div ref={transitionCurtainRef} className={currentView === 'project' ? 'w-full' : 'w-full max-w-6xl mx-auto'}>
          {currentView === 'home' && (
            <HomeView
              isLoaded={isPageReady}
              onProjectClick={handleProjectOpen}
              onSection={handleSectionNavigation}
            />
          )}
          {currentView === 'project' && selectedProject && (
            <ProjectCaseStudyView
              isLoaded={isPageReady}
              project={selectedProject}
              nextProject={nextProject}
              currentProjectIndex={selectedProjectIndex}
              projectCount={PROJECTS_DATA.length}
              onBack={handleCaseStudyBack}
              onNext={handleNextCaseStudy}
            />
          )}
        </div>
      </main>

      {selectedProject && currentView !== 'project' && (
        <ProjectShowcaseModal
          project={selectedProject}
          projects={PROJECTS_DATA}
          onClose={handleProjectClose}
          onSelectProject={setSelectedProjectId}
          scrollController={scrollController}
        />
      )}

    </div>
  );
}
