/**
 * File: demo.js
 * What it does: Deployment Versioning example focused on production/interview considerations.
 */
const scenario = {
  name: 'Deployment Versioning',
  focus: 'Show versioned stored procedures and rollback strategies.',
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
