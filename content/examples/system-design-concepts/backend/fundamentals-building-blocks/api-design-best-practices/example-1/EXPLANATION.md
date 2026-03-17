This example demonstrates API hygiene for collection endpoints.
Pagination is cursor-based to avoid expensive offsets at scale.
Filtering and sorting are explicit and validated to prevent ambiguous behavior.
Responses include a stable envelope with `data` and `meta` fields.
Errors share a consistent structure so clients can handle failures reliably.
The server code shows how to parse and validate query parameters safely.
