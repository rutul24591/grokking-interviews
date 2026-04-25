const { SkipList } = require("../example-1/skip-list");

const list = new SkipList();
[5, 8, 12, 17, 21, 25].forEach((value) => list.insert(value));

const range = list.values().filter((value) => value >= 10 && value <= 20);
console.log("Range 10..20:", range);
