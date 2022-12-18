import * as R from 'ramda';
import { fromArray } from '../utils/vec3.js';
import { getCardinalNeighbors, getValue, setValue } from '../utils/map-grid-3d.js';

const parseInput = R.pipe(R.split('\n'), R.map(R.pipe(R.split(','), R.map(parseInt), fromArray)));

const findSurfaceArea = droplets => {
  let area = 0;
  const lava = new Map();
  for(let drop of droplets) {
    setValue(lava, drop, '@');
    for(let side of getCardinalNeighbors(lava, drop)) {
      area += getValue(lava, side) === '@' ? -1 : 1;
    }
  }
  return area;
}

export default R.pipe(parseInput, findSurfaceArea);