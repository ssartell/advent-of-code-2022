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

const evalMonkey = R.curry((key, map, x) => {
  let monkey = map.get(key);
  if (monkey.key === 'humn') return x;
  
  if (Number.isInteger(monkey.a)) {
    return monkey.a;
  }
  let sub = [evalMonkey(monkey.a, map, x), evalMonkey(monkey.b, map, x)];
  if (monkey.key === 'root') {
    return sub[0] - sub[1];
  } else {
    return R.apply(ops[monkey.op], sub);
  }
});

const whittakerMethod = map => {
  let x = 0;
  for(let i = 0; i < 300; i++) {
    x += evalMonkey('root', map, x) / 10;
  }
  return Math.round(x);
};

export default R.pipe(parseInput, toMap, whittakerMethod);