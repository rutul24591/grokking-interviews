/**
 * File: demo.js
 * What it does: Latency Budgets example focused on production/interview considerations.
 */
const scenario = {
  name: 'Latency Budgets',
  focus: 'Compute a latency budget per hop and show where it is consumed.',
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
