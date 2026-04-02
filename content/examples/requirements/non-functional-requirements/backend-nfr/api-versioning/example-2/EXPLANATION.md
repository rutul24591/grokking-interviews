# Backward compatibility via adapters

In the context of API Versioning (api, versioning), this example provides a focused implementation of the concept below.

A common production approach:
- keep a canonical internal model,
- and transform to per-version representations at the edge.

Adapters also make it easier to write compatibility tests and detect breaking changes.

