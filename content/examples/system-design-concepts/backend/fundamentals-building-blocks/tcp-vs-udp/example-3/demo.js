/**
 * File: demo.js
 * What it does: Flow Control + Buffering example focused on production/interview considerations.
 */
const scenario = {
  name: 'Flow Control + Buffering',
  focus: 'Illustrate receiver window limits and buffer pressure under bursty load.',
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
