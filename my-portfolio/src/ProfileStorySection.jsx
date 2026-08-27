import React, { useLayoutEffect, useRef } from 'react';

import portrait from './assets/anjay.jpeg';
import { getProfileStoryMotion, PROFILE_STORY_COPY } from './profileStory.js';

export default function ProfileStorySection({ isLoaded }) {
  const rootRef = useRef(null);
  const stageRef = useRef(null);
  const portraitRef = useRef(null);
  const storyRef = useRef(null);

  useLayoutEffect(() => {
    if (!isLoaded || typeof window === 'undefined' || !window.gsap || !rootRef.current) {
      return undefined;
    }

    const gsap = window.gsap;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motion = getProfileStoryMotion(reducedMotion);
    const animatedElements = rootRef.current.querySelectorAll('[data-profile-animate]');

    if (!motion.enableScrollMotion) {
      gsap.set(animatedElements, { clearProps: 'transform,clip-path' });
      gsap.set(portraitRef.current, {
        opacity: motion.portraitOpacity,
      });
      return undefined;
    }

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add('(min-width: 768px)', () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: motion.textStart,
            end: motion.textEnd,
            pin: motion.pinStage,
            scrub: motion.scrub,
            invalidateOnRefresh: true,
          },
        });

        const portraitTween = gsap.fromTo(
          portraitRef.current,
          { y: () => window.innerHeight * -0.22 },
          {
            y: () => window.innerHeight * 0.45,
            ease: 'none',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: motion.portraitScrub,
              invalidateOnRefresh: true,
            },
          },
        );

        timeline
          .fromTo(
            storyRef.current.querySelectorAll('[data-profile-line]'),
            { x: -56, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
            {
              x: 0,
              opacity: 1,
              clipPath: 'inset(0 0% 0 0)',
              duration: motion.textDuration,
              stagger: motion.lineStagger,
              ease: motion.textEase,
            },
            motion.textDelay,
          )
          .fromTo(
            storyRef.current.querySelectorAll('.profile-story__fact'),
            { x: -30, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.32,
              stagger: 0.05,
              ease: 'power3.out',
            },
            motion.textDelay + 0.48,
          );

        return () => {
          portraitTween.kill();
          timeline.kill();
        };
      });

      media.add('(max-width: 767px)', () => {
        const textTween = gsap.fromTo(
          storyRef.current.querySelectorAll('[data-profile-line]'),
          { x: -44, opacity: 0, clipPath: 'inset(0 100% 0 0)' },
          {
            x: 0,
            opacity: 1,
            clipPath: 'inset(0 0% 0 0)',
            duration: motion.textDuration,
            stagger: motion.lineStagger,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top 72%',
              end: 'top 5%',
              scrub: motion.scrub,
            },
          },
        );

        const factsTween = gsap.fromTo(
          storyRef.current.querySelectorAll('.profile-story__fact'),
          { x: -24, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top 24%',
              end: 'top -10%',
              scrub: motion.scrub,
            },
          },
        );

        const portraitTween = gsap.to(
          portraitRef.current,
          {
            yPercent: motion.portraitTravel,
            ease: 'none',
            scrollTrigger: {
              trigger: rootRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: motion.portraitScrub,
            },
          },
        );

        return () => {
          portraitTween.kill();
          factsTween.kill();
          textTween.kill();
        };
      });

      return () => media.revert();
    }, rootRef);

    window.ScrollTrigger?.refresh();
    return () => context.revert();
  }, [isLoaded]);

  return (
    <section id="info" ref={rootRef} className="profile-story" aria-labelledby="profile-story-title" data-scroll-section="About">
      <div
        ref={portraitRef}
        className="profile-story__portrait"
        data-profile-animate
        data-profile-portrait
      >
        <img src={portrait} alt="Jovan Chandra" />
      </div>

      <div ref={stageRef} className="profile-story__stage">
        <div ref={storyRef} className="profile-story__content" data-profile-story>
          <h2 id="profile-story-title" className="profile-story__statement" data-profile-animate data-profile-text>
            {PROFILE_STORY_COPY.statementLines.map((line, index) => (
              <span className="profile-story__line" data-profile-line key={index}>
                {typeof line === 'string' ? line : (
                  <>
                    {line.lead}
                    <em className="profile-story__accent">{line.accent}</em>
                    {line.tail}
                  </>
                )}
              </span>
            ))}
          </h2>
          <dl className="profile-story__facts" data-profile-animate data-profile-text>
            {PROFILE_STORY_COPY.facts.map((fact) => (
              <div className="profile-story__fact" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
