import React, { useEffect, useState } from 'react';

import { advanceClockState, getChangedClockSegments, getZonedClock } from './contactFooterTime.js';

const SEGMENTS = ['hour', 'minute', 'second'];

const ClockSegment = ({ name, current, previous, changed, tick }) => (
  <span className={`cinematic-contact__clock-segment cinematic-contact__clock-segment--${name}`}>
    {changed && previous && (
      <span key={`${name}-previous-${tick}`} className="cinematic-contact__clock-value cinematic-contact__clock-value--previous">
        {previous}
      </span>
    )}
    <span
      key={`${name}-current-${changed ? tick : current}`}
      className={`cinematic-contact__clock-value${changed ? ' cinematic-contact__clock-value--current' : ''}`}
    >
      {current}
    </span>
  </span>
);

export default function ContactFooterClock({ city, timeZone, showStatus = false }) {
  const [clock, setClock] = useState({ current: null, previous: null, tick: 0 });

  useEffect(() => {
    const update = () => {
      const nextClock = getZonedClock(new Date(), timeZone);
      setClock((state) => advanceClockState(state, nextClock));
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [timeZone]);

  const currentSegments = (clock.current?.time ?? '--:--:--').split(':');
  const previousSegments = clock.previous?.time.split(':') ?? [];
  const changedSegments = new Set(
    clock.previous && clock.current
      ? getChangedClockSegments(clock.previous.time, clock.current.time)
      : [],
  );

  return (
    <div className="cinematic-contact__clock">
      <div className="cinematic-contact__clock-heading">
        <span>{city}</span>
      </div>
      <time className="cinematic-contact__clock-time" aria-live="off">
        {SEGMENTS.map((name, index) => (
          <React.Fragment key={name}>
            {index > 0 && <span className="cinematic-contact__clock-separator" aria-hidden="true">:</span>}
            <ClockSegment
              name={name}
              current={currentSegments[index]}
              previous={previousSegments[index]}
              changed={changedSegments.has(name)}
              tick={clock.tick}
            />
          </React.Fragment>
        ))}
      </time>
      {showStatus && (
        <p className="cinematic-contact__clock-status" aria-live="polite">
          {clock.current?.status ?? 'Synchronizing local time'}
        </p>
      )}
    </div>
  );
}
