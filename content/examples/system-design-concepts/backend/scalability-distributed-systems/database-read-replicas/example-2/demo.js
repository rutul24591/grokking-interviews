/**
 * File: demo.js
 * What it does: Highlights production considerations for this topic.
 */
const summary = {
  topic: 'Database Read Replicas',
  focus: 'Primary write + replica lag and read routing.',
  considerations: [
    'SLO alignment and measurable signals',
    'Failure mode impact and mitigation',
    'Safe rollout and rollback planning',
  ],
};

console.log(summary);
