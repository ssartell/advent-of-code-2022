import * as R from 'ramda';
import fs from 'fs';
import { add, sub } from '../utils/vec2.js';
import { getBounds, getValue, setValue } from '../utils/map-grid.js';

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

const print = cave => {
  let str = '';
  const bounds = getBounds(cave);
  for(let y = bounds.maxY; y >= 0; y--) {
    str += '|';
    for(let x = 0; x < 7; x++) {
      str += getValue(cave, {x,y}) ?? '.';
    }
    str += '|\n';
  }
  str += '+-------+\n';
  console.log(str);
}

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
        // print(cave);
        // console.log(towerHeight);
        // debugger;
        break;
      }
    }
  }

  return towerHeight;
});

export default R.pipe(parseInput, playTetris(2022));