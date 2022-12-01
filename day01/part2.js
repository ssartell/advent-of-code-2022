import * as R from 'ramda';

const parseInput = R.pipe(R.split('\n\n'), R.map(R.pipe(R.split('\n'), R.map(parseInt))));
const maxCalories = R.pipe(R.map(R.sum), R.sort(R.subtract), R.takeLast(3), R.sum);

export default R.pipe(parseInput, maxCalories);