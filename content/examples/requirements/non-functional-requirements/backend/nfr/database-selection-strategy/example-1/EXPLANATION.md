# What this example covers

Database selection is a backend NFR because picking the wrong storage engine creates long-term:

- latency issues
- scaling ceilings
- operational complexity
- migration cost

This example implements a pragmatic approach:

- collect workload requirements (consistency, query patterns, latency, scale)
- score candidate databases with weighted signals
- return a recommendation **with reasons**, not just a label

In real systems, you’d validate the recommendation with:

- production-like benchmarks (data shape + query mix)
- failure mode testing (region failover, partial outage)
- operational constraints (team expertise, managed services, compliance)

