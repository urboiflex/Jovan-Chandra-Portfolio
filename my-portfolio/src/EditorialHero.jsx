import React, { useLayoutEffect, useRef } from 'react';

import { EDITORIAL_HERO_COPY, getEditorialHeroMotion } from './editorialHero.js';

const DisplayWord = ({ value, className, wordRef }) => (
  <span ref={wordRef} className={className} aria-hidden="true" data-hero-animate>
    {[...value].map((letter, index) => (
      <span className="editorial-hero__letter" key={`${letter}-${index}`}>
        {letter}
      </span>
    ))}
  </span>
);

export default function EditorialHero({ isLoaded }) {
  const rootRef = useRef(null);
  const availabilityRef = useRef(null);
  const quoteRef = useRef(null);
  const jovanRef = useRef(null);
  const servicesRef = useRef(null);
  const chandraRef = useRef(null);

  useLayoutEffect(() => {
    if (!isLoaded || typeof window === 'undefined' || !window.gsap || !rootRef.current) {
      return undefined;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const motion = getEditorialHeroMotion(reduceMotion);
    const gsap = window.gsap;

    if (!motion.enableScrollMotion) {
      gsap.set(rootRef.current.querySelectorAll('[data-hero-animate]'), { clearProps: 'all' });
      return undefined;
    }

    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: 'expo.out' } });

      timeline
        .fromTo(
          [availabilityRef.current, quoteRef.current],
          { yPercent: 120, opacity: 0, clipPath: 'inset(100% 0 0)' },
          {
            yPercent: 0,
            opacity: 1,
            clipPath: 'inset(0% 0 0)',
            duration: motion.metadataDuration,
            stagger: 0.1,
          },
        )
        .fromTo(
          jovanRef.current.querySelectorAll('.editorial-hero__letter'),
          { yPercent: 115, opacity: 0, rotate: 4 },
          {
            yPercent: 0,
            opacity: 1,
            rotate: 0,
            duration: motion.letterDuration,
            stagger: motion.letterStagger,
          },
          '-=0.35',
        )
        .fromTo(
          servicesRef.current,
          { y: 36, opacity: 0, clipPath: 'inset(100% 0 0)' },
          {
            y: 0,
            opacity: 1,
            clipPath: 'inset(0% 0 0)',
            duration: motion.metadataDuration,
          },
          '-=0.3',
        );

      gsap.fromTo(
        chandraRef.current.querySelectorAll('.editorial-hero__letter'),
        { yPercent: 115, opacity: 0, rotate: -3 },
        {
          yPercent: 0,
          opacity: 1,
          rotate: 0,
          duration: motion.letterDuration,
          stagger: motion.letterStagger,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: chandraRef.current,
            start: 'top 82%',
          },
        },
      );

      gsap.to(jovanRef.current, {
        yPercent: -8,
        letterSpacing: '-0.095em',
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '45% top',
          scrub: 1.1,
        },
      });

      gsap.to(chandraRef.current, {
        yPercent: -14,
        ease: 'none',
        scrollTrigger: {
          trigger: chandraRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
        },
      });
    }, rootRef);

    window.ScrollTrigger?.refresh();

    return () => context.revert();
  }, [isLoaded]);

  return (
    <section
      ref={rootRef}
      className="editorial-hero"
      aria-labelledby="editorial-hero-title"
      data-ready={isLoaded ? 'true' : 'false'}
      data-scroll-section="Home"
    >
      <p ref={availabilityRef} className="editorial-hero__availability" data-hero-animate>
        {EDITORIAL_HERO_COPY.availability}
      </p>
      <p ref={quoteRef} className="editorial-hero__quote" data-hero-animate>
        {EDITORIAL_HERO_COPY.quote}
      </p>
      <h1 id="editorial-hero-title" className="sr-only">Jovan Chandra</h1>
      <DisplayWord
        value={EDITORIAL_HERO_COPY.givenName}
        className="editorial-hero__name editorial-hero__name--jovan"
        wordRef={jovanRef}
      />
      <div ref={servicesRef} className="editorial-hero__services" data-hero-animate>
        <p className="editorial-hero__services-label">SERVICES</p>
        <ul>
          {EDITORIAL_HERO_COPY.services.map((service) => (
            <li className="editorial-hero__service" key={service}>{service}</li>
          ))}
        </ul>
      </div>
      <DisplayWord
        value={EDITORIAL_HERO_COPY.surname}
        className="editorial-hero__name editorial-hero__name--chandra"
        wordRef={chandraRef}
      />
    </section>
  );
}
