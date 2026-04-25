const { SkipList } = require("./skip-list");

const leaderboard = new SkipList();
[42, 17, 88, 63, 55].forEach((score) => leaderboard.insert(score));

console.log("Ordered scores:", leaderboard.values());
console.log("Top-level head links:", leaderboard.head.forward.map((node) => node && node.value));
