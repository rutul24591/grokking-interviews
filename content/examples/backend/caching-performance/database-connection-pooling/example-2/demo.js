/**
 * File: demo.js
 * What it does: Queueing + Backpressure example focused on production/interview considerations.
 */
const scenario = {
  name: 'Queueing + Backpressure',
  focus: 'Show wait queues and timeout handling.',
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
