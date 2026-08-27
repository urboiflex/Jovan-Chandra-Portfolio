import assert from 'node:assert/strict';
import test from 'node:test';

import { handleFooterNavigation } from './footerNavigation.js';

test('hands an animated footer route to the shared navigation controller', () => {
  let prevented = false;
  const anchor = {};
  const routed = [];
  const event = {
    currentTarget: anchor,
    preventDefault: () => { prevented = true; },
  };

  const handled = handleFooterNavigation(event, 'works', (...args) => routed.push(args), true);

  assert.equal(handled, true);
  assert.equal(prevented, true);
  assert.deepEqual(routed, [['works', anchor]]);
});

test('preserves the anchor fallback when animation is unavailable', () => {
  let prevented = false;
  let routed = false;
  const event = { preventDefault: () => { prevented = true; } };

  const handled = handleFooterNavigation(event, 'info', () => { routed = true; }, false);

  assert.equal(handled, false);
  assert.equal(prevented, false);
  assert.equal(routed, false);
});
