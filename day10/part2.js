import * as R from 'ramda';

const parseInput = R.pipe(R.split('\n'), R.map(R.pipe(R.split(' '), R.zipObj(['inst', 'arg']), R.evolve({ arg: parseInt }))));

const compile = code => {
  let x = 1;
  let i = 0;
  return function* () {
    yield { x, i: ++i };
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

const getPixel = cycle => Math.abs(cycle.x - ((cycle.i - 1) % 40)) <= 1 ? '#' : '.';
const toCRT = R.pipe(R.map(getPixel), R.splitEvery(40), R.map(R.join('')), R.join('\n'));

export default R.pipe(parseInput, compile, x => [...x()], toCRT, console.log);