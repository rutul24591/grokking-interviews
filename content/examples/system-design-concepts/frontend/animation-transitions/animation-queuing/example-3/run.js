const issues = [
  ["stale completion", "Ignore completion events from replaced animations"],
  ["queue starvation", "Bound queue depth or low-priority effects never play"],
  ["route cancellation", "Cancel old route animations when navigation changes"],
];
console.log("Animation queue edge cases\n");
for (const [name, note] of issues) console.log(`- ${name}: ${note}`);
