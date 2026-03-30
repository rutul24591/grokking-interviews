# IndexedDB Example 3

Schema evolution is where IndexedDB usually hurts teams. The important behaviors are:

- versioned upgrades
- backward-compatible migration logic
- blocked upgrades when old tabs still hold the database open

