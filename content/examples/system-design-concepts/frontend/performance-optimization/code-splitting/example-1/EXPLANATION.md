Example 1 is a full app showing code-splitting at the points where users naturally branch.

It demonstrates:
- A small initial article feed route.
- A heavy diff explorer loaded only when the user opens a deep comparison workflow.
- A separate Node API so the route shell and the interactive analyzer stay decoupled.

This is the operational version of code splitting: split along user intent, not arbitrary file boundaries.

