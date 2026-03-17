/**
 * File: demo.js
 * What it does: Stateful Tier Scaling example focused on production/interview considerations.
 */
const scenario = {
  name: 'Stateful Tier Scaling',
  focus: 'Show why stateful services scale differently and require partitioning or external state.',
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
