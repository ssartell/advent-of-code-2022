import * as R from 'ramda';
import { add, length, sub, toString, equals, clamp } from '../utils/vec2.js'

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

const update = ({ segments, history }, motion) => {
  let lastTail = R.last(segments);
  let key = toString(lastTail);
  if (!history.has(key)) {
    history.set(key, 1);
  }

  for(let i = 0; i < motion.steps; i++) {
    segments[0] = add(segments[0], dirs[motion.dir]);

    for(let j = 1; j < segments.length; j++) {
      let a = segments[j - 1];
      let b = segments[j];

      let pullDir = getPullDir(a, b);
      segments[j] = add(b, pullDir);
    }    

    let newTail = R.last(segments);
    let newKey = toString(newTail);

    if (!history.has(newKey)) {
      history.set(newKey, 1);
    } else if (!equals(lastTail, newTail)) {
      history.set(newKey, history.get(newKey) + 1);
    }
  }
  
  return { segments, history };
};
const initRope = () => R.repeat(0, 10).map(x => ({x: 0, y: 0}));

export default R.pipe(parseInput, R.reduce(update, {segments: initRope(), history: new Map()}), x => x.history.size);