import * as R from 'ramda';
import { bfs } from '../utils/graph-traversal.js';
import { getValue, indexOf, getCardinalNeighbors, setValue } from '../utils/grid.js';
import { toString } from '../utils/vec2.js';

const toElevation = x => 'SabcdefghijklmnopqrstuvwxyzE'.indexOf(x);
const parseInput = R.pipe(R.split('\n'), R.map(R.pipe(R.split(''), R.map(toElevation))));

const findPath = grid => {
  let startPos = { ...indexOf(grid, toElevation('E')), cost: 0, elevation: 'E' };
  setValue(grid, startPos, toElevation('z'));
  const isEnd = n => getValue(grid, n) === toElevation('a');
  const getNeighbors = n => getCardinalNeighbors(grid, n)
    .filter(x => getValue(grid, n) - getValue(grid, x) <= 1)
    .map(x => ({ ...x, cost: n.cost + 1 }));
  return bfs(startPos, isEnd, getNeighbors, toString);
};

export default R.pipe(parseInput, findPath, x => x.cost);