/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'sql-injection-prevention',
  title: 'Sql Injection Prevention',
  focus: 'Parameterized vs rejected unsafe input.',
  behavior: 'Parameterized vs rejected unsafe input.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
