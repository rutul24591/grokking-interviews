const { SkipList } = require("../example-1/skip-list");

const list = new SkipList();
[10, 10, 11, 14].forEach((value) => list.insert(value));

console.log("Values with duplicate:", list.values());
console.log("Observation: real skip lists rely on random promotion to keep expected height low.");
