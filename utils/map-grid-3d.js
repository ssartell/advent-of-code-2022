import * as R from 'ramda';
import { add, toString, fromString } from './vec3.js';
import { min, max } from './ramda.js';

export const getNeighbors = pos => {
  const neighbors = [];
  for(let z = -1; z <= 1; z++) {
    for(let y = -1; y <= 1; y++) {
      for(let x = -1; x <= 1; x++) {
        if(x === 0 && y === 0 && z === 0) continue;
        const neighbor = add(pos, {x, y, z});
        neighbors.push(neighbor);
      }
    }
  }  
  return neighbors;
};

export const getNeighborsAndSelf = pos => {
  const neighbors = [];
  for(let z = -1; z <= 1; z++) {
    for(let y = -1; y <= 1; y++) {
      for(let x = -1; x <= 1; x++) {
        const neighbor = add(pos, {x, y, z});
        neighbors.push(neighbor);
      }
    }
  }  
  return neighbors;
};

export const getCardinalNeighbors = pos => {
  const neighbors = [];
  for(let z = -1; z <= 1; z++) {
    for(let y = -1; y <= 1; y++) {
      for(let x = -1; x <= 1; x++) {
        if(Math.abs(x) + Math.abs(y) + Math.abs(z) !== 1) continue;
        const neighbor = add(pos, {x, y, z});
        neighbors.push(neighbor);
      }
    }
  }  
  return neighbors;
};

export const getValue = R.curry((grid, pos, defaultValue = () => undefined) => {
  const key = toString(pos);
  if (grid.has(key)) return grid.get(key);
  return defaultValue();
});

export const setValue = R.curry((grid, pos, value) => {
  grid.set(toString(pos), value);
});

export const removeValue = R.curry((grid, pos) => {
  grid.delete(toString(pos));
});

export const readValues = grid => [...grid.values()];

export const getBounds = grid => {
  let pos = [...grid.keys()].map(fromString);
  let minX = min(pos.map(x => x.x));
  let maxX = max(pos.map(x => x.x));
  let minY = min(pos.map(x => x.y));  
  let maxY = max(pos.map(x => x.y));
  let minZ = min(pos.map(x => x.z));
  let maxZ = max(pos.map(x => x.z));
  return { minX, maxX, minY, maxY, minZ, maxZ };
};

export const isInBounds = R.curry((bounds, pos) => {
  return bounds.minX <= pos.x && pos.x <= bounds.maxX
    && bounds.minY <= pos.y && pos.y <= bounds.maxY
    && bounds.minZ <= pos.z && pos.z <= bounds.maxZ;
});