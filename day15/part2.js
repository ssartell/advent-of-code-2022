import * as R from 'ramda';
import { isBelowRange } from '../utils/range.js';
import { manhattan, sub } from '../utils/vec2.js';

const lineRegex = /Sensor at x=(-?\d*), y=(-?\d*): closest beacon is at x=(-?\d*), y=(-?\d*)/;
const readLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt), ([x1, y1, x2, y2]) => ({ pos: {x: x1, y: y1}, beacon: {x: x2, y: y2} }));
const parseInput = R.pipe(R.split('\n'), R.map(readLine));

const getRowRange = R.curry((row, {pos, beacon}) => {
  let dist = manhattan(sub(pos, beacon));
  let leftOver = dist - manhattan(sub(pos, { x: pos.x, y: row }));
  return leftOver > 0 ? [pos.x - leftOver, pos.x + leftOver] : null;
});

const getRowRanges = (row, sensors) => R.pipe(R.map(getRowRange(row)), R.filter(x => x !== null))(sensors);

const findBeacon = sensors => {
  for(let y = 0; y <= 4000000; y++) {
    let ranges = R.sortBy(x => x[0], getRowRanges(y, sensors));
    let x = 0;
    for(let range of ranges) {
      if (isBelowRange(range, x)) return { x, y };
      x = R.max(x, range[1] + 1);
      if (x > 4000000) break;
    }
  }
  return null;
};

const getTuningFrequency = pos => pos.x * 4000000 + pos.y;

export default R.pipe(parseInput, findBeacon, getTuningFrequency);