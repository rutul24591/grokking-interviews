const cases = [
  ["SSR hydration", "Guard browser-only measurement work until after mount"],
  ["spring tuning", "Poor stiffness/damping choices cause lag or overshoot"],
  ["imperative interruption", "Timeline libraries need explicit cancel/replace policy"],
];

console.log("Animation library edge cases\n");
for (const [name, note] of cases) console.log(`- ${name}: ${note}`);
