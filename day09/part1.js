import * as R from 'ramda';
import { add, length, sub, toString, clamp, chebyshev } from '../utils/vec2.js'

const dirs = {
  R: {x: 1, y: 0},
  L: {x: -1, y: 0},
  U: {x: 0, y: 1},
  D: {x: 0, y: -1}
};

const parseInput = R.pipe(R.split('\n'), R.map(R.pipe(R.split(' '), R.zipObj(['dir', 'steps']), R.evolve({ steps: parseInt }))));

const getPullDir = (head, tail) => {
  let diff = sub(head, tail);
  return chebyshev(diff) > 1 ? clamp(diff, -1, 1) : { x: 0, y: 0 };
};

const update = ({ head, tail, history }, motion) => {
  let key = toString(tail);
  history.add(key);

  for(let i = 0; i < motion.steps; i++) {
    head = add(head, dirs[motion.dir]);
    tail = add(tail, getPullDir(head, tail));
    history.add(toString(tail));
  }
  
  return { head, tail, history };
}

export default R.pipe(parseInput, R.reduce(update, {head: {x: 0, y: 0}, tail: {x: 0, y: 0}, history: new Set()}), x => x.history.size);