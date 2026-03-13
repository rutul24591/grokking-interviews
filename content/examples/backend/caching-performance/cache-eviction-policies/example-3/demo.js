/**
 * File: demo.js
 * What it does: Dynamic Eviction example focused on production/interview considerations.
 */
const scenario = {
  name: 'Dynamic Eviction',
  focus: 'Show adaptive eviction based on hit rate.',
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
