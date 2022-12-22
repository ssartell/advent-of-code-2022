import * as R from 'ramda';
import { add, rotate90, rotate270, rotate180, toString } from '../utils/vec2.js';
import { getValue, isInBounds, setValue } from '../utils/grid.js';

const debug = x => { 
  debugger; 
  return x; 
};

const fillOut = grid => {
  let maxWidth = R.reduce((a, x) => Math.max(a, x.length), 0, grid);
  for(let y = 0; y < grid.length; y++) {
    for(let x = 0; x < maxWidth; x++) {
      let pos = { x, y };
      if (!getValue(grid, pos)) {
        setValue(grid, pos, ' ');
      }
    }
  }
  return grid;
}

const tryParseInt = x => isNaN(parseInt(x)) ? x : parseInt(x);
const toGrid = R.pipe(R.split('\n'), R.map(R.split('')), fillOut);
const toSteps = R.pipe(R.converge(R.zip, [R.split(/\d+/), R.split(/\D+/)]), R.flatten, R.filter(x => x !== ''), R.map(tryParseInt));
const parseInput = R.pipe(R.split('\n\n'), R.zipObj(['board', 'steps']), R.evolve({ board: toGrid, steps: toSteps }));

const wrapPos = (board, pos, dir) => {
  let wrapDir = rotate180(dir);
  let target = add(pos, wrapDir);
  while(getValue(board, target) !== ' ' && isInBounds(board, target)) {
    pos = target;
    target = add(pos, wrapDir);
  }
  return pos;
};

const walkPath = ({board, steps}) => {
  let pos = { x: R.indexOf('.', board[0]), y: 0 };
  let dir = { x: 1, y: 0 };

  let path = new Map();
  path.set(toString(pos), dir);
  
  for(let step of steps) {
    if (Number.isInteger(step)) {
      for(let i = 0; i < step; i++) {
        let target = add(pos, dir);
        let targetValue = getValue(board, target);
        if (targetValue === '.') {
          pos = target;
          path.set(toString(pos), dir);
        } else if (targetValue === '#') {
          break;
        } else {
          let wrapTarget = wrapPos(board, pos, dir);
          if (getValue(board, wrapTarget) === '.') {
            pos = wrapTarget;
            path.set(toString(pos), dir);
          } else {
            // hit a wall during wrap
            break;
          }
        }
      }
    } else {
      if (step === 'R') {
        dir = rotate90(dir);
      } else if (step === 'L') {
        dir = rotate270(dir);
      }
      path.set(toString(pos), dir);
    }
  }

  // print(board, path);

  return { pos, dir };
};

const getPassword = ({ pos, dir }) => {
  return 1000 * (pos.y + 1) 
    + 4 * (pos.x + 1)
    + (dir.x === 1 ? 0 : dir.y === -1 ? 3 : dir.x === -1 ? 2 : 1);
};

const print = (board, path) => {
  let str = ''
  for(let y = 0; y < board.length; y++) {
    for(let x = 0; x < board[0].length; x++) {
      let key = toString({x, y});
      if (path.has(key)) {
        let dir = path.get(key);
        str += (dir.x === 1 ? '>' : dir.y === -1 ? '^' : dir.x === -1 ? '<' : 'v')
      } else {
        if (board[y][x] === undefined) debugger;
        str += board[y][x];
      }
    }
    str += '\n'
  }
  console.log(str);
}

export default R.pipe(parseInput, walkPath, getPassword);