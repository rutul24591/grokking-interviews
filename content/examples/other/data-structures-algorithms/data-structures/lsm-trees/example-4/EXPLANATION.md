Example 3 focuses on edge cases and correctness checks you should validate in production-style code.

Models WAL replay to show how write-ahead logging pairs with memtables to survive crashes between flushes.

It demonstrates:
- updates are appended to the log before being applied to memory
- replay reconstructs memtable state after a simulated crash
- flush boundary determines what must be replayed on restart
