import * as R from 'ramda';
import { bfs } from '../utils/graph-traversal.js';

const maxMins = 26;

const lineRegex = /Valve (\w*) has flow rate=(\d*); tunnels? leads? to valves? (.*)/;
const readLine = R.pipe(R.match(lineRegex), R.tail, R.zipObj(['name', 'rate', 'tunnels']), R.evolve({rate: parseInt, tunnels: R.split(', ')}));
const parseInput = R.pipe(R.split('\n'), R.map(readLine), R.reduce((map, x) => { map.set(x.name, x); return map }, new Map()));

const mostPressure = map => {
  // find shortest time between valves
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

  // find all routes for single actor
  let routes = [];
  const start = { ...map.get('AA'), minute: 0, pressure: 0, activeValves: new Set(), activePressure: [] };
  const isEnd = x => { routes.push(x); return false; };
  const getNeighbors = x => {
    if (x.minute >= maxMins - 2) return [];

    let moves = valveRooms
      .filter(t => !x.activeValves.has(t.name))
      .map(t => {
        let activeValves = new Set(x.activeValves ?? []);
        activeValves.add(t.name);
        let minutes = x.minute + map.get(x.name).shortestPaths.get(t.name) + 1;
        return {
          name: t.name,
          minute: minutes,
          pressure: x.pressure + Math.max(0, (maxMins - minutes)) * t.rate,
          activeValves: activeValves
        };
      })
      .filter(t => x.pressure < t.pressure || t.minute < maxMins - 2);

    return moves;
  };
  const getKey = x => `${x.name}|${x.pressure}|${[...x.activeValves].sort().join(',')}`;
  bfs(start, isEnd, getNeighbors, getKey);

  // compare pairs of independent routes to find max combined pressure
  let max = 0;
  routes = R.sortBy(x => -x.pressure, routes);
  for(let i = 0; i < routes.length; i++) {
    for(let j = i + 1; j < routes.length; j++) {
      let max1 = routes[i];
      let max2 = routes[j];
      if (max1.pressure + max2.pressure < max) continue;
      if (R.intersection([...max1.activeValves.values()], [...max2.activeValves.values()]).length > 0) continue;
      let newMax = max1.pressure + max2.pressure;
      if (newMax > max) {
        max = newMax;
      }
    }
  }
  return max;
}

export default R.pipe(parseInput, mostPressure);