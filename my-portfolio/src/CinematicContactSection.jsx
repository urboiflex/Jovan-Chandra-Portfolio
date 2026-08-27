import React, { useLayoutEffect, useRef } from 'react';

import { getCinematicContactMotion } from './contactMotion.js';
import { handleFooterNavigation } from './footerNavigation.js';
import ContactFooterClock from './ContactFooterClock.jsx';
import SplitHoverText from './SplitHoverText.jsx';
import contactLakeside from './assets/contact-lakeside.png';
import contactOceanFlowers from './assets/contact-ocean-flowers.png';
import './CinematicContactSection.css';

const SOCIAL_LINKS = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jovan-richaldy/' },
  { name: 'Instagram', url: 'https://www.instagram.com/jovanrichaldy/?hl=en' },
  { name: 'GitHub', url: 'https://github.com/urboiflex' },
];

const FOOTER_PAGE_LINKS = [
  { name: 'Works', target: 'works', url: '/works/' },
  { name: 'Info', target: 'info', url: '/info/' },
  { name: 'Contact', target: 'contact', url: '/contact/' },
];

const FOOTER_CONTACT_LINKS = [
  { name: 'GitHub', url: 'https://github.com/urboiflex', external: true },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jovan-richaldy/', external: true },
  { name: 'Instagram', url: 'https://www.instagram.com/jovanrichaldy/?hl=en', external: true },
  { name: 'jovan.rc1212@gmail.com', url: 'mailto:jovan.rc1212@gmail.com' },
];

const FooterLink = ({ link, onNavigate }) => (
  <a
    className={`cinematic-contact__footer-link group project-link${link.url.startsWith('mailto:') ? ' cinematic-contact__email-link' : ''}`}
    href={link.url}
    data-nav-target={link.target}
    onClick={link.target ? (event) => handleFooterNavigation(
      event,
      link.target,
      onNavigate,
      typeof window !== 'undefined' && Boolean(window.gsap),
    ) : undefined}
    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
  >
    {link.url.startsWith('mailto:') ? link.name : (
      <SplitHoverText
        text={link.name}
        className="split-hover-text--footer"
        height="1.05em"
        distance="1em"
      />
    )}
  </a>
);

const FrameCorners = () => (
  <>
    <span className="cinematic-contact__corner cinematic-contact__corner--tl" />
    <span className="cinematic-contact__corner cinematic-contact__corner--tr" />
    <span className="cinematic-contact__corner cinematic-contact__corner--bl" />
    <span className="cinematic-contact__corner cinematic-contact__corner--br" />
  </>
);

const travelPair = (gsap, timeline, element, [from, to], start, duration) => {
  gsap.set(element, { yPercent: -50, y: () => window.innerHeight * from });
  timeline.to(element, {
    y: () => window.innerHeight * to,
    duration,
    ease: 'none',
  }, start);
};

