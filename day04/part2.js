import * as R from 'ramda';

const readPair = R.pipe(R.split('-'), R.map(parseInt), R.zipObj(['low', 'high']));
const parseInput = R.pipe(R.split('\n'), R.map(R.pipe(R.split(','), R.map(readPair))));

const eitherOverlaps = (a, b) => !(a.high < b.low || b.high < a.low);

export default R.pipe(parseInput, R.filter(R.apply(eitherOverlaps)), R.length);