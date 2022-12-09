import * as R from 'ramda';
import { add, sub, toString, clamp, chebyshev } from '../utils/vec2.js'

const dirs = {
  R: {x:  1, y:  0},
  L: {x: -1, y:  0},
  U: {x:  0, y:  1},
  D: {x:  0, y: -1}
};

const parseInput = R.pipe(R.split('\n'), R.map(R.pipe(R.split(' '), R.zipObj(['dir', 'steps']), R.evolve({ steps: parseInt }))));

const getPullDir = (head, tail) => {
  let diff = sub(head, tail);
  return chebyshev(diff) > 1 ? clamp(diff, -1, 1) : { x: 0, y: 0 };
};

const update = ({ segments, history }, motion) => {
  history.add(toString(R.last(segments)));

  for(let i = 0; i < motion.steps; i++) {
    segments[0] = add(segments[0], dirs[motion.dir]);

    for(let j = 1; j < segments.length; j++) {
      let pullDir = getPullDir(segments[j - 1], segments[j]);
      segments[j] = add(segments[j], pullDir);
    }    

    history.add(toString(R.last(segments)));
  }
  
  return { segments, history };
};

const initRope = () => R.repeat(0, 10).map(x => ({x: 0, y: 0}));

export default R.pipe(parseInput, R.reduce(update, {segments: initRope(), history: new Set()}), x => x.history.size);