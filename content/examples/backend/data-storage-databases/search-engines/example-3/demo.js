/**
 * File: demo.js
 * What it does: Refresh + Shard Lifecycle example focused on production/interview considerations.
 */
const scenario = {
  name: 'Refresh + Shard Lifecycle',
  focus: 'Demonstrate refresh interval and index rollover.',
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
