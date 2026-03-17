/**
 * File: demo.js
 * What it does: Tag Cardinality example focused on production/interview considerations.
 */
const scenario = {
  name: 'Tag Cardinality',
  focus: 'Show how high-cardinality tags affect memory/queries.',
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
