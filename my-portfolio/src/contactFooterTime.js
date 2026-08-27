const STATUS_WINDOWS = [
  { start: 1, end: 9, label: 'Still sleeping' },
  { start: 9, end: 11, label: 'Probably taking breakfast' },
  { start: 11, end: 13, label: 'Probably taking lunch' },
  { start: 13, end: 18, label: 'Probably working or doing other things' },
  { start: 18, end: 20, label: 'Probably going to the gym' },
  { start: 21, end: 22, label: 'Probably eating dinner' },
  { start: 22, end: 24, label: 'Doing additional work at home' },
];

export const getAvailabilityStatus = (rawHour) => {
  const hour = ((Math.trunc(rawHour) % 24) + 24) % 24;
  return STATUS_WINDOWS.find(({ start, end }) => hour >= start && hour < end)?.label
    ?? 'Probably taking a short break';
};

export const getZonedClock = (date, timeZone) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const value = (type) => parts.find((part) => part.type === type)?.value ?? '00';
  const hour = Number(value('hour'));

  return {
    time: `${value('hour')}:${value('minute')}:${value('second')}`,
    status: getAvailabilityStatus(hour),
  };
};

export const advanceClockState = (state, nextClock) => ({
  current: nextClock,
  previous: state.current,
  tick: state.tick + 1,
});

const CLOCK_SEGMENTS = ['hour', 'minute', 'second'];

export const getChangedClockSegments = (previousTime, currentTime) => {
  const previous = previousTime.split(':');
  const current = currentTime.split(':');
  return CLOCK_SEGMENTS.filter((_, index) => previous[index] !== current[index]);
};
