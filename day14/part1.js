import * as R from 'ramda';
import { add, clamp, fromArray, length, sub } from '../utils/vec2.js';
import { getValue, setValue, getBounds } from '../utils/map-grid.js';

const debug = x => { 
  debugger; 
  return x; 
};

const readLine = R.pipe(R.split(' -> '), R.map(R.pipe(R.split(','), R.map(parseInt), fromArray)));
const parseInput = R.pipe(R.split('\n'), R.map(readLine));

const createGrid = rockLines => {
  let grid = new Map();
  for(let rockLine of rockLines) {
    for(let [a, b] of R.zip(rockLine, R.tail(rockLine))) {
      let diff = sub(b, a);
      let dist = length(diff);
      let dir = clamp(diff, -1, 1);
      let pos = a;
      for(let i = 0; i <= dist; i++) {
        setValue(grid, pos, '#');
        pos = add(pos, dir);
      }
    }
  }
  return grid;
};

const print = R.curry((grid, bounds = null) => {
  bounds = bounds ?? getBounds(grid);
  let str = '';
  for(let y = bounds.minY; y <= bounds.maxY; y++) {
    for(let x = bounds.minX; x <= bounds.maxX; x++) {
      str += getValue(grid, {x, y}) ?? '.';
    }  
    str += '\n'
  }
  console.log(str);
});

const isEmpty = (grid, sand, dir) => !getValue(grid, add(sand, dir));

const simulateSand = grid => {
  let bottom = getBounds(grid).maxY;
  let source = { x: 500, y: 0 };
  let flowDirs = [{ x: 0, y: 1 }, { x: -1, y: 1 }, { x: 1, y: 1 }];
  let inAbyss = false;
  let unitCount = 0;

  while(!inAbyss) {
    let sand = source;
    let atRest = false;

    while(!atRest && !inAbyss) {
      let dir = R.find(x => isEmpty(grid, sand, x), flowDirs);
      if (dir) {
        sand = add(sand, dir);
      } else {
        setValue(grid, sand, 'o');
        atRest = true;
        unitCount++;
      }

      if (sand.y > bottom) {
        inAbyss = true;
      }
    }
  }

  return unitCount;
}

export default R.pipe(parseInput, createGrid, simulateSand);