/**
 * File: demo.js
 * What it does: Performance Boundaries example focused on production/interview considerations.
 */
const scenario = {
  name: 'Performance Boundaries',
  focus: 'Demonstrate when logic belongs in app vs DB.',
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
