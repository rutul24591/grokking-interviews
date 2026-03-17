/**
 * File: demo.js
 * What it does: Downsampling/Rollups example focused on production/interview considerations.
 */
const scenario = {
  name: 'Downsampling/Rollups',
  focus: 'Demonstrate rollup tables and retention tiers.',
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
