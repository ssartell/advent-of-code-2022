import * as R from 'ramda';
import { add, sub, rotate90, rotate270, rotate180, toString, equals } from '../utils/vec2.js';
import { getValue, isInBounds, setValue, gridPositions, getNeighbors, getCardinalNeighbors } from '../utils/grid.js';

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
        grid[y][x] = ' ';
      }
    }
  }
  return grid;
}

const tryParseInt = x => isNaN(parseInt(x)) ? x : parseInt(x);
const toGrid = R.pipe(R.split('\n'), R.map(R.split('')), fillOut);
const toSteps = R.pipe(R.converge(R.zip, [R.split(/\d+/), R.split(/\D+/)]), R.flatten, R.filter(x => x !== ''), R.map(tryParseInt));
const parseInput = R.pipe(R.split('\n\n'), R.zipObj(['board', 'steps']), R.evolve({ board: toGrid, steps: toSteps }));

const findCorners = board => {
  let corners = [];
  for(let pos of gridPositions(board)) {
    let q = 0;
    let dir = null
    for(let neighbor of getNeighbors(board, pos)) {
      if (getValue(board, neighbor) === ' ') {
        dir = sub(neighbor, pos);
      } else {
        q += 1;
      }
    }
    if (q === 7) {
      corners.push({ pos, dir });
    };
  }
  return corners;
};

const stepEdge = (board, walk) => {
  let target = add(walk.pos, walk.dir);
  if (getValue(board, target) === ' ' || !isInBounds(board, target)) {
    // going off a corner
    walk.dir = walk.turnIn(walk.dir);
    walk.in = walk.turnIn(walk.in);
    walk.out = walk.turnIn(walk.out);
    walk.turned = true;
  } else {
    walk.pos = target;
    walk.turned = false;

    let target2 = add(walk.pos, walk.out);
    if (isInBounds(board, target2) && getValue(board, target2) !== ' ') {
      walk.pos = target2;
      walk.dir = walk.turnOut(walk.dir);
      walk.in = walk.turnOut(walk.in);
      walk.out = walk.turnOut(walk.out);
      walk.turned = true;
    }
  }
}

const walkEdge = (board, corners) => {
  let map = new Map();
  let walkerPairs = [];
  for(let { pos, dir } of corners) {
    let dir1 = { x: dir.x, y: 0 };
    let turnIn1 = dir.x === dir.y ? rotate270 : rotate90;
    let turnOut1 = dir.x === dir.y ? rotate90 : rotate270;
    let w1 = {
      pos: add(pos, dir1),
      dir: dir1,
      in: turnIn1(dir1),
      out: turnOut1(dir1),
      turnIn: turnIn1,
      turnOut: turnOut1,
      turned: false
    };

    let dir2 = { x: 0, y: dir.y };
    let turnIn2 = dir.x === dir.y ? rotate90 : rotate270;
    let turnOut2 = dir.x === dir.y ? rotate270 : rotate90;
    let w2 = {
      pos: add(pos, dir2),
      dir: dir2,
      in: turnIn2(dir2),
      out: turnOut2(dir2),
      turnIn: turnIn2,
      turnOut: turnOut2,
      turned: false
    };
    walkerPairs.push([w1, w2]);
  }
  
  for(let [w1, w2] of walkerPairs) {
    while(!w1.turned || !w2.turned) {
      stepEdge(board, w1);
      stepEdge(board, w2);
      map.set(`${toString(w1.pos)}|${toString(w1.out)}`, { pos: w2.pos, dir: w2.in });
      map.set(`${toString(w2.pos)}|${toString(w2.out)}`, { pos: w1.pos, dir: w1.in });
    }
  }
  
  return map;
};

const wrapPos = (board, wrapMap, pos, dir) => {
  return wrapMap.get(`${toString(pos)}|${toString(dir)}`);
};

const walkPath = ({board, steps}) => {
  let pos = { x: R.indexOf('.', board[0]), y: 0 };
  let dir = { x: 1, y: 0 };

  let corners = findCorners(board);
  let wrapMap = walkEdge(board, corners);

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
          let wrapTarget = wrapPos(board, wrapMap, pos, dir);
          if (!wrapTarget) debugger;
          if (getValue(board, wrapTarget.pos) === '.') {
            pos = wrapTarget.pos;
            dir = wrapTarget.dir;
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