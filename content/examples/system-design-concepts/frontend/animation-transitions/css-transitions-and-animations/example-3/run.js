const cases = [
  ["interrupted hover", "Prefer transform/opacity so interruption stays cheap"],
  ["reduced motion", "Disable decorative keyframes and keep state change instant"],
  ["animating width", "Causes layout work; replace with transform when possible"],
];

console.log("CSS motion edge cases\n");
for (const [name, guidance] of cases) {
  console.log(`- ${name}: ${guidance}`);
}
