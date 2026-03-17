/**
 * File: demo.js
 * What it does: Conditional Requests example focused on production/interview considerations.
 */
const scenario = {
  name: 'Conditional Requests',
  focus: 'Demonstrate If-None-Match and revalidation flow.',
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
