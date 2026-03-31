# What this example shows

Polling loops can self-overlap if the origin slows down. This check covers the guard that prevents multiple concurrent polls from stacking up.
