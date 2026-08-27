import assert from 'node:assert/strict';
import test from 'node:test';

test('keeps compact technology summaries to ten items and signals hidden tools', async () => {
  const module = await import('./projectTechnology.js').catch(() => ({}));

  assert.equal(typeof module.getCompactProjectTools, 'function');
  assert.deepEqual(
    module.getCompactProjectTools([
      'T01', 'T02', 'T03', 'T04', 'T05', 'T06',
      'T07', 'T08', 'T09', 'T10', 'T11', 'T12',
    ]),
    ['T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10', 'and more…'],
  );
});

test('leaves technology summaries unchanged when they fit the limit', async () => {
  const module = await import('./projectTechnology.js').catch(() => ({}));

  assert.equal(typeof module.getCompactProjectTools, 'function');
  assert.deepEqual(module.getCompactProjectTools(['React', 'GSAP']), ['React', 'GSAP']);
});
