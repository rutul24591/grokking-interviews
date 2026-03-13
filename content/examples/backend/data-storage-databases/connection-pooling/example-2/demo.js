/**
 * File: demo.js
 * What it does: Saturation + Backpressure example focused on production/interview considerations.
 */
const scenario = {
  name: 'Saturation + Backpressure',
  focus: 'Show queue growth, timeouts, and circuit breaking.',
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
