import * as R from 'ramda';
import { fromArray, toString } from '../utils/vec3.js';
import { getCardinalNeighbors, getBounds, getValue, setValue, isInBounds } from '../utils/map-grid-3d.js';
import { bfs } from '../utils/graph-traversal.js';

const parseInput = R.pipe(R.split('\n'), R.map(R.pipe(R.split(','), R.map(parseInt), fromArray)));

const findSurfaceArea = droplets => {
  const lava = new Map();
  for(let drop of droplets) {
    setValue(lava, drop, '@');
  }
  
  let tightBounds = getBounds(lava);
  let bounds = { 
    minX: tightBounds.minX - 1,
    maxX: tightBounds.maxX + 1,
    minY: tightBounds.minY - 1,
    maxY: tightBounds.maxY + 1,
    minZ: tightBounds.minZ - 1,
    maxZ: tightBounds.maxZ + 1,
  };
  let start = {x: bounds.minX, y: bounds.minY, z: bounds.minZ };
  let area = 0;
  let isEnd = x => {
    if (getValue(lava, x) !== '@') {
      for(let n of getCardinalNeighbors(x)) {
        if (getValue(lava, n) === '@') {
          area++;
        }
      }
    }
    return false;
  };
  let getNeighbors = x => getValue(lava, x) === '@' ? [] : getCardinalNeighbors(x).filter(isInBounds(bounds));

  bfs(start, isEnd, getNeighbors, toString);
  return area;
}

export default R.pipe(parseInput, findSurfaceArea);