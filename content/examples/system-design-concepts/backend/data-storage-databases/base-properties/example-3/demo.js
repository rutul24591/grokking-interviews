/**
 * File: demo.js
 * What it does: Staleness Budgets example focused on production/interview considerations.
 */
const scenario = {
  name: 'Staleness Budgets',
  focus: 'Show bounded staleness targets and monitoring.',
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
