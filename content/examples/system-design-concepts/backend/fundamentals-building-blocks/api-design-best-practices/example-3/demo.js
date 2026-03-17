/**
 * File: demo.js
 * What it does: Pagination + Schema Evolution example focused on production/interview considerations.
 */
const scenario = {
  name: 'Pagination + Schema Evolution',
  focus: 'Show cursor pagination, stable sorting, and backward-compatible schema evolution.',
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
