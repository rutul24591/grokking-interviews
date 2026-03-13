/**
 * File: demo.js
 * What it does: Hypermedia + Versioned Links example focused on production/interview considerations.
 */
const scenario = {
  name: 'Hypermedia + Versioned Links',
  focus: 'Show HATEOAS-style link relations and resource versioning without URL churn.',
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
