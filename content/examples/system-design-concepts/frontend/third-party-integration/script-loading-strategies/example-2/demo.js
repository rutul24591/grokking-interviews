const scripts = [
  { name: "analytics", critical: false, interactionOnly: false },
  { name: "fraud-check", critical: true, interactionOnly: false },
  { name: "chat", critical: false, interactionOnly: true }
];

for (const script of scripts) {
  const strategy = script.critical ? "eager" : script.interactionOnly ? "interaction" : "idle";
  console.log(`${script.name} -> ${strategy}`);
}
