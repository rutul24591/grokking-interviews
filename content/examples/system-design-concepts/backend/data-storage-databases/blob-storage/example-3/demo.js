/**
 * File: demo.js
 * What it does: Large Object Limits example focused on production/interview considerations.
 */
const scenario = {
  name: 'Large Object Limits',
  focus: 'Demonstrate handling of max size and retries.',
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
