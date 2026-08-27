const COMPACT_TECHNOLOGY_LIMIT = 10;

export const getCompactProjectTools = (tools = []) => (
  tools.length > COMPACT_TECHNOLOGY_LIMIT
    ? [...tools.slice(0, COMPACT_TECHNOLOGY_LIMIT), 'and more…']
    : tools
);
