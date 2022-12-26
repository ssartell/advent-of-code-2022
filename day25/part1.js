import * as R from 'ramda';

const parseInput = R.pipe(R.split('\n'), R.map(R.split('')));

const chars = ['=', '-', '0', '1', '2'];
const toDec = snafu => {
  let dec = 0;
  for(let i = 0; i < snafu.length; i++) {
    dec += (chars.indexOf(snafu[i]) - 2) * Math.pow(5, snafu.length - i - 1);
  }
  return dec;
};

const toSnafu = dec => {
  let snafu = [];
  let digits = Math.floor(Math.log(dec) / Math.log(5) + 2/5);
  for(let i = digits; i >= 0; i--) {
    let thing = Math.floor(dec / Math.pow(5, i));
    dec -= thing * Math.pow(5, i);
    snafu.push(thing);
  }
  let carry = 0;
  for(let i = snafu.length - 1; i >=0; i--) {
    snafu[i] += carry;
    carry = 0;
    if (snafu[i] > 2) {
      carry = 1;
      snafu[i] -= 5;
    }
  }
  return snafu.map(x => chars[x + 2]).join('');
};

export default R.pipe(parseInput, R.map(toDec), R.sum, toSnafu);