function dirtyState(saved, form) {
  return JSON.stringify(saved) !== JSON.stringify(form);
}

console.log(dirtyState({ displayName: "Asha", timezone: "UTC" }, { displayName: "Asha", timezone: "UTC" }));
console.log(dirtyState({ displayName: "Asha", timezone: "UTC" }, { displayName: "Asha", timezone: "IST" }));
