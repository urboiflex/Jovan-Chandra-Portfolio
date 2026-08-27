import test from 'node:test';
import assert from 'node:assert/strict';
import * as transition from './infoTransition.js';

import {
  createInfoTransitionPlan,
  getDetailNavigationMode,
  getInfoTransitionSwapDelayMs,
  getPortfolioViewFromPath,
} from './infoTransition.js';

test('keeps the flying label visible until the destination cover starts revealing', () => {
  assert.equal(typeof transition.getFlyingLabelHandoffTiming, 'function');
  assert.deepEqual(transition.getFlyingLabelHandoffTiming(), {
    delay: 0.1,
    duration: 0.9,
  });
});

test('releases detail-page interaction as soon as the cover is fully transparent', () => {
  assert.equal(typeof transition.getDetailArrivalReleaseTime, 'function');
  assert.equal(transition.getDetailArrivalReleaseTime({
    coverDelay: 0.1,
    coverDuration: 0.9,
  }), 1);
});

test('moves the clicked label from its measured position to the desktop Info title', () => {
  const plan = createInfoTransitionPlan({
    destinationView: 'info',
    sourceRect: { left: 640, top: 32, width: 24, height: 15 },
    sourceFontSize: 12,
    viewportWidth: 1440,
    prefersReducedMotion: false,
  });

  assert.deepEqual(plan.start, {
    left: 640,
    top: 32,
    fontSize: 12,
  });
  assert.deepEqual(plan.end, {
    left: 48,
    top: 48,
    fontSize: 72,
    lineHeight: 1.2,
    letterSpacing: '-0.055em',
  });
  assert.deepEqual(plan.timing, {
    coverDuration: 0.7,
    labelDelay: 0.2,
    labelDuration: 1,
  });
});

test('uses the compact title position and readable title size on mobile', () => {
  const plan = createInfoTransitionPlan({
    destinationView: 'info',
    sourceRect: { left: 180, top: 24, width: 20, height: 14 },
    sourceFontSize: 11,
    viewportWidth: 390,
    prefersReducedMotion: false,
  });

  assert.deepEqual(plan.end, {
    left: 24,
    top: 24,
    fontSize: 40,
    lineHeight: 1.2,
    letterSpacing: '-0.055em',
  });
});

test('lands the flying label on the smaller Works title without a size or position jump', () => {
  const desktopPlan = createInfoTransitionPlan({
    destinationView: 'works',
    sourceRect: { left: 640, top: 32, width: 24, height: 15 },
    sourceFontSize: 12,
    viewportWidth: 1440,
    prefersReducedMotion: false,
  });
  const mobilePlan = createInfoTransitionPlan({
    destinationView: 'works',
    sourceRect: { left: 180, top: 24, width: 20, height: 14 },
    sourceFontSize: 11,
    viewportWidth: 390,
    prefersReducedMotion: false,
  });

  assert.deepEqual(desktopPlan.end, {
    left: 48,
    top: 46,
    fontSize: 59.76,
    lineHeight: 0.9,
    letterSpacing: '-0.06em',
  });
  assert.deepEqual(mobilePlan.end, {
    left: 24,
    top: 24,
    fontSize: 38,
    lineHeight: 0.9,
    letterSpacing: '-0.06em',
  });
});

test('removes transition time when reduced motion is requested', () => {
  const plan = createInfoTransitionPlan({
    destinationView: 'info',
    sourceRect: { left: 200, top: 20, width: 20, height: 15 },
    sourceFontSize: 12,
    viewportWidth: 1280,
    prefersReducedMotion: true,
  });

  assert.deepEqual(plan.timing, {
    coverDuration: 0,
    labelDelay: 0,
    labelDuration: 0,
  });
});

test('swaps views only after the flying label has reached its destination', () => {
  assert.equal(getInfoTransitionSwapDelayMs({
    coverDuration: 0.7,
    labelDelay: 0.2,
    labelDuration: 1,
  }), 1300);

  assert.equal(getInfoTransitionSwapDelayMs({
    coverDuration: 0,
    labelDelay: 0,
    labelDuration: 0,
  }), 0);
});

test('keeps detail navigation functional when the animation runtime is unavailable', () => {
  assert.equal(getDetailNavigationMode({
    hasSourceElement: true,
    isNavigating: false,
    hasAnimationRuntime: false,
  }), 'immediate');

  assert.equal(getDetailNavigationMode({
    hasSourceElement: true,
    isNavigating: false,
    hasAnimationRuntime: true,
  }), 'animated');

  assert.equal(getDetailNavigationMode({
    hasSourceElement: true,
    isNavigating: true,
    hasAnimationRuntime: true,
  }), 'blocked');
});

test('maps dedicated profile routes without treating unrelated paths as profile views', () => {
  assert.equal(getPortfolioViewFromPath('/info/'), 'info');
  assert.equal(getPortfolioViewFromPath('/info'), 'info');
  assert.equal(getPortfolioViewFromPath('/contact/'), 'contact');
  assert.equal(getPortfolioViewFromPath('/contact'), 'contact');
  assert.equal(getPortfolioViewFromPath('/works/'), 'works');
  assert.equal(getPortfolioViewFromPath('/works'), 'works');
  assert.equal(getPortfolioViewFromPath('/works/02/'), 'project');
  assert.equal(getPortfolioViewFromPath('/'), 'home');
  assert.equal(getPortfolioViewFromPath('/unrelated/'), 'home');
});
