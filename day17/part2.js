import * as R from 'ramda';
import fs from 'fs';
import { add, sub } from '../utils/vec2.js';
import { getValue, setValue } from '../utils/map-grid.js';

const jetDirs = { '>': { x: 1, y: 0 }, '<': { x: -1, y: 0 }};
const rockTypesStr = fs.readFileSync('day17/rockTypes.txt', 'utf8');

const readRockTypes = R.pipe(R.split('\n\n'), R.map(R.pipe(R.split('\n'), R.map(R.split('')))));
const parseInput = R.split('');

const isValidRockPos = (cave, rock, pos) => {
  if (pos.x < 0 || pos.y < 0 || pos.x + rock.width - 1 > 6) return false;

  for(let y = 0; y < rock.height; y++) {
    for(let x = 0; x < rock.width; x++) {
      const rockPart = rock.shape[rock.height - y - 1][x];
      if (rockPart === '.') continue;
      if (getValue(cave, add(pos, {x, y})) === '#') return false;
    }
  }
  return true;
};

const comeToRest = (cave, rock, pos) => {
  for(let y = 0; y < rock.height; y++) {
    for(let x = 0; x < rock.width; x++) {
      const rockPart = rock.shape[rock.height - y - 1][x];
      if (rockPart === '.') continue;
      setValue(cave, add(pos, {x, y}), '#')
    }
  }
};

const largestCycle = list => {
  let max = 0;
  for(let i = 1; i < list.length / 3; i++) {
    let a = list.slice(-i);
    let b = list.slice(-2*i, -i);
    let areEqual = true;
    for(let j = 0; j < a.length; j++) {
      if (a[j] !== b[j]) {
        areEqual = false;
        break;
      }
    }
    if (areEqual) max = i;
  }
  return max;
};

const playTetris = R.curry((times, jets) => {
  const rockTypes = readRockTypes(rockTypesStr)
    .map(x => ({
      shape: x,
      width: x[0].length,
      height: x.length
    }));

  const cave = new Map();
  const startPos = { x: 2, y: 3 };
  const gravity = { x: 0, y: -1 };

  let towerHeight = 0;
  let lastHeight = 0;
  let heightDiff = 0;
  let diffs = [];
  let heights = [];

  let j = 0;
  for(let i = 0; i < times; i++) {    
    const rock = rockTypes[i % rockTypes.length];
    let pos = add({x: 0, y: towerHeight}, startPos);

    while(true) {
      const jetDir = jetDirs[jets[j % jets.length]];
      if (jets[j % jets.length] !== '<' && jets[j % jets.length] !== '>') debugger;
      j++;

      pos = add(pos, jetDir);
      if (!isValidRockPos(cave, rock, pos)) {
        pos = sub(pos, jetDir);
      }

      pos = add(pos, gravity);
      if (!isValidRockPos(cave, rock, pos)) {
        pos = sub(pos, gravity);
        comeToRest(cave, rock, pos);
        towerHeight = Math.max(towerHeight, pos.y + rock.height);
        break;
      }
    }

    heights.push(towerHeight);
    heightDiff = towerHeight - lastHeight;
    lastHeight = towerHeight;
    
    let cycleLength = largestCycle(diffs);
    if (cycleLength > 10) {
      let cycleStart = diffs.length - cycleLength * 2;
      let cycle = diffs.slice(-cycleLength);
      let cycleHeight = R.sum(cycle);

      let base = diffs.slice(0, cycleStart);
      let baseHeight = R.sum(base);
      let cycles = Math.floor((times - cycleStart) / cycleLength);
      let remainder = times - cycleStart - (cycles * cycleLength);
      let partialCycle = cycle.slice(0, remainder);
      let remainingHeight = R.sum(partialCycle);

      return baseHeight + cycles * cycleHeight + remainingHeight;
    }
    
    diffs.push(heightDiff);
  }

  return towerHeight;
});

export default R.pipe(parseInput, playTetris(1000000000000));