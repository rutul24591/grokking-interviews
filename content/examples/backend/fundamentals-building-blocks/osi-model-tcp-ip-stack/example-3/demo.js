/**
 * File: demo.js
 * What it does: Layered Troubleshooting example focused on production/interview considerations.
 */
const scenario = {
  name: 'Layered Troubleshooting',
  focus: 'Walk through diagnosing failures at L2/L3/L4 with symptoms and fixes.',
  considerations: [
    'Includes operational safeguards and scale considerations.',
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
