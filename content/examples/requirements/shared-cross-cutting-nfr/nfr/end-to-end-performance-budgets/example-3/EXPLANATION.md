In the context of End To End Performance Budgets (end, end, performance, budgets), this example provides a focused implementation of the concept below.

This example covers an advanced implementation detail: **percentile tracking** with a bounded histogram.

In production you avoid storing all samples forever; instead you track approximate percentiles
with fixed memory (HDR histograms, t-digest, CKMS).

This demo uses a simple bucketed histogram to approximate p95.

