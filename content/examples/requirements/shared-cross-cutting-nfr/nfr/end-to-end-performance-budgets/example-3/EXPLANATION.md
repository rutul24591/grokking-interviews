This example covers an advanced implementation detail: **percentile tracking** with a bounded histogram.

In production you avoid storing all samples forever; instead you track approximate percentiles
with fixed memory (HDR histograms, t-digest, CKMS).

This demo uses a simple bucketed histogram to approximate p95.

