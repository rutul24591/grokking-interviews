/**
 * File: demo.js
 * What it does: Dual-Write Mitigation example focused on production/interview considerations.
 */
const scenario = {
  name: 'Dual-Write Mitigation',
  focus: 'Show idempotent write patterns to avoid divergence.',
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
