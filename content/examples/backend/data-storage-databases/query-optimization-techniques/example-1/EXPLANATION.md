Optimization is about reducing work: fewer rows scanned and fewer joins.
Indexes help when predicates are selective and aligned with query order.
Covering indexes can avoid table lookups for hot queries.
EXPLAIN helps validate whether changes actually improved the plan.
