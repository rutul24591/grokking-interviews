/**
 * File: demo.js
 * What it does: EXPLAIN Plan Walkthrough example focused on production/interview considerations.
 */
const scenario = {
  name: 'EXPLAIN Plan Walkthrough',
  focus: 'Include mock EXPLAIN output and plan selection rationale.',
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
