import * as R from 'ramda';

const parseInput = R.pipe(R.split('\r\n'), R.map(R.split('')), R.splitEvery(3));

const findCommonType = R.pipe(R.map(R.uniq), x => x.reduce(R.intersection), R.head);
const getScore = R.pipe(x => x.charCodeAt(0), x => x < 97 ? x - 38 : x - 96);

export default R.pipe(parseInput, R.map(findCommonType), R.map(getScore), R.sum);