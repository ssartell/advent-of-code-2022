import * as R from 'ramda';

const readPair = R.pipe(R.split('-'), R.map(parseInt), R.zipObj(['low', 'high']));
const parseInput = R.pipe(R.split('\n'), R.map(R.pipe(R.split(','), R.map(readPair))));

const overlaps = (a, b) => a.low <= b.low && b.low <= a.high || a.low <= b.high && b.high <= a.high;
const eitherOverlaps = (a, b) => overlaps(a, b) || overlaps(b, a);

export default R.pipe(parseInput, R.filter(R.apply(eitherOverlaps)), R.length);