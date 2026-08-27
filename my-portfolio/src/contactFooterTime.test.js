import test from 'node:test';
import assert from 'node:assert/strict';

import { advanceClockState, getAvailabilityStatus, getChangedClockSegments } from './contactFooterTime.js';

test('maps every requested daily time window to its matching availability status', () => {
  const cases = [
    [0, 'Probably taking a short break'],
    [1, 'Still sleeping'],
    [8, 'Still sleeping'],
    [9, 'Probably taking breakfast'],
    [10, 'Probably taking breakfast'],
    [11, 'Probably taking lunch'],
    [12, 'Probably taking lunch'],
    [13, 'Probably working or doing other things'],
    [17, 'Probably working or doing other things'],
    [18, 'Probably going to the gym'],
    [19, 'Probably going to the gym'],
    [20, 'Probably taking a short break'],
    [21, 'Probably eating dinner'],
    [22, 'Doing additional work at home'],
    [23, 'Doing additional work at home'],
  ];

  for (const [hour, expected] of cases) {
    assert.equal(getAvailabilityStatus(hour), expected);
  }
});

test('normalizes overflowing and negative clock hours before selecting a status', () => {
  assert.equal(getAvailabilityStatus(24), 'Probably taking a short break');
  assert.equal(getAvailabilityStatus(-1), 'Doing additional work at home');
});

test('retains the outgoing clock value while advancing to the next tick', () => {
  const current = { time: '17:59:59', status: 'Probably working or doing other things' };
  const next = { time: '18:00:00', status: 'Probably going to the gym' };

  assert.deepEqual(advanceClockState({ current, previous: null, tick: 7 }, next), {
    current: next,
    previous: current,
    tick: 8,
  });
});

test('animates only clock segments whose displayed value changed', () => {
  assert.deepEqual(getChangedClockSegments('17:24:08', '17:24:09'), ['second']);
  assert.deepEqual(getChangedClockSegments('17:24:59', '17:25:00'), ['minute', 'second']);
  assert.deepEqual(getChangedClockSegments('17:59:59', '18:00:00'), ['hour', 'minute', 'second']);
});
