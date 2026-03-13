/**
 * File: demo.js
 * What it does: Auditing + Recursion example focused on production/interview considerations.
 */
const scenario = {
  name: 'Auditing + Recursion',
  focus: 'Show audit triggers and recursion guard patterns.',
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
