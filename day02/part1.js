import * as R from 'ramda';

const readLine = x => ({ p1: x.charCodeAt(0) - 64, p2: x.charCodeAt(2) - 87 });
const parseInput = R.pipe(R.split('\n'), R.map(readLine));
const scoreRound = x => x.p2 + [3, 6, 0][(x.p2 - x.p1 + 3) % 3];

export default R.pipe(parseInput, R.map(scoreRound), R.sum);