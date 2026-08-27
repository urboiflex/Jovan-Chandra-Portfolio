import test from 'node:test';
import assert from 'node:assert/strict';

import {
  getProjectIdFromPath,
  getProjectPath,
  getWorksThumbnailMotion,
  getWorksThumbnailPlacement,
  getWorksStickyExitDistance,
  shouldInitializeWorksArchive,
} from './worksArchive.js';

test('keeps the thumbnail rail abstract by repeating a varied seven-item placement rhythm', () => {
  assert.deepEqual(getWorksThumbnailPlacement(0), { left: 29, width: 18, aspect: 1.5 });
  assert.deepEqual(getWorksThumbnailPlacement(1), { left: 8, width: 13, aspect: 1.58 });
  assert.deepEqual(getWorksThumbnailPlacement(7), { left: 29, width: 18, aspect: 1.5 });
});

test('makes the thumbnail at the viewport centre dominant without hiding nearby projects', () => {
  assert.deepEqual(getWorksThumbnailMotion(0), { opacity: 1, scale: 1 });
  assert.deepEqual(getWorksThumbnailMotion(0.5), { opacity: 0.7, scale: 0.9 });
  assert.deepEqual(getWorksThumbnailMotion(2), { opacity: 0.4, scale: 0.8 });
});

test('round-trips project identifiers through dedicated Works routes', () => {
  assert.equal(getProjectPath('02'), '/works/02/');
  assert.equal(getProjectIdFromPath('/works/02/'), '02');
  assert.equal(getProjectIdFromPath('/works/02'), '02');
  assert.equal(getProjectIdFromPath('/works/'), null);
});

test('waits for both page readiness and animation runtimes before initializing the archive', () => {
  assert.equal(shouldInitializeWorksArchive({ isLoaded: false, hasGsap: true, hasScrollTrigger: true }), false);
  assert.equal(shouldInitializeWorksArchive({ isLoaded: true, hasGsap: false, hasScrollTrigger: true }), false);
  assert.equal(shouldInitializeWorksArchive({ isLoaded: true, hasGsap: true, hasScrollTrigger: true }), true);
});

test('keeps the final project pinned when no following archive content needs an exit runway', () => {
  assert.equal(getWorksStickyExitDistance(false), 0);
  assert.equal(getWorksStickyExitDistance(true), -100);
});
