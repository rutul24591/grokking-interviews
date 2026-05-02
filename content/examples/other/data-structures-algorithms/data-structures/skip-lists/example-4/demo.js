const { SkipList } = require("../example-1/skip-list");

function contains(list, target) {
  let current = list.head;
  for (let level = list.maxLevel - 1; level >= 0; level -= 1) {
    while (current.forward[level] && current.forward[level].value < target) {
      current = current.forward[level];
    }
  }
  current = current.forward[0];
  return current && current.value === target;
}

const list = new SkipList();
[10, 20, 15, 7, 30].forEach((value) => list.insert(value));

console.log("Contains 15?", contains(list, 15));
console.log("Contains 99?", contains(list, 99));
