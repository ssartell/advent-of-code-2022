import * as R from 'ramda';

const debug = x => { 
  debugger; 
  return x; 
};

const tryParseInt = x => isNaN(parseInt(x)) ? x : parseInt(x);
const lineRegex = /(\w+): (\S*) ?(\S*) ?(\S*)/;
const readLine = R.pipe(R.match(lineRegex), R.tail, R.filter(x => x !== ''), R.map(tryParseInt), R.zipObj(['key', 'a', 'op', 'b']));
const parseInput = R.pipe(R.split('\n'), R.map(readLine));

const toMap = monkeys => {
  let map = new Map();
  for(let monkey of monkeys) {
    map.set(monkey.key, monkey);
  }
  return map;
}

const ops = {
  '+': R.add,
  '-': R.subtract,
  '*': R.multiply,
  '/': R.divide,
};

const reverse = {
  '-': R.add,
  '+': R.subtract,
  '/': R.multiply,
  '*': R.divide,
}

const evalMonkey = R.curry((key, steps, map) => {
  let monkey = map.get(key);
  if (key === 'humn') return NaN;
  if (Number.isInteger(monkey.a)) {
    return monkey.a;
  }
  let sub = [evalMonkey(monkey.a, steps, map), evalMonkey(monkey.b, steps, map)];
  if (isNaN(sub[0])) {
    steps.push(`${monkey.key}: ? ${monkey.op} ${sub[1]}   ${monkey.a}`);
  }
  if (isNaN(sub[1])) {
    steps.push(`${monkey.key}: ${sub[0]} ${monkey.op} ?   ${monkey.b}`);
  }
  if (key === 'root') debugger;
  return R.apply(ops[monkey.op], sub);
});
// ((((150 * 4) - 4) / 2) + 3)
export default R.pipe(parseInput, toMap, evalMonkey('root', []), x => console.log(steps.join('\n')));5