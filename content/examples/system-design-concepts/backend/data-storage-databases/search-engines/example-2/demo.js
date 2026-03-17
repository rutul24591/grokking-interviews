/**
 * File: demo.js
 * What it does: Relevance Tuning example focused on production/interview considerations.
 */
const scenario = {
  name: 'Relevance Tuning',
  focus: 'Show boosts, field weights, and scoring changes.',
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
