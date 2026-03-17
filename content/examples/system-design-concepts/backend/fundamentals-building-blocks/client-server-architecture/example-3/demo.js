/**
 * File: demo.js
 * What it does: Service Boundary Contracts example focused on production/interview considerations.
 */
const scenario = {
  name: 'Service Boundary Contracts',
  focus: 'Demonstrate contract versioning, error isolation, and cross-cutting concerns (auth, quotas, tracing) at tier boundaries.',
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
