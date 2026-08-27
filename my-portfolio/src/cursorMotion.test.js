import assert from 'node:assert/strict';
import test from 'node:test';

test('cursor animation sleeps once the follower reaches its target', async () => {
  const module = await import('./cursorMotion.js').catch(() => ({}));

  assert.equal(typeof module.stepCursorFollower, 'function');
  assert.deepEqual(module.stepCursorFollower({ x: 99.99, y: 50 }, { x: 100, y: 50 }), {
    x: 100,
    y: 50,
    settled: true,
  });
});

test('cursor animation advances while the pointer is still moving', async () => {
  const module = await import('./cursorMotion.js').catch(() => ({}));

  assert.equal(typeof module.stepCursorFollower, 'function');
  assert.deepEqual(module.stepCursorFollower({ x: 0, y: 0 }, { x: 100, y: 50 }), {
    x: 6,
    y: 3,
    settled: false,
  });
});
