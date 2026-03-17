/**
 * File: demo.js
 * What it does: Multi-Tier Edge + Gateway Routing example focused on production/interview considerations.
 */
const scenario = {
  name: 'Multi-Tier Edge + Gateway Routing',
  focus: 'Model edge, gateway, and service tiers with routing, policy, and rate limits to show layered decomposition and boundary enforcement.',
  considerations: [
    'Designed for staff/principal interview discussion and production tradeoffs.',
    "latency vs correctness tradeoffs",
    "failure handling and rollback",
  ],
};

function explain() {
  console.log(`Scenario: ${scenario.name}`);
  console.log(`Focus: ${scenario.focus}`);
  console.log("Considerations:");
  scenario.considerations.forEach((c) => console.log(`- ${c}`));
}

explain();
