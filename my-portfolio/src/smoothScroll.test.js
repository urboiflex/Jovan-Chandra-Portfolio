import assert from 'node:assert/strict';
import test from 'node:test';

import * as smoothScroll from './smoothScroll.js';

const { createAnimationFrameLoop, getSmoothScrollOptions } = smoothScroll;

test('releases a stopped smooth-scroll controller after detail navigation', () => {
  const controller = {
    isStopped: true,
    start() {
      this.isStopped = false;
    },
  };

  assert.equal(typeof smoothScroll.resumeSmoothScroll, 'function');
  assert.equal(smoothScroll.resumeSmoothScroll(controller), true);
  assert.equal(controller.isStopped, false);
  assert.equal(smoothScroll.resumeSmoothScroll(null), false);
});

test('desktop wheel input uses deliberate, weighty smoothing', () => {
  const options = getSmoothScrollOptions();

  assert.equal(options.lerp, 0.08);
  assert.equal(options.wheelMultiplier, 0.8);
  assert.equal(options.smoothWheel, true);
  assert.equal('duration' in options, false);
  assert.equal('mouseMultiplier' in options, false);
  assert.equal('smoothTouch' in options, false);
});

test('slows vertical wheel input only while the contact scene intersects the viewport', () => {
  const contactScene = {
    getBoundingClientRect: () => ({ top: 100, bottom: 1300 }),
  };
  const options = getSmoothScrollOptions({
    documentLike: { querySelector: () => contactScene },
    viewportLike: { innerHeight: 900 },
  });
  const input = { deltaX: 12, deltaY: 100 };

  options.virtualScroll(input);

  assert.equal(input.deltaX, 12);
  assert.equal(input.deltaY, 52);
});

test('leaves wheel input untouched outside the contact scene', () => {
  const contactScene = {
    getBoundingClientRect: () => ({ top: 1000, bottom: 2400 }),
  };
  const options = getSmoothScrollOptions({
    documentLike: { querySelector: () => contactScene },
    viewportLike: { innerHeight: 900 },
  });
  const input = { deltaY: 100 };

  options.virtualScroll(input);

  assert.equal(input.deltaY, 100);
});

test('stopping the scroll loop cancels the queued frame and prevents another frame', () => {
  let nextId = 0;
  let queuedCallback;
  const cancelled = [];
  const observedTimes = [];
  const scheduler = {
    request(callback) {
      nextId += 1;
      queuedCallback = callback;
      return nextId;
    },
    cancel(id) {
      cancelled.push(id);
    },
  };
  const loop = createAnimationFrameLoop((time) => observedTimes.push(time), scheduler);

  loop.start();
  queuedCallback(16);
  loop.stop();

  assert.deepEqual(observedTimes, [16]);
  assert.deepEqual(cancelled, [2]);
});

test('updates the progress rail only while its element exists', () => {
  const calls = [];
  const gsap = { set: (...args) => calls.push(args) };
  const indicator = {};

  assert.equal(smoothScroll.updateScrollProgress({ progress: 0.6 }, gsap, {
    querySelector: () => null,
  }), false);
  assert.deepEqual(calls, []);

  assert.equal(smoothScroll.updateScrollProgress({ progress: 0.6 }, gsap, {
    querySelector: () => indicator,
  }), true);
  assert.deepEqual(calls, [[indicator, { scaleY: 0.6 }]]);
});
