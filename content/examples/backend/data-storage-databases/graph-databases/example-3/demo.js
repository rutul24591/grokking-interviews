/**
 * File: demo.js
 * What it does: Index-Free Adjacency example focused on production/interview considerations.
 */
const scenario = {
  name: 'Index-Free Adjacency',
  focus: 'Demonstrate traversal efficiency from adjacency lists.',
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
