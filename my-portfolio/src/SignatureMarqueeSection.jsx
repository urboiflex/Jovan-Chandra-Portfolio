import { useLayoutEffect, useRef } from 'react';

import {
  getSignatureMarqueeDistance,
  getSignatureMarqueeRows,
  SIGNATURE_MARQUEE_REPEAT_COUNT,
  SIGNATURE_MARQUEE_CONTENT,
  SIGNATURE_MARQUEE_SCROLL_TRIGGER,
} from './signatureMarquee.js';
import paperTexture from './assets/paper-texture-yellow.png';
import jovanSignature from './assets/jovan-signature-white.png';
import './SignatureMarqueeSection.css';

const MARQUEE_NAME = 'Jovan Chandra';

const SignatureMarqueeSection = ({ isLoaded = false }) => {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const rowRefs = useRef([]);
  const rows = getSignatureMarqueeRows();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;

    if (
      !section
      || !card
      || !isLoaded
      || !window.gsap
      || !window.ScrollTrigger
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return undefined;

    const context = window.gsap.context(() => {
      const viewportWidth = window.innerWidth;

      rowRefs.current.slice(0, rows.length).forEach((row, index) => {
        if (!row) return;

        const copy = row.querySelector('[data-marquee-copy="true"]');
        const distance = getSignatureMarqueeDistance(
          copy?.getBoundingClientRect().width ?? row.getBoundingClientRect().width,
          viewportWidth,
        );
        const movesLeft = index % 2 === 0;

        window.gsap.fromTo(
          row,
          { x: movesLeft ? 0 : -distance },
          {
            x: movesLeft ? -distance : 0,
            ease: 'none',
            scrollTrigger: {
              trigger: row,
              ...SIGNATURE_MARQUEE_SCROLL_TRIGGER.row,
            },
          },
        );
      });

      window.gsap.fromTo(
        card,
        { yPercent: 20 },
        {
          yPercent: -20,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            ...SIGNATURE_MARQUEE_SCROLL_TRIGGER.card,
          },
        },
      );
    }, section);

    return () => context.revert();
  }, [isLoaded, rows.length]);

  return (
    <section
      ref={sectionRef}
      className="signature-marquee"
      aria-labelledby="signature-marquee-heading"
      data-scroll-section="Statement"
    >
      <svg
        className="signature-marquee__filter-defs"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id="signature-marquee-thin" x="-20%" y="-20%" width="140%" height="140%">
            <feMorphology in="SourceGraphic" operator="erode" radius="0.75" />
          </filter>
          <filter id="signature-cassandra-thin" x="-20%" y="-20%" width="140%" height="140%">
            <feMorphology in="SourceGraphic" operator="erode" radius="0.25" />
          </filter>
        </defs>
      </svg>

      <div className="signature-marquee__stage">
        <ul className="signature-marquee__rows" aria-hidden="true">
          {rows.map((row, index) => (
            <li
              key={row.id}
              ref={(element) => {
                rowRefs.current[index] = element;
              }}
            >
              {Array.from({ length: SIGNATURE_MARQUEE_REPEAT_COUNT }, (_, copyIndex) => (
                <span key={`${row.id}-copy-${copyIndex}`} data-marquee-copy="true">
                  {MARQUEE_NAME}
                </span>
              ))}
            </li>
          ))}
        </ul>

        <article
          ref={cardRef}
          className="signature-marquee__card"
          style={{ backgroundImage: `url(${paperTexture})` }}
        >
          <h2 id="signature-marquee-heading" className="signature-marquee__quote">
            {SIGNATURE_MARQUEE_CONTENT.quote}
          </h2>
          <div className="signature-marquee__signature-lockup">
            <img
              className="signature-marquee__signature"
              src={jovanSignature}
              alt={`${SIGNATURE_MARQUEE_CONTENT.signature} signature`}
            />
            <span className="signature-marquee__name">
              {SIGNATURE_MARQUEE_CONTENT.name}
            </span>
          </div>
        </article>
      </div>
    </section>
  );
};

export default SignatureMarqueeSection;
