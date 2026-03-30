# Conflict Resolution — Example 1

This example uses a classic three-way merge posture:

- compare `ancestor` vs `local`
- compare `ancestor` vs `server`
- auto-merge non-overlapping changes
- surface overlapping changes as conflicts

Why not plain last-write-wins?
- global LWW discards intent too aggressively
- field-level or semantic merges preserve more useful user work

