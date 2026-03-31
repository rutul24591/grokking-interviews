const bootTimings = [1200, 2600];
const timeoutBudget = 2000;

for (const timing of bootTimings) {
  console.log(`${timing}ms boot -> ${timing > timeoutBudget ? "show fallback help link" : "render widget"}`);
}
