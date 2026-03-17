/**
 * File: demo.js
 * What it does: VPN + Overlay Links example focused on production/interview considerations.
 */
const scenario = {
  name: 'VPN + Overlay Links',
  focus: 'Simulate overlay routing and latency tradeoffs for VPN links.',
  considerations: [
    'Includes operational safeguards and scale considerations.',
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
