/**
 * File: demo.js
 * What it does: Schema-on-Read example focused on production/interview considerations.
 */
const scenario = {
  name: 'Schema-on-Read',
  focus: 'Demonstrate late binding schema evolution.',
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
