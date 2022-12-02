import * as R from 'ramda';

const readLine = x => ({ p1: x.charCodeAt(0) - 64, p2: null, result: x.charCodeAt(2) - 89 });
const parseInput = R.pipe(R.split('\n'), R.map(readLine));
const toThrow = x => { x.p2 = (x.p1 + x.result + 2) % 3 + 1; return x; };
const scoreRound = x => x.p2 + [3, 6, 0][(x.p2 - x.p1 + 3) % 3];

export default R.pipe(parseInput, R.map(R.pipe(toThrow, scoreRound)), R.sum);