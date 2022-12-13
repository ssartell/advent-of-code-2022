import * as R from 'ramda';

const debug = x => { 
  debugger; 
  return x; 
};

const parseInput = R.pipe(R.split('\n\n'), R.pipe(R.map(R.pipe(R.split('\n'), R.map(eval)))));

export const packetComparator = (left, right) => {
  if (typeof left === 'number' && typeof right === 'number') {
    if (left < right) {
      return -1;
    } else  if (right < left) {
      return 1;
    } else {
      return 0;
    }
  }
  if (left instanceof Array && right instanceof Array) {
    let inOrder = 0;
    for(let [l, r] of R.zip(left, right)) {
      let comparison = packetComparator(l, r);
      if (comparison !== 0) {
        inOrder = comparison;
        break;
      }
    }
    if (inOrder !== 0) {
      return inOrder;
    } else if (inOrder === 0) {
      if (left.length < right.length) {
        return -1;
      } else if (right.length < left.length) {
        return 1;
      }
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