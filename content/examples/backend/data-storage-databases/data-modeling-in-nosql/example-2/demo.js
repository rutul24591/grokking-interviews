/**
 * File: demo.js
 * What it does: Anti-Patterns example focused on production/interview considerations.
 */
const scenario = {
  name: 'Anti-Patterns',
  focus: 'Show access patterns that break NoSQL modeling goals.',
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
