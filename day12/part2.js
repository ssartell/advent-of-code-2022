import * as R from 'ramda';
import { bfs } from '../utils/graph-traversal.js';
import { getValue, indexOf, getCardinalNeighbors, setValue } from '../utils/grid.js';
import { toString } from '../utils/vec2.js';

const parseInput = R.pipe(R.split('\n'), R.map(R.split('')));

const findPath = grid => {
  let startPos = { ...indexOf(grid, 'E'), cost: 0, height: 25 };
  setValue(grid, startPos, 'z');

  const isEnd = n => getValue(grid, n) === 'a';
  const getNeighbors = n => getCardinalNeighbors(grid, n)
  .map(x => ({ ...x, cost: n.cost + 1, height: getValue(grid, x).charCodeAt(0) - 97 }))
  .filter(x => n.height - x.height <= 1);
  return bfs(startPos, isEnd, getNeighbors, toString);
};

export default R.pipe(parseInput, findPath, x => x.cost);