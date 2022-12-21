import * as R from 'ramda';

const debug = x => { 
  debugger; 
  return x; 
};

const parseInput = R.pipe(R.split('\n'), R.map(parseInt));

const mod = (n, m) => ((n % m) + m) % m;
const mix = list => {
  let indices = R.range(0, list.length);
  for(let k = 0; k <= list.length; k++) {
    let i = indices[k];
    let j = mod(i + list[i], list.length);
    let temp = list[j];
    list[j] = list[i];
    list[i] = temp;
    temp = indices[j];
    indices[j] = indices[i];
    indices[i] = temp;
    debugger;
  }
  return list;
}

export default R.pipe(parseInput, mix, debug);