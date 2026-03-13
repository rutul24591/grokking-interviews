/**
 * File: demo.js
 * What it does: Cache Key Design example focused on production/interview considerations.
 */
const scenario = {
  name: 'Cache Key Design',
  focus: 'Show namespace/versioned cache keys and memory pressure handling.',
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
