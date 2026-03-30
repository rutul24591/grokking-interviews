const cases = [
  ["unsupported browser", "Fall back to CSS or no-op behavior"],
  ["cancel vs finish", "Cancel removes inline effect state; finish preserves final state"],
  ["composite replace", "Understand when new animations override earlier effects"],
];
console.log("WAAPI edge cases\n");
for (const [name, note] of cases) console.log(`- ${name}: ${note}`);
