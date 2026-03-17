/**
 * File: demo.js
 * What it does: Quorum Reads/Writes example focused on production/interview considerations.
 */
const scenario = {
  name: 'Quorum Reads/Writes',
  focus: 'Model R/W quorum and consistency guarantees.',
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
