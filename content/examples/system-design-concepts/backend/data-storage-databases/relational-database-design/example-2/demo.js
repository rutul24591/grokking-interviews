/**
 * File: demo.js
 * What it does: Performance-Driven Denormalization example focused on production/interview considerations.
 */
const scenario = {
  name: 'Performance-Driven Denormalization',
  focus: 'Demonstrate denormalized tables with consistency rules.',
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
