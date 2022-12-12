import * as R from 'ramda';
import { aStar } from '../utils/graph-traversal.js';
import { getValue, indexOf, getCardinalNeighbors, gridPositions, setValue } from '../utils/grid.js';
import { equals, manhattan, toString } from '../utils/vec2.js';

const debug = x => { 
  debugger; 
  return x; 
};

const toElevation = x => 'SabcdefghijklmnopqrstuvwxyzE'.indexOf(x);
const fromElevation = x => 'SabcdefghijklmnopqrstuvwxyzE'[x];
const parseInput = R.pipe(R.split('\n'), R.map(R.pipe(R.split(''), R.map(toElevation))));

const findPath = grid => {
  let startPos = { ...indexOf(grid, toElevation('S')), cost: 0, elevation: 's' };
  setValue(grid, startPos, toElevation('a'));
  let endPos = indexOf(grid, toElevation('E'));
  setValue(grid, endPos, toElevation('z'));
  const isEnd = n => equals(n, endPos);
  const getNeighbors = n => getCardinalNeighbors(grid, n)
    .filter(x => getValue(grid, x) - getValue(grid, n) <= 1)
    .map(x => ({ ...x, cost: n.cost + 1, prev: n, elevation: fromElevation(getValue(grid, x)) }));
  const g = n => n.cost;
  const h = n => manhattan(n, endPos);
  return { grid, route: aStar(startPos, isEnd, getNeighbors, g, h, toString) };
};

const getPath = n => n.prev ? R.append(n, getPath(n.prev)) : [n];
const printMap = ({grid, route }) => {
  let path = getPath(route);
  let s = new Set(path.map(toString));
  let str = '';
  for(let pos of gridPositions(grid)) {
    if (pos.x === 0) {
      str += '\n';
    }
    if (R.any(x => equals(pos, x), path)) {
      str += '#'
    } else {
      str += fromElevation(getValue(grid, pos));
    }
  }
  console.log(str);
}

export default R.pipe(parseInput, findPath, printMap);