This example demonstrates an advanced interoperability pattern: emitting lineage events in an **OpenLineage-shaped** schema (simplified) and validating them.

Real systems use OpenLineage (and tools like Marquez) to normalize events from many pipelines:
- jobs and runs
- inputs and outputs
- dataset identifiers, namespaces
- facets for ownership, documentation, column-level lineage, etc.

