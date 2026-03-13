The REST API models a single resource type: `books`.
The router maps HTTP verbs to resource operations (list, fetch, create).
Handlers return correct status codes and a consistent error payload.
Validation ensures the API contract rejects invalid input early.
The Location header demonstrates how clients can discover new resource URLs.
This structure scales by adding new resources and keeping handlers focused.
