const THUMBNAIL_PATTERN = [
  { left: 29, width: 18, aspect: 1.5 },
  { left: 8, width: 13, aspect: 1.58 },
  { left: 40, width: 11, aspect: 1.45 },
  { left: 18, width: 15, aspect: 1.6 },
  { left: 2, width: 12, aspect: 1.55 },
  { left: 34, width: 10, aspect: 1.5 },
  { left: 50, width: 9, aspect: 1.5 },
];

export const getWorksThumbnailPlacement = (index) => (
  THUMBNAIL_PATTERN[index % THUMBNAIL_PATTERN.length]
);

export const getWorksThumbnailMotion = (distanceFromCentre) => {
  const distance = Math.min(1, Math.max(0, Math.abs(distanceFromCentre)));
  return {
    opacity: Number((1 - distance * 0.6).toFixed(2)),
    scale: Number((1 - distance * 0.2).toFixed(2)),
  };
};

export const getProjectPath = (projectId) => `/works/${encodeURIComponent(projectId)}/`;

export const getProjectIdFromPath = (pathname) => {
  const match = pathname.match(/^\/works\/([^/]+)\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
};

export const shouldInitializeWorksArchive = ({ isLoaded, hasGsap, hasScrollTrigger }) => (
  Boolean(isLoaded && hasGsap && hasScrollTrigger)
);

export const getWorksStickyExitDistance = (hasFollowingContent) => (hasFollowingContent ? -100 : 0);
