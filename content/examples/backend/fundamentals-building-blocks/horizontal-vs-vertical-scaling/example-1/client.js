// Runs scaling scenarios to compare scale-up vs scale-out.

const { decideScaling } = require("./autoscaler");

const instances = [
  { id: "node-1", cores: 2, memoryGb: 4, concurrentLimit: 120 },
  { id: "node-2", cores: 2, memoryGb: 4, concurrentLimit: 120 },
];

const scenarios = [
  { demand: 150 },
  { demand: 350 },
  { demand: 700 },
];

for (const scenario of scenarios) {
  const decision = decideScaling({
    instances,
    demand: scenario.demand,
    maxInstanceSize: { cores: 8, memoryGb: 16 },
  });
  console.log("demand", scenario.demand, "=>", decision);
}
