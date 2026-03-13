/**
 * File: demo.js
 * What it does: Advanced Records + Split-Horizon example focused on production/interview considerations.
 */
const scenario = {
  name: 'Advanced Records + Split-Horizon',
  focus: 'Demonstrate A/AAAA/MX/NS records and split-horizon responses for internal vs external clients.',
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
