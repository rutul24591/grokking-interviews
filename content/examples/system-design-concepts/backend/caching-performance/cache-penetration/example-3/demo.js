/**
 * File: demo.js
 * What it does: Negative Cache TTL example focused on production/interview considerations.
 */
const scenario = {
  name: 'Negative Cache TTL',
  focus: 'Demonstrate short TTL negative caching.',
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
