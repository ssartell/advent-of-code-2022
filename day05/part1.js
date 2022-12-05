import * as R from 'ramda';

const readStacks = R.pipe(R.split('\n'), R.reverse, R.drop(1), R.transpose, R.splitEvery(4), R.map(R.pipe(R.nth(1), R.reject(x => x == ' '))));
const stepRegex = /move (\d*) from (\d*) to (\d*)/;
const readProcedures = R.pipe(R.split('\n'), R.map(R.pipe(R.match(stepRegex), R.map(parseInt), R.tail, R.zipObj(['count', 'from', 'to']))));
const parseInput = R.pipe(R.split('\n\n'), R.zipObj(['stacks', 'procedures']), R.evolve({ stacks: readStacks, procedures: readProcedures }));

const followProcedures = ({ stacks, procedures }) => {
  for(let proc of procedures) {
    for(let i = 0; i < proc.count; i++) {
      let crate = stacks[proc.from - 1].pop();
      stacks[proc.to - 1].push(crate);
    }
  }
  return stacks;
};

const readTops = R.pipe(R.map(R.last), R.join(''));

export default R.pipe(parseInput, followProcedures, readTops);