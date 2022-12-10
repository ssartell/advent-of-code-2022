import * as R from 'ramda';

const parseInput = R.pipe(R.split('\n'), R.map(R.pipe(R.split(' '), R.zipObj(['inst', 'arg']), R.evolve({ arg: parseInt }))));

const compile = code => {
  let x = 1;
  let i = 0;
  return function* () {
    for(let line of code) {
      switch (line.inst) {
        case 'noop':
          yield { x, i: ++i };
          break;
        case 'addx':
          yield { x, i: ++i };
          yield { x: x += line.arg, i: ++i };
      }
    }
    return { x, i };
  };
};

const getTicks = R.curry((cycles, cycleOutputs) => R.map(x => R.nth(x - 1, cycleOutputs), cycles));
const getScore = ({ x, i }) => i * x;

export default R.pipe(parseInput, compile, x => [...x()], getTicks([20, 60, 100, 140, 180, 220]), R.map(getScore), R.sum);