/**
 * File: demo.js
 * What it does: IPv6 + CIDR Aggregation example focused on production/interview considerations.
 */
const scenario = {
  name: 'IPv6 + CIDR Aggregation',
  focus: 'Demonstrate IPv6 addressing, subnetting, and CIDR aggregation for routing scale.',
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
