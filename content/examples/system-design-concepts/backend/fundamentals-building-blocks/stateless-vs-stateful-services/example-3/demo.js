/**
 * File: demo.js
 * What it does: State Migration example focused on production/interview considerations.
 */
const scenario = {
  name: 'State Migration',
  focus: 'Show how to move session state between nodes without downtime.',
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
