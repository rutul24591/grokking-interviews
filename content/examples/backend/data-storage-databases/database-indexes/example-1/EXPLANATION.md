Indexes speed up reads by providing ordered access paths.
The schema adds an index on email to support fast lookups.
EXPLAIN shows how the planner chooses an index scan vs seq scan.
Writes are slightly slower because indexes must be maintained.
