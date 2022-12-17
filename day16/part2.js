import * as R from 'ramda';
import { bfs } from '../utils/graph-traversal.js';

const maxMins = 26;

const lineRegex = /Valve (\w*) has flow rate=(\d*); tunnels? leads? to valves? (.*)/;
const readLine = R.pipe(R.match(lineRegex), R.tail, R.zipObj(['name', 'rate', 'tunnels']), R.evolve({rate: parseInt, tunnels: R.split(', ')}));
const parseInput = R.pipe(R.split('\n'), R.map(readLine), R.reduce((map, x) => { map.set(x.name, x); return map }, new Map()));

const mostPressure = map => {
  let rooms = [...map.values()];
  let valveRooms = rooms.filter(x => x.rate > 0);
  for(let room1 of rooms) {
    room1.shortestPaths = new Map();
    for(let room2 of valveRooms) {      
      let shortestPath = bfs(
        {...room1, steps: 0},
        x => x.name === room2.name, 
        x => x.tunnels.map(y => ({...map.get(y), steps: x.steps + 1})),
        x => x.name
      );
      room1.shortestPaths.set(room2.name, shortestPath.steps);
    }
  }

  let maxs = [];
  const start = { ...map.get('AA'), minute: 0, pressure: 0, activeValves: new Set(), activePressure: [] };
  const isEnd = x => { maxs.push(x); return false; };
  const getNeighbors = x => {
    if (x.minute >= maxMins - 2) return [];

    let moves = valveRooms
      .filter(t => !x.activeValves.has(t.name))
      .map(t => {
        let targetRoom = t;
        let activeValves = new Set(x.activeValves ?? []);
        activeValves.add(targetRoom.name);
        let minutes = x.minute + x.shortestPaths.get(t.name) + 1;
        return {
          ...targetRoom,
          minute: minutes,
          pressure: x.pressure + Math.max(0, (maxMins - minutes)) * targetRoom.rate,
          activePressure: R.append(targetRoom.rate, x.activePressure),
          activeValves: activeValves
        };
      })
      .filter(t => t.pressure > x.pressure || t.minute > maxMins - 2);

    return moves;
  };
  const getKey = x => `${x.name}|${x.pressure}|${[...x.activeValves].sort().join(',')}`;
  bfs(start, isEnd, getNeighbors, getKey);

  let max = 0;
  maxs = R.sortBy(x => -x.pressure, maxs);
  for(let i = 0; i < maxs.length; i++) {
    for(let j = i + 1; j < maxs.length; j++) {
      let max1 = maxs[i];
      let max2 = maxs[j];
      if (R.intersection([...max1.activeValves.values()], [...max2.activeValves.values()]).length > 0) continue;
      let newMax = max1.pressure + max2.pressure;
      if (newMax > max) {
        max = newMax;
        return newMax;
      }
    }
  }
}

export default R.pipe(parseInput, mostPressure);