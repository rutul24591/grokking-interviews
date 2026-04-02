# Focus

In the context of Data Migration Strategy (data, migration, strategy), this example provides a focused implementation of the concept below.

Cutovers are risky. Two mitigation patterns:

- **Shadow reads**: read from new, compare to legacy, but serve legacy.
- **Rollback**: keep a fast switch to revert reads/writes if metrics regress.

This example sketches a reconciliation approach that flags mismatches.

