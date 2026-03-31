Example 1 is a production-style bundle-size optimization demo for a content dashboard.

It demonstrates:
- A lean initial route that avoids loading heavy visualization code until the user explicitly opens analysis mode.
- An origin API serving recommendation data separately from the UI shell.
- A small replacement utility for date formatting instead of shipping a heavyweight date library.

The goal is to keep the initial JavaScript small and push optional code into secondary chunks.

