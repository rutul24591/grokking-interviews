/**
 * File: demo.js
 * What it does: Leak Prevention example focused on production/interview considerations.
 */
const scenario = {
  name: 'Leak Prevention',
  focus: 'Demonstrate weak references or size caps.',
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
