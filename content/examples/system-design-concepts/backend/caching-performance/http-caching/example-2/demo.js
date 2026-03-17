/**
 * File: demo.js
 * What it does: Proxy/CDN Behavior example focused on production/interview considerations.
 */
const scenario = {
  name: 'Proxy/CDN Behavior',
  focus: 'Show Vary header effects and shared cache behavior.',
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
