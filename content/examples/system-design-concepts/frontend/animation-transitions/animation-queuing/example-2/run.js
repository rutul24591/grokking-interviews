const requests = ["modal-enter", "tooltip-enter", "route-exit"];
const policies = {
  append: requests,
  replace: [requests.at(-1)],
  drop: requests.slice(0, 2),
};
console.log("Animation queue policies\n");
for (const [policy, result] of Object.entries(policies)) console.log(`${policy.padEnd(7)} -> ${result.join(", ")}`);