export default function CinematicContactSection({ isLoaded, onNavigate }) {
  const rootRef = useRef(null);
  const backdropRef = useRef(null);
  const surfaceRef = useRef(null);
  const stageRef = useRef(null);
  const footerRef = useRef(null);
  const footerSceneRef = useRef(null);
  const footerContentRef = useRef(null);
  const footerWordRef = useRef(null);
  const footerWordZonesRef = useRef(null);
  const titleRef = useRef(null);
  const firstCopyRef = useRef(null);
  const secondCopyRef = useRef(null);
  const firstFrameRef = useRef(null);
  const secondFrameRef = useRef(null);
  const firstImageRef = useRef(null);
  const secondImageRef = useRef(null);
  const socialsRef = useRef(null);
  const mailRef = useRef(null);

  useLayoutEffect(() => {
    if (!isLoaded || typeof window === 'undefined' || !window.gsap || !window.ScrollTrigger || !rootRef.current) {
      return undefined;
    }

    const gsap = window.gsap;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motion = getCinematicContactMotion(reducedMotion);

    if (!motion.enableScrollMotion) {
      gsap.set(rootRef.current.querySelectorAll('[data-contact-motion]'), { clearProps: 'all' });
      gsap.set([backdropRef.current, surfaceRef.current, stageRef.current], { clearProps: 'all' });
      return undefined;
    }

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add('(min-width: 1024px)', () => {
        footerRef.current.style.height = motion.footerHeight;
        surfaceRef.current.style.height = motion.surfaceHeight;

        const setContactLayers = (visible) => {
          const value = visible ? 'visible' : 'hidden';
          backdropRef.current.style.visibility = value;
          surfaceRef.current.style.visibility = value;
          if (!visible) rootRef.current.style.pointerEvents = '';
        };

        const visibilityTrigger = window.ScrollTrigger.create({
          trigger: rootRef.current,
          start: 'top bottom',
          endTrigger: footerRef.current,
          end: 'top bottom',
          onEnter: () => setContactLayers(true),
          onLeave: () => setContactLayers(false),
          onLeaveBack: () => setContactLayers(false),
          onEnterBack: () => setContactLayers(true),
          invalidateOnRefresh: true,
        });

        const stageTakeoverOffset = () => window.innerHeight * motion.takeoverDistance / 100;
        const surfaceTakeoverOffset = () => window.innerHeight * motion.surfaceTakeoverDistance / 100;

        gsap.set(surfaceRef.current, { y: surfaceTakeoverOffset });
        gsap.set(stageRef.current, { y: stageTakeoverOffset });
        gsap.to(surfaceRef.current, {
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: motion.takeoverStart,
            end: motion.takeoverEnd,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        gsap.to(stageRef.current, {
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: motion.takeoverStart,
            end: motion.takeoverEnd,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        const mainStageTween = gsap.fromTo(stageRef.current,
          { y: 0 },
          {
            y: () => window.innerHeight * motion.mainStageTravel,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: rootRef.current,
              start: motion.mainStageStart,
              end: motion.mainStageEnd,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        gsap.set(titleRef.current, {
          x: () => window.innerWidth * 1.1,
          yPercent: 0,
          visibility: 'hidden',
        });
        timeline.set(titleRef.current, { visibility: 'visible' }, motion.titleRevealAt);
        timeline.to(titleRef.current, {
          x: 0,
          duration: motion.titleDuration,
          ease: 'power3.out',
        }, motion.titleAt);

        travelPair(
          gsap,
          timeline,
          firstFrameRef.current,
          motion.frameTravel.first,
          motion.pairAt,
          motion.pairDuration,
        );
        travelPair(
          gsap,
          timeline,
          secondFrameRef.current,
          motion.frameTravel.second,
          motion.pairAt + motion.secondPairOffset,
          motion.pairDuration,
        );
        travelPair(
          gsap,
          timeline,
          firstCopyRef.current,
          motion.copyTravel.first,
          motion.pairAt,
          motion.pairDuration,
        );
        travelPair(
          gsap,
          timeline,
          secondCopyRef.current,
          motion.copyTravel.second,
          motion.pairAt,
          motion.pairDuration,
        );

        [firstImageRef.current, secondImageRef.current].forEach((image, index) => {
          gsap.set(image, { yPercent: motion.imageTravel[0] });
          timeline.to(image, {
            yPercent: motion.imageTravel[1],
            duration: motion.pairDuration,
            ease: 'none',
          }, motion.pairAt + (index ? motion.secondPairOffset : 0));
        });

        [firstCopyRef.current, secondCopyRef.current].forEach((copy) => {
          timeline.to(copy, {
            opacity: 0,
            clipPath: 'inset(100% 0 0% 0)',
            duration: 0.15,
            ease: 'power2.in',
          }, motion.pairAt + 0.45);
        });

        timeline.fromTo(socialsRef.current,
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 0.2, ease: 'none' },
          0.28,
        );
        timeline.fromTo(mailRef.current,
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 0.2, ease: 'none' },
          0.36,
        );

        const footerTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: motion.footerParallaxStart,
            end: motion.footerParallaxEnd,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const shouldHideContactBackground = self.progress > 0.2;
              backdropRef.current.style.visibility = shouldHideContactBackground ? 'hidden' : 'visible';
              rootRef.current.style.pointerEvents = shouldHideContactBackground ? 'none' : '';
            },
          },
        });

        footerTimeline.fromTo(
          footerRef.current,
          { yPercent: motion.footerParallaxFrom },
          {
            yPercent: motion.footerParallaxTo,
            duration: 1,
            ease: 'none',
          },
        );
        footerTimeline.fromTo(
          footerSceneRef.current,
          { yPercent: motion.footerSceneFrom },
          {
            yPercent: motion.footerSceneTo,
            duration: 1,
            ease: 'none',
          },
          0,
        );
        footerTimeline.set(surfaceRef.current, {
          height: motion.surfaceHeight,
          overflow: 'hidden',
          borderRadius: 0,
        }, 0);
        footerTimeline.to(surfaceRef.current, {
          y: () => window.innerHeight * motion.footerExitSurfaceTravel - 400,
          immediateRender: false,
          duration: 1,
          ease: 'none',
          overwrite: 'auto',
        }, 0);
        footerTimeline.fromTo(stageRef.current,
          { y: () => window.innerHeight * motion.mainStageTravel },
          {
            y: () => window.innerHeight * motion.footerExitStageTravel,
            pointerEvents: 'none',
            immediateRender: false,
            duration: 1,
            ease: 'none',
            overwrite: 'auto',
          },
          0,
        );
        footerTimeline.fromTo(
          [socialsRef.current, mailRef.current],
          { y: 0 },
          {
            y: () => window.innerHeight * motion.footerExitLinksCounterTravel,
            duration: 1,
            ease: 'none',
          },
          0,
        );
        footerTimeline.fromTo(
          mailRef.current,
          { clipPath: 'inset(0 0 0% 0)' },
          {
            clipPath: 'inset(0 0 100% 0)',
            duration: motion.footerExitLinksClipDuration,
            ease: 'none',
          },
          motion.footerExitLinksAt,
        );
        footerTimeline.fromTo(
          socialsRef.current,
          { clipPath: 'inset(0 0 0% 0)' },
          {
            clipPath: 'inset(0 0 100% 0)',
            duration: motion.footerExitLinksClipDuration,
            ease: 'power2.inOut',
          },
          motion.footerExitLinksAt,
        );
        footerTimeline.fromTo(
          titleRef.current,
          { clipPath: 'inset(0 0 0% 0)' },
          {
            clipPath: 'inset(0 0 100% 0)',
            duration: motion.footerExitTitleClipDuration,
            ease: 'power2.inOut',
          },
          motion.footerExitTitleAt,
        );

        const footerContentTween = gsap.fromTo(footerContentRef.current,
          { autoAlpha: 0, y: 32 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: 'power3.inOut',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 90%',
              once: true,
            },
          });

        const footerLetters = Array.from(footerWordRef.current.querySelectorAll('.cinematic-contact__footer-letter'));
        const footerHitZones = Array.from(footerWordZonesRef.current.children);
        const footerLetterOrder = [footerLetters[0], footerLetters[4], footerLetters[1], footerLetters[3], footerLetters[2]];
        const footerWordTween = gsap.fromTo(footerLetterOrder,
          { yPercent: 100 },
          {
            yPercent: 8,
            duration: 1,
            stagger: 0.15,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 20%',
              once: true,
            },
          });

        const footerLetterCleanups = footerHitZones.map((zone, index) => {
          const letter = footerLetters[index];
          const enter = () => gsap.to(letter, { yPercent: 50, duration: 0.4, ease: 'power3.out' });
          const leave = () => gsap.to(letter, { yPercent: 8, duration: 0.4, ease: 'power2.out' });
          zone.addEventListener('pointerenter', enter);
          zone.addEventListener('pointerleave', leave);
          return () => {
            zone.removeEventListener('pointerenter', enter);
            zone.removeEventListener('pointerleave', leave);
          };
        });

        return () => {
          visibilityTrigger.kill();
          mainStageTween.scrollTrigger?.kill();
          mainStageTween.kill();
          timeline.kill();
          footerTimeline.kill();
          footerContentTween.scrollTrigger?.kill();
          footerContentTween.kill();
          footerWordTween.scrollTrigger?.kill();
          footerWordTween.kill();
          footerLetterCleanups.forEach((cleanup) => cleanup());
        };
      });

      return () => media.revert();
    }, rootRef);

    window.ScrollTrigger.refresh();
    return () => context.revert();
  }, [isLoaded]);

  return (
    <>
      <div ref={backdropRef} className="cinematic-contact__backdrop" aria-hidden="true" />
      <div ref={surfaceRef} className="cinematic-contact__surface" aria-hidden="true" />

      <section
        id="contact"
        ref={rootRef}
        className="cinematic-contact"
        data-scroll-section="Contact"
        data-contact-scroll-zone
        aria-labelledby="cinematic-contact-title"
      >

        <div ref={stageRef} className="cinematic-contact__stage">
          <h2
            ref={titleRef}
            id="cinematic-contact-title"
            className="cinematic-contact__title"
            data-contact-motion
          >
            Contact
          </h2>

          <div ref={firstCopyRef} className="cinematic-contact__copy cinematic-contact__copy--first" data-contact-motion>
            <p>
              Open to <em>freelance work</em> and thoughtful collaborations with teams building useful things.
            </p>
          </div>

          <div ref={firstFrameRef} className="cinematic-contact__frame cinematic-contact__frame--first" data-contact-motion>
            <img
              ref={firstImageRef}
              className="cinematic-contact__placeholder cinematic-contact__placeholder--first"
              src={contactOceanFlowers}
              alt=""
              aria-hidden="true"
            />
            <FrameCorners />
          </div>

          <div ref={secondCopyRef} className="cinematic-contact__copy cinematic-contact__copy--second" data-contact-motion>
            <p>
              Building <em>digital experiences</em> across design, product and automation.
            </p>
          </div>

          <div ref={secondFrameRef} className="cinematic-contact__frame cinematic-contact__frame--second" data-contact-motion>
            <img
              ref={secondImageRef}
              className="cinematic-contact__placeholder cinematic-contact__placeholder--second"
              src={contactLakeside}
              alt=""
              aria-hidden="true"
            />
            <FrameCorners />
          </div>

          <div className="cinematic-contact__bottom">
            <nav ref={socialsRef} className="cinematic-contact__socials" aria-label="Social links" data-contact-motion>
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  className="cinematic-contact__social-link group project-link"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <SplitHoverText
                    text={social.name}
                    className="split-hover-text--contact"
                    height="1em"
                    distance="1em"
                  />
                </a>
              ))}
            </nav>

            <a ref={mailRef} className="cinematic-contact__mail cinematic-contact__email-link" href="mailto:jovan.rc1212@gmail.com" data-contact-motion>
              jovan.rc1212@gmail.com
            </a>
          </div>
        </div>
      </section>

      <footer
        ref={footerRef}
        className="cinematic-contact__footer"
      >
        <div ref={footerSceneRef} className="cinematic-contact__footer-scene">
          <div ref={footerContentRef} className="cinematic-contact__footer-content">
            <div className="cinematic-contact__footer-intro">
              <h2>Have something in mind? <em>I’m listening.</em></h2>
            </div>

            <nav className="cinematic-contact__footer-nav" aria-label="Footer navigation">
              {FOOTER_PAGE_LINKS.map((link) => (
                <FooterLink key={link.name} link={link} onNavigate={onNavigate} />
              ))}
            </nav>

            <div className="cinematic-contact__footer-connections" aria-label="Contact and social links">
              {FOOTER_CONTACT_LINKS.map((link) => <FooterLink key={link.name} link={link} />)}
            </div>

            <div className="cinematic-contact__footer-clocks" aria-label="Local times and availability">
              <ContactFooterClock city="Kuala Lumpur" timeZone="Asia/Kuala_Lumpur" />
              <ContactFooterClock city="Jakarta" timeZone="Asia/Jakarta" showStatus />
            </div>

            <p className="cinematic-contact__footer-copyright">© 2026 Jovan Chandra. All rights reserved.</p>
          </div>

          <div ref={footerWordRef} className="cinematic-contact__footer-word" aria-label="JOVAN">
            {'JOVAN'.split('').map((letter, index) => (
              <span key={`${letter}-${index}`} className="cinematic-contact__footer-letter" aria-hidden="true">{letter}</span>
            ))}
            <div ref={footerWordZonesRef} className="cinematic-contact__footer-word-zones" aria-hidden="true">
              {'JOVAN'.split('').map((letter, index) => (
                <span key={`${letter}-hit-${index}`} className="cinematic-contact__footer-word-hit" />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
