/**
 * File: demo.js
 * What it does: Normalization + Search example focused on production/interview considerations.
 */
const scenario = {
  name: 'Normalization + Search',
  focus: 'Demonstrate normalization forms and how they affect comparisons/search.',
  considerations: [
    'Designed for staff/principal interview discussion and production tradeoffs.',
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
