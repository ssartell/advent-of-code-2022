import * as R from 'ramda';
import { max } from '../utils/ramda.js';

const parseInput = R.pipe(R.split('\n\n'), R.map(R.pipe(R.split('\n'), R.map(parseInt))));
const maxCalories = R.pipe(R.map(R.sum), max);

export default R.pipe(parseInput, maxCalories);