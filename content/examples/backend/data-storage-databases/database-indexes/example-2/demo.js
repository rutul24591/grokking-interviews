/**
 * File: demo.js
 * What it does: Index Maintenance Cost example focused on production/interview considerations.
 */
const scenario = {
  name: 'Index Maintenance Cost',
  focus: 'Simulate write amplification and maintenance overhead.',
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
