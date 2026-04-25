const newer = new Map([
  ["a", "2"],
  ["c", "9"],
]);
const older = new Map([
  ["a", "1"],
  ["b", "7"],
]);

const compacted = new Map([...older.entries(), ...newer.entries()]);
console.log("Compacted view:", Object.fromEntries(compacted));
