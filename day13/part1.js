import * as R from 'ramda';

const parseInput = R.pipe(R.split('\n\n'), R.pipe(R.map(R.pipe(R.split('\n'), R.map(eval)))));

export const packetComparator = (left, right) => {
  if (typeof left === 'number' && typeof right === 'number') {
    return Math.sign(left - right);
  }
  if (left instanceof Array && right instanceof Array) {
    let subComparison = R.map(R.apply(packetComparator), R.zip(left, right));
    let inOrder = R.find(x => x !== 0, subComparison) || left.length - right.length;
    if (inOrder !== 0) {
      return inOrder;
    }
  }
  if (left instanceof Array && typeof right === 'number') {
    return packetComparator(left, [right]);
  }
  if (typeof left === 'number' && right instanceof Array) {
    return packetComparator([left], right);
  }
  return 0;
};

const getScore = R.pipe(R.addIndex(R.map)((x, i) => x < 0 ? i + 1 : 0), R.sum);

export default R.pipe(parseInput, R.map(R.apply(packetComparator)), getScore);