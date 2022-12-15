import * as R from 'ramda';
import m from 'mnemonist';
let { Heap, Queue, Stack } = m;

export const aStar = (start, isEnd, getNeighbors, g, h, getKey = x => x) => {
    const notVisited = new Heap(R.comparator((a, b) => g(a) + h(a) <= g(b) + h(b)));
    const push = x => notVisited.push(x);
    const pop = x => notVisited.pop(x);
    const peek = x => notVisited.peek(x);
    return pathFind(push, pop, peek, start, isEnd, getNeighbors, getKey);
};

export const bfs = (start, isEnd, getNeighbors, getKey = x => x) => {
    const notVisited = new Queue();
    const push = x => notVisited.enqueue(x);
    const pop = x => notVisited.dequeue(x);
    const peek = x => notVisited.peek(x);
    return pathFind(push, pop, peek, start, isEnd, getNeighbors, getKey);
};

export const dfs = (start, isEnd, getNeighbors, getKey = x => x) => {
    const notVisited = new Stack();
    const push = x => notVisited.push(x);
    const pop = x => notVisited.pop(x);
    const peek = x => notVisited.peek(x);
    return pathFind(push, pop, peek, start, isEnd, getNeighbors, getKey);
};

export const dijkstra = (start, isEnd, getNeighbors, getCost, getKey = x => x) => {
    const notVisited = new Heap(R.comparator((a, b) => getCost(a) <= getCost(b)));
    const push = x => notVisited.push(x);
    const pop = x => notVisited.pop(x);
    const peek = x => notVisited.peek(x);
    return pathFind(push, pop, peek, start, isEnd, getNeighbors, getKey);
};

const pathFind = (push, pop, peek, start, isEnd, getNeighbors, getKey) => {
    push(start);
    var seen = new Set();
    while (peek() !== undefined) {
        var current = pop();
        var key = getKey(current);
        if (seen.has(key)) continue;
        seen.add(key);
        if (isEnd(current)) return current;
        for (var neighbor of getNeighbors(current)) {
            push(neighbor);
        }
    }
    return null;
};