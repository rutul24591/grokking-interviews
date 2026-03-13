/**
 * File: demo.js
 * What it does: Field Tagging + Unknown Fields example focused on production/interview considerations.
 */
const scenario = {
  name: 'Field Tagging + Unknown Fields',
  focus: 'Show how tagged fields and unknown fields preserve backward compatibility.',
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
