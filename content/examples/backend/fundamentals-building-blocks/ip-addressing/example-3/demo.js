/**
 * File: demo.js
 * What it does: NAT + Longest Prefix Match example focused on production/interview considerations.
 */
const scenario = {
  name: 'NAT + Longest Prefix Match',
  focus: 'Simulate NAT translation and longest-prefix routing decisions.',
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
