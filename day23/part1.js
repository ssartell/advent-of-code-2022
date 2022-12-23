import * as R from 'ramda';
import { gridPositions, getValue as getGridValue } from '../utils/grid.js';
import { getValue, setValue, getBounds, getPositions, getNeighbors } from '../utils/map-grid.js';
import { add, toString, rotate90, rotate270 } from '../utils/vec2.js';
import { mod } from '../utils/math.js';

const parseInput = R.pipe(R.split('\n'), R.map(R.split('')));

const toMap = grid => {
  let map = new Map();
  for(let pos of gridPositions(grid)) {
    if (getGridValue(grid, pos) === '#') {
      setValue(map, pos, '#');
    }
  }
  return map;
};

const dirs = [{x: 0, y: -1}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 1, y: 0}];

const isTileFree = R.curry((map, x) => getValue(map, x) !== '#');
const isDirFree = (map, pos, dir) => {
  let target = add(pos, dir);
  let adjacent = [add(target, rotate90(dir)), target, add(target, rotate270(dir))];
  return R.all(isTileFree(map), adjacent);
};

const proposeMoves = (map, dirIndex) => {
  let counts = new Map();
  let moves = new Map();

  for(let elf of getPositions(map)) {
    let moved = false;
    if (R.any(x => !isTileFree(map, x), getNeighbors(map, elf)))
    {
      for(let i = 0; i < dirs.length; i++) {
        let dir = dirs[mod(dirIndex + i, dirs.length)];
        if (!isDirFree(map, elf, dir))
          continue;
  
        let target = add(elf, dir);
        setValue(counts, target, (getValue(counts, target) ?? 0) + 1);
        setValue(moves, elf, target);
        moved = true;
        break;
      }
    }    
    
    if (!moved) {
      setValue(moves, elf, elf);
      setValue(counts, elf, 1);
    }
  }
  return { moves, counts };
};

const finalizeMoves = (map, { moves, counts }) => {
  let newMap = new Map();

  for(let elf of getPositions(map)) {
    let target = getValue(moves, elf);
    if (!target) debugger;
    let count = getValue(counts, target) ?? 0;
    if (count > 1) {
      setValue(newMap, elf, '#');
    } else {
      setValue(newMap, target, '#');
    }
  }
  return newMap;
};

const simulateRounds = R.curry((rounds, map) => {
  for(let i = 0; i < rounds; i++) {
    let proposed = proposeMoves(map, i);
    map = finalizeMoves(map, proposed);
  }
  return map;
});

const print = map => {
  let str = '';
  let bounds = getBounds(map);
  for(let y = bounds.minY; y <= bounds.maxY; y++) {
    for(let x = bounds.minX; x <= bounds.maxX; x++) {
      str += getValue(map, { x, y }) ?? '.';
    }
    str += '\n'
  }
  console.log(str);
}

const countEmptyTiles = map => {
  let bounds = getBounds(map);
  return (bounds.maxX - bounds.minX + 1) * (bounds.maxY - bounds.minY + 1) - map.size;
};

export default R.pipe(parseInput, toMap, simulateRounds(10), countEmptyTiles);