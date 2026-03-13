/**
 * File: demo.js
 * What it does: Resharding example focused on production/interview considerations.
 */
const scenario = {
  name: 'Resharding',
  focus: 'Demonstrate shard split/merge and rehashing.',
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
