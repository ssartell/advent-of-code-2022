import * as R from 'ramda';
import Stack from 'mnemonist/stack.js';

const lineRegex = /\$? ?(\S+) ?(\S+)?/
const parseInput = R.pipe(R.split('\n'), R.map(R.pipe(R.match(lineRegex), R.tail)));

const buildFileSystem = lines => {
  let stack = new Stack();
  let cwd = new Map();
  cwd.name = '/';
  let home = cwd;

  for(let [arg1, arg2] of R.tail(lines)) {
    if (arg1 === 'cd') {
      if (arg2 === '..') {
        cwd = stack.pop();
      } else {
        stack.push(cwd);
        cwd = cwd.get(arg2);
      }
    } else if (arg1 === 'ls') {
    } else if (arg1 === 'dir') {
      var dir = new Map();
      dir.name = arg2;
      cwd.set(arg2, dir);
    } else {
      cwd.set(arg2, parseInt(arg1));
    }
  }

  return home;
};

const getDirs = fs => {
  let subDirs = R.filter(x => x instanceof Map, [...fs.values()]);
  return R.prepend(fs, R.flatten(R.map(x => getDirs(x), subDirs)));
};

const getSize = dir => {
  let size = 0;
  for(let [key, value] of dir) {
    if (value instanceof Map) {
      size += getSize(value);
    } else {
      size += value;
    }
  }
  return size;
};

const appendSize = x => {
  x.totalSize = getSize(x);
  return x;
}

const findDirToDelete = dirs => {
  let freeSpace = 70000000 - R.head(dirs).totalSize;
  let neededSpace = 30000000 - freeSpace;
  let feasibleDirs = R.filter(x => x.totalSize >= neededSpace, dirs);
  return R.head(R.sortBy(x => x.totalSize, feasibleDirs));
};

export default R.pipe(parseInput, buildFileSystem, getDirs, R.map(appendSize), findDirToDelete, R.prop('totalSize')); 