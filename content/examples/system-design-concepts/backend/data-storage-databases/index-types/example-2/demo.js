/**
 * File: demo.js
 * What it does: Full-Text + GIN example focused on production/interview considerations.
 */
const scenario = {
  name: 'Full-Text + GIN',
  focus: 'Show inverted/GIN-like index behavior for text search.',
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
