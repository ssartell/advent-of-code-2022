import * as R from 'ramda';
import { bfs } from '../utils/graph-traversal.js';
import { getValue, indexOf, getCardinalNeighbors, setValue } from '../utils/grid.js';
import { equals, toString } from '../utils/vec2.js';

const parseInput = R.pipe(R.split('\n'), R.map(R.split('')));

const findPath = grid => {
  let startPos = { ...indexOf(grid, 'S'), cost: 0, height: 0 };
  setValue(grid, startPos, 'a');
  let endPos = indexOf(grid, 'E');
  setValue(grid, endPos, 'z');

  const isEnd = n => equals(n, endPos);
  const getNeighbors = n => getCardinalNeighbors(grid, n)
    .map(x => ({ ...x, cost: n.cost + 1, height: getValue(grid, x).charCodeAt(0) - 97 }))
    .filter(x => x.height - n.height <= 1);
  return bfs(startPos, isEnd, getNeighbors, toString);
};

export default R.pipe(parseInput, findPath, x => x.cost);