import * as R from 'ramda';
import { gridPositions, createEmptyGrid, getSize, setValue, getValue } from '../utils/grid.js';

const parseInput = R.pipe(R.split('\n'), R.map(R.split('')), R.map(R.map(parseInt)));

const projectAngle = R.map(R.pipe(R.mapAccum((a, b) => [R.max(a, b), R.max(a, b)], 0), R.last, R.prepend(-1), R.init));
const flip = R.pipe(R.reverse, R.transpose);

const viewAngles = map => {
  let angles = [];
  for(let i = 0; i < 4; i++) {
    angles.push(projectAngle(map));
    map = flip(map);
    angles = angles.map(flip);
  }
  return angles;
};

const findVisibleTrees = map => {
  let angles = viewAngles(map);
  let size = getSize(map);
  let visibleMap = createEmptyGrid(size.x, size.y);
  for(let pos of gridPositions(map)) {
    setValue(visibleMap, pos, R.any(x => getValue(x, pos) < getValue(map, pos), angles) ? 1 : 0);
  }
  return visibleMap;
};

const countTrees = R.pipe(R.flatten, R.sum);

export default R.pipe(parseInput, findVisibleTrees, countTrees);