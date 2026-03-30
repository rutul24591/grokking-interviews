const snapshots = [];

function autosave(text) {
  snapshots.push({ at: new Date().toISOString(), text });
}

autosave("first draft");
autosave("second draft");

console.log("snapshots", snapshots);
console.log("permission lost => recover latest snapshot instead of discarding work");

