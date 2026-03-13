/**
 * File: demo.js
 * What it does: Schema Registry + Compatibility example focused on production/interview considerations.
 */
const scenario = {
  name: 'Schema Registry + Compatibility',
  focus: 'Model schema versions and compatibility checks for producers/consumers.',
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
