import * as R from 'ramda';

const readPair = R.pipe(R.split('-'), R.map(parseInt), R.zipObj(['low', 'high']));
const parseInput = R.pipe(R.split('\n'), R.map(R.pipe(R.split(','), R.map(readPair))));

const fullyContains = (a, b) => a.low <= b.low && b.high <= a.high;
const eitherContains = (a, b) => fullyContains(a, b) || fullyContains(b, a);

export default R.pipe(parseInput, R.filter(R.apply(eitherContains)), R.length);