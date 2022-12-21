import * as R from 'ramda';
import { bfs, dfs, dijkstra, aStar } from '../utils/graph-traversal.js';

const debug = x => { 
  debugger; 
  return x; 
};

const lineRegex = /Blueprint (\d*): Each ore robot costs (\d*) ore. Each clay robot costs (\d*) ore. Each obsidian robot costs (\d*) ore and (\d*) clay. Each geode robot costs (\d*) ore and (\d*) obsidian./;
const toBlueprint = ([id, ...costs]) => ({
  id,
  robots: [
    [costs[0], 0, 0, 0],
    [costs[1], 0, 0, 0],
    [costs[2], costs[3], 0, 0],
    [costs[4], 0, costs[5], 0]
  ]
});
const readLine = R.pipe(R.match(lineRegex), R.tail, R.map(parseInt), toBlueprint);
const parseInput = R.pipe(R.split('\n'), R.map(readLine));

const canBuild = (materials, robot) => {
  const pairs = R.zip(robot, materials);
  return R.all(([a, b]) => a <= b, pairs);
};
const subtractCosts = (materials, robot) => {
  const pairs = R.zip(robot, materials);
  return R.map(([a, b]) => b - a, pairs);
};
const updateMaterials = (materials, robots) => {
  const pairs = R.zip(robots, materials);
  return R.map(([a, b]) => a + b, pairs);
};
const isUseful = (blueprint, robots, type, minute) => {
  if (type === 3) return true;
  if (R.any(x => x[type] > robots[type], blueprint.robots)) return true;
  
  return false;
};

const findQuantityLevel = R.curry((time, blueprint) => {
  const start = { minute: 0, robots: [1, 0, 0, 0], materials: [0, 0, 0, 0] };
  let max = 0;
  const isEnd = x => {
    if (x.minute === time) {
      max= Math.max(max, x.materials[3]);
    }
  };
  const getNeighbors = x => {
    const next = [];

    if (x.minute === time) 
      return next;

    const t = time - x.minute;
    if ((x.materials[3] + x.robots[3] * t + t * (t - 1) / 2) < max)
      return next;

    let newMaterials = updateMaterials(x.materials, x.robots);
    next.push({ minute: x.minute + 1, materials: newMaterials, robots: x.robots, prev: x });

    if (x.minute === time - 1) 
      return next;

    for(let i = 0; i < blueprint.robots.length; i++) {
      let robot = blueprint.robots[i];
      if (canBuild(x.materials, robot) && isUseful(blueprint, x.robots, i, x.minute)) {
        let newMaterials = subtractCosts(x.materials, robot);
        let newRobots = R.adjust(i, x => x + 1, x.robots);
        newMaterials = updateMaterials(newMaterials, x.robots);

        next.push({ minute: x.minute + 1, materials: newMaterials, robots: newRobots, prev: x });
      }
    }

    return next;
  };
  const getKey = x => {
    return `${x.minute}|${x.robots.join(',')}|${x.materials.join(',')}`
  };

  const print = x => {
    console.log(getKey(x));
    if (x.prev) print(x.prev);
  }
  dfs(start, isEnd, getNeighbors, getKey);
  return max;
});

export default R.pipe(parseInput, R.take(3), R.map(findQuantityLevel(32)), R.reduce(R.multiply, 1));