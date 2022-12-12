import * as R from 'ramda';
import { bfs } from '../utils/graph-traversal.js';
import { getValue, indexOf, getCardinalNeighbors, gridPositions, setValue } from '../utils/grid.js';
import { equals, toString } from '../utils/vec2.js';

const toElevation = x => 'SabcdefghijklmnopqrstuvwxyzE'.indexOf(x);
const parseInput = R.pipe(R.split('\n'), R.map(R.pipe(R.split(''), R.map(toElevation))));

const findPath = grid => {
  let startPos = { ...indexOf(grid, toElevation('S')), cost: 0, elevation: 's' };
  setValue(grid, startPos, toElevation('a'));
  let endPos = indexOf(grid, toElevation('E'));
  setValue(grid, endPos, toElevation('z'));
  const isEnd = n => equals(n, endPos);
  const getNeighbors = n => getCardinalNeighbors(grid, n)
    .filter(x => getValue(grid, x) - getValue(grid, n) <= 1)
    .map(x => ({ ...x, cost: n.cost + 1 }));
  return bfs(startPos, isEnd, getNeighbors, toString);
};

export default R.pipe(parseInput, findPath, x => x.cost);