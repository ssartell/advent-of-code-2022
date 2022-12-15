import * as R from 'ramda';
import { hasOverlap, length, union } from '../utils/range.js';
import { manhattan, sub } from '../utils/vec2.js';
import m from 'mnemonist';
let { Queue } = m;

const lineRegex = /Sensor at x=(-?\d*), y=(-?\d*): closest beacon is at x=(-?\d*), y=(-?\d*)/;
const readLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt), ([x1, y1, x2, y2]) => ({ pos: {x: x1, y: y1}, beacon: {x: x2, y: y2} }));
const parseInput = R.pipe(R.split('\n'), R.map(readLine));

const getRowRange = R.curry((row, {pos, beacon}) => {
  let dist = manhattan(sub(pos, beacon));
  let leftOver = dist - manhattan(sub(pos, { x: pos.x, y: row }));
  return leftOver > 0 ? [pos.x - leftOver, pos.x + leftOver] : null;
});

const mergeRanges = ranges => {
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
}

export default R.pipe(parseInput, R.map(getRowRange(2000000)), R.filter(x => x !== null), mergeRanges, R.map(length), R.sum);