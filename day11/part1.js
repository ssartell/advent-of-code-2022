import * as R from 'ramda';

const tryParseInt = x => parseInt(x) ? parseInt(x) : x;
const monkeyRegex = /^Monkey (\d+):\n  Starting items: ((?:\d+,? ?)*)\n  Operation: new = old (\S) (.*)\n  Test: divisible by (\d+)\n    If true: throw to monkey (\d+)\n    If false: throw to monkey (\d+)/;
const monkeyProps = ['id', 'items', 'operator', 'operand', 'test', 'ifTrue', 'ifFalse'];
const monkeyEvolve = { id: parseInt, items: R.pipe(R.split(', '), R.map(parseInt)), operand: tryParseInt, test: parseInt, ifTrue: parseInt, ifFalse: parseInt };
const readMonkey = R.pipe(R.match(monkeyRegex), R.tail, R.zipObj(monkeyProps), R.evolve(monkeyEvolve));
const parseInput = R.pipe(R.split('\n\n'), R.map(readMonkey));

const operations = {
  '*': (a, b) => a * b,
  '+': (a, b) => a + b
};

const round = monkeys => {
  for(let monkey of monkeys) {
    for(let item of monkey.items) {
      let operand = monkey.operand === 'old' ? item : monkey.operand;
      let newItem = Math.floor(operations[monkey.operator](item, operand) / 3);
      let targetMonkey = newItem % monkey.test === 0 ? monkey.ifTrue : monkey.ifFalse
      monkeys[targetMonkey].items.push(newItem);
      monkey.inspected = (monkey.inspected ?? 0) + 1;
    }
    monkey.items = [];
  }
  return monkeys;
};

const getScore = R.pipe(R.map(x => x.inspected), R.sortBy(x => x), R.takeLast(2), R.apply(R.multiply));

export default R.pipe(parseInput, R.reduce(round, R.__, R.repeat(0, 20)), getScore);