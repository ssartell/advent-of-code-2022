import * as R from 'ramda';
import { add, toString, fromString } from './vec2.js';
import { min, max } from './ramda.js';

export const getPositions = grid => {
  let positions = []
  for(let key of grid.keys()) {
    positions.push(fromString(key));
  }
  return positions;
};

export const getAllPositions = grid => {
  let bounds = getBounds(grid);
  const positions = [];
  for(let y = bounds.minY; y < bounds.maxY; y++) {
    for(let x = bounds.minX; y < bounds.maxX; x++) {
      positions.push({x, y});
    }
  }
  return positions;
};

export const getNeighbors = R.curry((grid, pos) => {
  const neighbors = [];
  for(let y = -1; y <= 1; y++) {
    for(let x = -1; x <= 1; x++) {
      if(x === 0 && y === 0) continue;
      const neighbor = add(pos, {x, y});
      neighbors.push(neighbor);
    }
  }
  return neighbors;
});

export const getNeighborsAndSelf = R.curry((grid, pos) => {
  const neighbors = [];
  for(let y = -1; y <= 1; y++) {
    for(let x = -1; x <= 1; x++) {
      const neighbor = add(pos, {x, y});
      neighbors.push(neighbor);
    }
  }
  return neighbors;
});

export const getValue = R.curry((grid, pos, defaultValue = () => undefined) => {
  const key = toString(pos);
  if (grid.has(key)) return grid.get(key);
  return defaultValue();
});

export const setValue = R.curry((grid, pos, value) => {
  grid.set(toString(pos), value);
});

export const readValues = grid => [...grid.values()];

export const getBounds = grid => {
  let pos = [...grid.keys()].map(fromString);
  let minX = min(pos.map(x => x.x));
  let maxX = max(pos.map(x => x.x));
  let minY = min(pos.map(x => x.y));  
  let maxY = max(pos.map(x => x.y));
  return { minX, maxX, minY, maxY };
};