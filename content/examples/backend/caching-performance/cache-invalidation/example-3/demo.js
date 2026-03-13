/**
 * File: demo.js
 * What it does: Soft TTL + Revalidation example focused on production/interview considerations.
 */
const scenario = {
  name: 'Soft TTL + Revalidation',
  focus: 'Demonstrate stale-while-revalidate behavior.',
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
