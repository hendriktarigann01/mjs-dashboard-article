/**
 * Helper — supports string (old data) or array (new data)
 * Always returns the first URL string or undefined if empty
 */

export const getFirstImage = (value) => {
  if (!value) return undefined;
  if (Array.isArray(value)) return value[0];
  return value;
};
