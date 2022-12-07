import * as R from 'ramda';

const debug = x => {
  debugger;
  return x;
};

const readOut = R.pipe(R.match(/(\S*) (\S*)/), R.tail);
const toOut = input => {
  let outs = readOut(input);
  let isDir = outs[0] === 'dir';
  return {
    type: isDir ? 'dir' : 'file',
    size: parseInt(outs[0]),
    name: outs[1]
  };
}
const readCmdArgs = R.pipe(R.match(/\$ (\S*)\s?(\S*)?/), R.tail);
const toCmd = input => {
  var args = readCmdArgs(R.head(input));
  return {
    cmd: args[0],
    arg: args[1],
    out: R.map(toOut, R.tail(input))
  }
}
const parseInput = R.pipe(R.split('\n'), R.groupWith((_, x) => !R.startsWith('$', x)), R.map(toCmd));

const buildFileSystem = lines => {
  let cwd = {
    name: 'root',
    dirs: [
      {
        type: 'dir',
        name: '/'
      }
    ]
  };

  for(let line of lines) {
    if (line.cmd === 'cd') {
      if ()
    }
  }
}

export default R.pipe(parseInput, debug); 