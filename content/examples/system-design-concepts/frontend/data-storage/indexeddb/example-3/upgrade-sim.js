function runUpgrade(oldVersion) {
  const steps = [];
  if (oldVersion < 1) steps.push("create notes store");
  if (oldVersion < 2) steps.push("add byTag index");
  if (oldVersion < 3) steps.push("add archived flag");
  return steps;
}

console.log("upgrade from v0:", runUpgrade(0));
console.log("upgrade from v1:", runUpgrade(1));
console.log("upgrade from v2:", runUpgrade(2));
console.log("blocked handling:", "Prompt user to close older tabs before bumping schema.");

