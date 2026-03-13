/**
 * File: demo.js
 * What it does: I18N Edge Cases example focused on production/interview considerations.
 */
const scenario = {
  name: 'I18N Edge Cases',
  focus: 'Show grapheme clusters, case folding, and byte-length pitfalls.',
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
