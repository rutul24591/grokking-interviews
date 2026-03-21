Chaos tests often fail “for the wrong reason”:

- The window is too short → random noise looks like degradation.
- The baseline is drifting → you compare apples to oranges.
- The metric is sparse → error rate changes are not statistically meaningful.

This example demonstrates an interview-grade approach to avoid false positives:

1) Collect baseline and experiment samples.
2) Use a lightweight bootstrap to estimate confidence of degradation.
3) Decide “meaningful regression” vs “noise”.

In production you’d also control for seasonality, correlated failures, and sampling bias, but this runnable script gets the core idea across clearly.

