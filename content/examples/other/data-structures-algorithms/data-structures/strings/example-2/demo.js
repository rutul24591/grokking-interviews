const logs = [
  "ERROR timeout on shard-1",
  "INFO cache warm complete",
  "ERROR retry exhausted on shard-2",
];

const matches = logs.filter((line) => line.includes("ERROR"));
console.table(matches);
