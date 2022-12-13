import * as R from 'ramda';
import { packetComparator } from './part1.js';

let divPacket1 = [[2]];
let divPacket2 = [[6]];

const parseInput = R.pipe(x => x.replaceAll('\n\n', '\n'), R.split('\n'), R.map(JSON.parse));

const getScore = packets => (R.indexOf(divPacket1, packets) + 1) * (R.indexOf(divPacket2, packets) + 1);

export default R.pipe(parseInput, R.concat([divPacket1, divPacket2]), R.sort(packetComparator), getScore);