Deadlocks occur when transactions wait on each other in a cycle.
The lock manager tracks wait-for relationships.
The detector identifies cycles and aborts a victim.
This mirrors how databases resolve deadlocks in practice.
