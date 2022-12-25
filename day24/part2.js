import * as R from 'ramda';
import { getValue, setValue, gridPositions, getCardinalNeighbors, getSize } from '../utils/grid.js';
import { add, mod, manhattan, equals, toString, sub } from '../utils/vec2.js';
import { aStar } from '../utils/graph-traversal.js'

const debug = x => { 
  debugger; 
  return x; 
};

const ones = {x: 1, y: 1};
const dirs = {
  '>': { x:  1, y:  0 },
  '<': { x: -1, y:  0 },
  '^': { x:  0, y: -1 },
  'v': { x:  0, y:  1 },
};

const parseInput = R.pipe(R.split('\n'), R.map(R.split('')));

const findBlizzards = grid => {
  let blizzards = [];
  let positions = new Set();
  for(let pos of gridPositions(grid)) {
    let val = getValue(grid, pos);
    if (val === '#') continue;
    if (val === '.') continue;
    let dir = dirs[val];
    positions.add(toString(pos));
    blizzards.push({ dir, pos });
    setValue(grid, pos, '.');
  }
  return { grid, blizzards, positions };
};

const stepBlizzards = (grid, { blizzards }) => {
  let size = sub(getSize(grid), { x: 2, y: 2});
  let positions = new Set();
  let newBlizzards = [];
  for(let { pos, dir } of blizzards) {
    pos = add(pos, dir);
    pos = add(mod(sub(pos, ones), size), ones);
    newBlizzards.push({ pos, dir });
    positions.add(toString(pos));
  }
  return { blizzards: newBlizzards, positions };
};

const print = (grid, positions) => {
  let str = '';
  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < grid[0].length; x++) {
      let pos = { x, y };
      let val = getValue(grid, pos);
      if (val === '#') {
        str += '#';
      } else if (positions.has(toString(pos))) {
        str += '@';
      } else {
        str += '.'
      }
    }
    str += '\n';
  }
  console.log(str);
}

const findFastestPath = init => {
  let { grid, blizzards, positions } = findBlizzards(init);
  let states = [{ blizzards, positions }];
  let size = getSize(grid);
  let startPos = { x: 1, y: 0 };
  let endPos = { x: size.x - 2, y: size.y - 1};

  const isEnd = x => equals(x.pos, endPos);
  const getNeighbors = x => {
    let nextMinute = x.minute + 1;
    if (states.length - 1 < nextMinute) {
      states[nextMinute] = stepBlizzards(grid, states[x.minute]);
    }

    return [x.pos, ...getCardinalNeighbors(grid, x.pos)]
      .filter(n => getValue(grid, n) === '.')
      .filter(n => !states[nextMinute].positions.has(toString(n)))
      .map(n => ({ minute: nextMinute, pos: n}));
  };
  const g = x => x.minute;
  const h = x => {
    return manhattan(sub(x.pos, endPos));
  };
  const getKey = x => `${x.minute}|${toString(x.pos)}`;

  let leg1 = aStar({ minute: 0, pos: startPos }, isEnd, getNeighbors, g, h, getKey);
  let temp = startPos;
  startPos = endPos;
  endPos = temp;
  let leg2 = aStar({ minute: leg1.minute, pos: startPos }, isEnd, getNeighbors, g, h, getKey);
  temp = startPos;
  startPos = endPos;
  endPos = temp;
  let leg3 = aStar({ minute: leg2.minute, pos: startPos }, isEnd, getNeighbors, g, h, getKey);

  return leg3.minute;
};

export default R.pipe(parseInput, findFastestPath);