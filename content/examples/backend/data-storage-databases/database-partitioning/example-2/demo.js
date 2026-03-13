/**
 * File: demo.js
 * What it does: Partition Pruning example focused on production/interview considerations.
 */
const scenario = {
  name: 'Partition Pruning',
  focus: 'Show query pruning based on range partition keys.',
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
