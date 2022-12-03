import * as R from 'ramda';

const readLine = R.pipe(R.split(''), x => R.splitAt(R.length(x) / 2, x));
const parseInput = R.pipe(R.split('\r\n'), R.map(readLine));

const findCommonType = R.pipe(R.map(R.uniq), R.apply(R.intersection), R.head);
const getScore = R.pipe(x => x.charCodeAt(0), x => x < 97 ? x - 38 : x - 96);

export default R.pipe(parseInput, R.map(findCommonType), R.map(getScore), R.sum);