import * as R from 'ramda';
import { createEmptyGrid, getSize, getValue, gridPositions, isInBounds, setValue } from '../utils/grid.js';
import { add, rotate90 } from '../utils/vec2.js';

const parseInput = R.pipe(R.split('\n'), R.map(R.split('')), R.map(R.map(parseInt)));

const getScenicScores = map => {
  let size = getSize(map);
  let scoreMap = createEmptyGrid(size.x, size.y);
  
  for(let pos of gridPositions(map)) {
    let dir = {x: 1, y: 0};
    let treeHeight = getValue(map, pos);
    let score = 1;
    for(let i = 0; i < 4; i++) {
      let viewPos = add(pos, dir);
      let dist = 0;
      while(isInBounds(map, viewPos) && getValue(map, viewPos) < treeHeight) {
        dist++;
        viewPos = add(viewPos, dir);
      }
      score *= dist + (isInBounds(map, viewPos) ? 1 : 0);
      dir = rotate90(dir);
    }
    setValue(scoreMap, pos, score);
  }
  return scoreMap
};

export default R.pipe(parseInput, getScenicScores, R.flatten, R.reduce(R.max, 0));