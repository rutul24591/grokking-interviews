# Conflict Resolution — Example 3

Three-way merge is useful when you have a clean ancestor.

In larger offline systems, you also need to know whether one update is:
- **causally newer** than another
- **already included** in local state
- **truly concurrent** with local edits

Version vectors give you that signal.

This example connects the theory to the product decision:
- `before` → incoming update is newer, auto-apply it
- `after` / `equal` → local already includes it, ignore the replay
- `concurrent` → surface a conflict or hand off to CRDT/OT logic

That makes this a better advanced companion to Example 2:
- Example 2 shows the merge algorithm
- Example 3 shows **when** a merge is even required
