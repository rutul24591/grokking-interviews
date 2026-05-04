# Form Builder — Full Implementation

Example 1 implements a schema-driven form builder:

- Dynamic fields (add/remove sections)
- Conditional fields (visibility/requiredness)
- Multi-step grouping (wizard integration)
- Validation hooks (sync/async)

Interview focus:
- Representing the form as data (schema) with stable IDs.
- Separating “schema” (what exists) from “state” (values/errors).
- Safe evaluation of conditions and derived fields.

