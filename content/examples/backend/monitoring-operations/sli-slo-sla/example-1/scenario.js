/**
 * File: scenario.js
 * What it does: Declares the topic focus and tunable knobs for this example.
 */
module.exports = {
  topic: 'sli-slo-sla',
  title: 'Sli Slo Sla',
  focus: 'SLI measurement and SLO compliance.',
  behavior: 'SLI measurement and SLO compliance.',
  knobs: {
    simulateLatencyMs: 120,
    sampleSize: 20,
  },
};
