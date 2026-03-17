/**
 * File: demo.js
 * What it does: Request Coalescing example focused on production/interview considerations.
 */
const scenario = {
  name: 'Request Coalescing',
  focus: 'Show single-flight behavior across nodes.',
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
