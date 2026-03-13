/**
 * File: demo.js
 * What it does: Deadlock Graph example focused on production/interview considerations.
 */
const scenario = {
  name: 'Deadlock Graph',
  focus: 'Build a waits-for graph and detect a cycle.',
  considerations: [
    'Designed for staff/principal interview discussion and production tradeoffs.',
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
