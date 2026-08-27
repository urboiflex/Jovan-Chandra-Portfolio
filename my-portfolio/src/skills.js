const makeSkills = (names) => names.map((name) => ({ name }));

export const FRONTEND_SKILLS = makeSkills([
  'HTML',
  'CSS',
  'Javascript',
  'Typescript',
  'React',
  'Next.js',
  'Tailwind',
  'Bootstrap',
]);

export const BACKEND_SKILLS = makeSkills([
  'Node.js',
  'Express.js',
  'Python',
  'Java',
  'C#',
  '.NET',
]);

export const ANIMATION_SKILLS = makeSkills([
  'GSAP',
  'Lenis',
  'WebGL',
]);

export const DATABASE_SKILLS = makeSkills([
  'MySQL',
  'PostgreSQL',
  'Supabase',
]);

export const TOOL_SKILLS = makeSkills([
  'Vercel',
  'Github',
  'Cloudflare',
]);

export const DESIGN_SKILLS = makeSkills([
  'Figma',
  'Canva',
]);

export const SKILL_GROUPS = [
  { id: 'frontend', label: 'Frontend', skills: FRONTEND_SKILLS },
  { id: 'backend', label: 'Backend', skills: BACKEND_SKILLS },
  { id: 'animation', label: 'Animation', skills: ANIMATION_SKILLS },
  { id: 'database', label: 'Database', skills: DATABASE_SKILLS },
  { id: 'tools', label: 'Tools', skills: TOOL_SKILLS },
  { id: 'design', label: 'Design', skills: DESIGN_SKILLS },
];

export const SKILLS_LINE_SCROLL_TRIGGER = {
  start: 'top 70%',
  end: 'bottom 20%',
  scrub: 1,
};

export const getLineSampleCount = (drawnLength) => {
  if (!Number.isFinite(drawnLength) || drawnLength <= 0) return 0;
  return Math.max(2, Math.min(64, Math.ceil(drawnLength / 48)));
};

export const getLineProgressFromDashOffset = (dashOffset, lineLength) => {
  if (!Number.isFinite(lineLength) || lineLength <= 0) return 0;

  const safeOffset = Number.isFinite(dashOffset)
    ? Math.min(lineLength, Math.max(0, dashOffset))
    : lineLength;

  return 1 - (safeOffset / lineLength);
};

export const getLineDashOffsetForProgress = (progress, lineLength) => {
  if (!Number.isFinite(lineLength) || lineLength <= 0) return 0;

  const safeProgress = Number.isFinite(progress)
    ? Math.min(1, Math.max(0, progress))
    : 0;

  return lineLength * (1 - safeProgress);
};

const parseColor = (value) => {
  const color = String(value ?? '').trim();
  const rgb = color.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);

  if (rgb) {
    return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  }

  const hex = color.match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1];
  if (!hex) return null;

  const normalized = hex.length === 3
    ? hex.split('').map((digit) => `${digit}${digit}`).join('')
    : hex;

  return [0, 2, 4].map((index) => Number.parseInt(normalized.slice(index, index + 2), 16));
};

const relativeLuminance = (value) => {
  const rgb = parseColor(value);
  if (!rgb) return null;

  const channels = rgb.map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });

  return (channels[0] * 0.2126) + (channels[1] * 0.7152) + (channels[2] * 0.0722);
};

export const getLineTextContrastState = ({ lineColor, textColor, overlaps }) => {
  if (!overlaps) return 'dark';

  const lineLuminance = relativeLuminance(lineColor);
  const textLuminance = relativeLuminance(textColor);
  if (lineLuminance === null || textLuminance === null) return 'dark';

  const contrastRatio = (Math.max(lineLuminance, textLuminance) + 0.05)
    / (Math.min(lineLuminance, textLuminance) + 0.05);

  return contrastRatio < 1.4 ? 'light' : 'dark';
};

export const getStableLineContrastState = ({
  currentState = 'dark',
  nextState = 'dark',
  clearFrames = 0,
  clearFrameLimit = 3,
}) => {
  if (nextState === 'light') {
    return { state: 'light', clearFrames: 0 };
  }

  if (currentState !== 'light') {
    return { state: 'dark', clearFrames: 0 };
  }

  const nextClearFrames = Math.max(0, clearFrames) + 1;
  if (nextClearFrames < clearFrameLimit) {
    return { state: 'light', clearFrames: nextClearFrames };
  }

  return { state: 'dark', clearFrames: 0 };
};

export const getNextOpenSkillGroup = (currentId, selectedId) =>
  currentId === selectedId ? currentId : selectedId;

export const getSkillPanelTransition = (prefersReducedMotion) =>
  prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.76, 0, 0.24, 1] };
