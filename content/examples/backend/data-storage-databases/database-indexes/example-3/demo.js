/**
 * File: demo.js
 * What it does: Selectivity + Covering Index example focused on production/interview considerations.
 */
const scenario = {
  name: 'Selectivity + Covering Index',
  focus: 'Show how selectivity affects plan choice and covering indexes.',
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
