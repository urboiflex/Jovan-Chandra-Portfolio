import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CASE_STUDY_HANDOFF_THRESHOLD,
  clampHandoffProgress,
  createHandoffNavigator,
  getCaseHeroParallaxMotion,
  getCaseMilestoneTrigger,
  getHandoffLabels,
  getMilestoneProgressMotion,
  restoreCaseStudyScroll,
  shouldCompleteHandoff,
  shouldInitializeCaseStudy,
} from './caseStudyMotion.js';

test('fills the milestone rail along the axis used by each layout', () => {
  assert.deepEqual(getMilestoneProgressMotion(false), {
    from: { scaleY: 0 },
    to: { scaleY: 1 },
  });
  assert.deepEqual(getMilestoneProgressMotion(true), {
    from: { scaleX: 0 },
    to: { scaleX: 1 },
  });
});

test('waits for page readiness and both animation runtimes before initializing a case study', () => {
  assert.equal(shouldInitializeCaseStudy({ isLoaded: false, hasGsap: true, hasScrollTrigger: true }), false);
  assert.equal(shouldInitializeCaseStudy({ isLoaded: true, hasGsap: false, hasScrollTrigger: true }), false);
  assert.equal(shouldInitializeCaseStudy({ isLoaded: true, hasGsap: true, hasScrollTrigger: false }), false);
  assert.equal(shouldInitializeCaseStudy({ isLoaded: true, hasGsap: true, hasScrollTrigger: true }), true);
});

test('activates a milestone near the viewport centre instead of when the next screen first appears', () => {
  assert.deepEqual(getCaseMilestoneTrigger(), {
    start: 'top 55%',
    end: 'bottom 45%',
  });
});

test('keeps parallax configuration on the hero image only', () => {
  assert.deepEqual(getCaseHeroParallaxMotion(), {
    yPercent: -5,
    ease: 'none',
    scrollTrigger: {
      start: 'top top+=80',
      end: 'bottom top',
      scrub: 0.8,
    },
  });
});

test('normalizes handoff progress into the ScrollTrigger range', () => {
  assert.equal(clampHandoffProgress(-0.4), 0);
  assert.equal(clampHandoffProgress(0.375), 0.375);
  assert.equal(clampHandoffProgress(1.4), 1);
  assert.equal(clampHandoffProgress(Number.NaN), 0);
});

test('derives intermediate and final handoff milestones from project position', () => {
  assert.deepEqual(getHandoffLabels(0, 2), {
    current: '01 / 02',
    destination: '02 / 02',
  });
  assert.deepEqual(getHandoffLabels(1, 2), {
    current: '02 / 02',
    destination: 'WORKS',
  });
  assert.deepEqual(getHandoffLabels(2, 3), {
    current: '03 / 03',
    destination: 'WORKS',
  });
});

test('completes only when a downward handoff reaches the threshold once', () => {
  assert.equal(CASE_STUDY_HANDOFF_THRESHOLD, 0.98);
  assert.equal(shouldCompleteHandoff({ progress: 0.97, direction: 1, isLocked: false, reducedMotion: false }), false);
  assert.equal(shouldCompleteHandoff({ progress: 0.98, direction: -1, isLocked: false, reducedMotion: false }), false);
  assert.equal(shouldCompleteHandoff({ progress: 0.98, direction: 1, isLocked: true, reducedMotion: false }), false);
  assert.equal(shouldCompleteHandoff({ progress: 1, direction: 1, isLocked: false, reducedMotion: true }), false);
  assert.equal(shouldCompleteHandoff({ progress: 0.98, direction: 1, isLocked: false, reducedMotion: false }), true);
});

test('uses the latest destination callback when the handoff completes', () => {
  const calls = [];
  const destinationRef = {
    current: {
      nextProject: { id: '02' },
      onNext: () => calls.push('stale callback'),
      onBack: () => calls.push('stale back'),
    },
  };
  const lockRef = { current: false };
  const navigate = createHandoffNavigator({ destinationRef, lockRef });

  destinationRef.current = {
    nextProject: { id: '02' },
    onNext: (id) => calls.push(id),
    onBack: () => calls.push('works'),
  };

  assert.equal(navigate(), true);
  assert.deepEqual(calls, ['02']);
  assert.equal(navigate(), false);
  assert.deepEqual(calls, ['02']);
});

test('resets and resumes Lenis after the destination render is scheduled', () => {
  const calls = [];
  const scheduled = [];
  const controller = {
    scrollTo(target, options) { calls.push(['scrollTo', target, options]); },
    start() { calls.push(['start']); },
  };

  restoreCaseStudyScroll(
    controller,
    () => calls.push(['fallback']),
    (callback) => scheduled.push(callback),
  );

  assert.deepEqual(calls, []);
  assert.equal(scheduled.length, 1);
  scheduled[0]();

  assert.deepEqual(calls, [
    ['scrollTo', 0, { immediate: true, force: true }],
    ['start'],
  ]);
});
