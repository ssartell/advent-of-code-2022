export const hasOverlap = (a, b) => !(a[1] < b[0] || b[1] < a[0]);
export const intersection = (a, b) => hasOverlap(a, b) ? [Math.max(a[0], b[0]), Math.max(a[1], b[1])] : null;
export const union = (a, b) => hasOverlap(a, b) ? [Math.min(a[0], b[0]), Math.max(a[1], b[1])] : null;
export const gap = (a, b) => [Math.min(a[1], b[1]) + 1, Math.max(a[0], b[0]) - 1];
export const length = r => r[1] - r[0];