/**
 * File: demo.js
 * What it does: NAT + Private/Public Routing example focused on production/interview considerations.
 */
const scenario = {
  name: 'NAT + Private/Public Routing',
  focus: 'Demonstrate NAT, private subnet routing, and egress control.',
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
