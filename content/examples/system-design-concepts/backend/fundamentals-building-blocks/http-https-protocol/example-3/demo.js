/**
 * File: demo.js
 * What it does: HTTP/2 + Connection Reuse example focused on production/interview considerations.
 */
const scenario = {
  name: 'HTTP/2 + Connection Reuse',
  focus: 'Demonstrate multiplexing and its impact on latency.',
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
