/**
 * File: demo.js
 * What it does: Sticky Sessions + Affinity example focused on production/interview considerations.
 */
const scenario = {
  name: 'Sticky Sessions + Affinity',
  focus: 'Demonstrate session affinity routing and its downsides.',
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
