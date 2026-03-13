/**
 * File: demo.js
 * What it does: Highlights production considerations for this topic.
 */
const summary = {
  topic: 'Event Sourcing',
  focus: 'Append events and rebuild aggregate state.',
  considerations: [
    'SLO alignment and measurable signals',
    'Failure mode impact and mitigation',
    'Safe rollout and rollback planning',
  ],
};

console.log(summary);
