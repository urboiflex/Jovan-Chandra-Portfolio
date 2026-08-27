import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getSignatureMarqueeDistance,
  getSignatureMarqueeRows,
  SIGNATURE_MARQUEE_REPEAT_COUNT,
  SIGNATURE_MARQUEE_CONTENT,
  SIGNATURE_MARQUEE_SCROLL_TRIGGER,
} from './signatureMarquee.js';

test('matches the reference alternating row directions', () => {
  assert.deepEqual(getSignatureMarqueeRows().map(({ direction }) => direction), [
    'left',
    'right',
    'left',
  ]);
});

test('caps each row translation at three quarters of the viewport', () => {
  assert.equal(getSignatureMarqueeDistance(1800, 1280), 960);
  assert.equal(getSignatureMarqueeDistance(600, 1280), 600);
});

test('keeps enough repeated copies to fill the viewport while scrubbing', () => {
  assert.ok(SIGNATURE_MARQUEE_REPEAT_COUNT >= 3);
});

test('uses the reference scroll-linked timing contract', () => {
  assert.deepEqual(SIGNATURE_MARQUEE_SCROLL_TRIGGER, {
    card: { start: 'top bottom', end: 'bottom top', scrub: true },
    row: { start: 'top bottom+=10%', end: 'bottom top-=10%', scrub: true },
  });
});

test('keeps the statement content editable and personal', () => {
  assert.equal(SIGNATURE_MARQUEE_CONTENT.signature, 'Jovan');
  assert.equal(SIGNATURE_MARQUEE_CONTENT.name, 'Jovan Chandra');
  assert.equal(SIGNATURE_MARQUEE_CONTENT.quote, 'No borrowed formulas. Just considered choices.');
});
