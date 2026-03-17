/**
 * File: demo.js
 * What it does: Inodes + Caching example focused on production/interview considerations.
 */
const scenario = {
  name: 'Inodes + Caching',
  focus: 'Show inode lookup and cache behavior.',
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
