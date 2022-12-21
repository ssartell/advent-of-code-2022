import * as R from 'ramda';

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

const evalMonkey = R.curry((key, map) => {
  let monkey = map.get(key);
  if (Number.isInteger(monkey.a)) {
    return monkey.a;
  }
  return R.apply(ops[monkey.op], [evalMonkey(monkey.a, map), evalMonkey(monkey.b, map)]);
});

export default R.pipe(parseInput, toMap, evalMonkey('root'));