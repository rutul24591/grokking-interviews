Example 3 covers the advanced strategy-selection problem.

Different workloads need different rate-limiting approaches: debounce for server-bound bursts, time-based throttle
for periodic sampling, and animation-frame throttle for visual motion.

The script now runs sample event traces through each strategy so you can see how many handler executions each choice produces.
