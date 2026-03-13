This example compares scaling up (bigger instances) vs scaling out (more instances).
The capacity model uses CPU, memory, and concurrency per instance.
The autoscaler prefers scale-out once vertical headroom is exhausted.
Scenarios show why horizontal scaling improves fault tolerance.
The trade-off is added coordination cost when scaling out.
