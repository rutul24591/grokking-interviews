const candidatePairs = [
  { local: "host", remote: "host", score: 240 },
  { local: "srflx", remote: "srflx", score: 180 },
  { local: "relay", remote: "relay", score: 90 }
];

candidatePairs
  .sort((left, right) => right.score - left.score)
  .forEach((pair) => console.log(`${pair.local}<->${pair.remote} -> score ${pair.score}`));
