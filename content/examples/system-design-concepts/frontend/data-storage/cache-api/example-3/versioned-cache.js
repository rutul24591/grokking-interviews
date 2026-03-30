const existing = ["cache-v1", "cache-v2", "cache-v3"];
const active = "cache-v3";
const toDelete = existing.filter((name) => name !== active);

console.log("keep", active);
console.log("delete", toDelete);

