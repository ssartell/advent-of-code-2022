import * as R from 'ramda';
import { add, length, sub, toString, clamp } from '../utils/vec2.js'

const dirs = {
  R: {x: 1, y: 0},
  L: {x: -1, y: 0},
  U: {x: 0, y: 1},
  D: {x: 0, y: -1}
};

const parseInput = R.pipe(R.split('\n'), R.map(R.pipe(R.split(' '), R.zipObj(['dir', 'steps']), R.evolve({ steps: parseInt }))));

const getPullDir = (head, tail) => {
  let diff = sub(head, tail);
  if (length(diff) >= 2) {
    return clamp(diff, -1, 1);
  } else {
    return { x: 0, y: 0 };
  }
};

const update = ({ head, tail, history }, motion) => {
  let key = toString(tail);
  if (!history.has(key)) {
    history.set(key, 1);
  }

  for(let i = 0; i < motion.steps; i++) {
    head = add(head, dirs[motion.dir]);
    let pullDir = getPullDir(head, tail);
    tail = add(tail, pullDir);
    let newKey = toString(tail);

    if (!history.has(newKey)) {
      history.set(newKey, 1);
    } else if (length(pullDir) > 0) {
      history.set(newKey, history.get(newKey) + 1);
    }
  }
  
  return { head, tail, history };
}

export default R.pipe(parseInput, R.reduce(update, {head: {x: 0, y: 0}, tail: {x: 0, y: 0}, history: new Map()}), x => x.history.size);