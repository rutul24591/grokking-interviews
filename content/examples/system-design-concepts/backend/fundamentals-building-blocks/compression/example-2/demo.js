/**
 * File: demo.js
 * What it does: CPU vs Latency Profiling example focused on production/interview considerations.
 */
const scenario = {
  name: 'CPU vs Latency Profiling',
  focus: 'Compare compression ratios vs CPU time to show tradeoffs.',
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
