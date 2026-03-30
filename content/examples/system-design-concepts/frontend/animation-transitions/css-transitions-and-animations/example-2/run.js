const actions = [
  { name: "hover", duration: 120, easing: "ease-out" },
  { name: "modal enter", duration: 240, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  { name: "toast exit", duration: 180, easing: "ease-in" },
];

console.log("CSS motion timing planner\n");
for (const action of actions) {
  console.log(`${action.name.padEnd(12)} -> ${action.duration}ms, ${action.easing}`);
}
