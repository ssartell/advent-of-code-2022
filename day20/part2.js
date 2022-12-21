import * as R from 'ramda';

const parseInput = R.pipe(R.split('\n'), R.map(parseInt), R.map(R.multiply(811589153)));

const toLinkedList = list => {
  const head = { value: list[0] };
  const linkedList = [head];
  for(let i = 1; i < list.length; i++) {
    let node = { value: list[i], prev: linkedList[i - 1] };
    linkedList.push(node);
    linkedList[i - 1].next = node;
  }
  head.prev = linkedList[list.length - 1];
  linkedList[list.length - 1].next = head;
  return linkedList;
};

const insertNode = (newNode, prevNode) => {
  let nextNode = prevNode.next;
  newNode.prev = prevNode;
  newNode.next = nextNode;
  prevNode.next = newNode;
  nextNode.prev = newNode;
};
const removeNode = node => {
  let prev = node.prev;
  let next = node.next;
  prev.next = next;
  next.prev = prev;
};
const fastForward = (pointer, n) => {
  for(let i = 0; i < n; i++) {
    pointer = pointer.next;
  }
  return pointer;
};

const print = (node, n) => {
  let values = []
  for(let i = 0; i < n; i++) {
    values.push(node.value);
    node = node.next;
  }
  console.log(values.join(', '));
};

const mod = (n, m) => ((n % m) + m) % m;
const mix = list => {
  let zeroNode = null;
  for(let node of list) {
    if (node.value === 0) {
      zeroNode = node;
    }
  }

  for(let node of list) {
    removeNode(node);

    let pointer = node.prev;
    let dir = Math.sign(node.value);
    let mag = mod(Math.abs(node.value), list.length - 1);
    for(let i = 0; i < mag; i++) {
      if (dir < 0) {
        pointer = pointer.prev;
      } else {
        pointer = pointer.next;
      }
    }

    insertNode(node, pointer);
    // console.log(node.value);
    // print(zeroNode, list.length);
  }
  // print(zeroNode, list.length);
  return zeroNode;
};

const getCoords = zeroNode => {
  let coords = [];
  let pointer = fastForward(zeroNode, 1000);
  coords.push(pointer.value);
  pointer = fastForward(pointer, 1000);
  coords.push(pointer.value);
  pointer = fastForward(pointer, 1000);
  coords.push(pointer.value);
  return coords;
};

const mixTenTimes = list => {
  let zeroNode = null;
  for(let i = 0; i < 10; i++) {
    zeroNode = mix(list);
  }
  return zeroNode;
}

export default R.pipe(parseInput, toLinkedList, mixTenTimes, getCoords, R.sum);