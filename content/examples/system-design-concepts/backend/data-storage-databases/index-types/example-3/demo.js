/**
 * File: demo.js
 * What it does: Bitmap + Range Index example focused on production/interview considerations.
 */
const scenario = {
  name: 'Bitmap + Range Index',
  focus: 'Demonstrate bitmap index strengths on low-cardinality columns.',
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
