import * as R from 'ramda';
import m from 'mnemonist';
let { Queue } = m;

export const isBelowRange = (range, x) => x < range[0];
export const isAboveRange = (range, x) => range[1] < x;
export const isInRange = (range, x) => range[0] <= x && x <= range[1];
export const hasOverlap = (a, b) => !(a[1] < b[0] || b[1] < a[0]);
export const intersection = (a, b) => hasOverlap(a, b) ? [Math.max(a[0], b[0]), Math.max(a[1], b[1])] : null;
export const union = (a, b) => hasOverlap(a, b) ? [Math.min(a[0], b[0]), Math.max(a[1], b[1])] : null;
export const gap = (a, b) => [Math.min(a[1], b[1]) + 1, Math.max(a[0], b[0]) - 1];
export const length = r => r[1] - r[0];

export const mergeRanges = ranges => {
  let toMerge = Queue.from(ranges);
  let merged = new Set();
  while (toMerge.peek()) {
    let range = toMerge.dequeue();
    let overlappingRange = R.find(b => hasOverlap(range, b), [...merged]);
    if (overlappingRange) {
      toMerge.enqueue(union(range, overlappingRange));
      merged.delete(overlappingRange);
    } else {
      merged.add(range);
    }
  }
  return [...merged];
};