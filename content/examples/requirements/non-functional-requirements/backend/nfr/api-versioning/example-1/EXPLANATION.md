# API versioning as a backend NFR

Versioning is an NFR because it determines:
- client upgrade velocity,
- blast radius of changes,
- and long-term maintenance costs.

This example includes:
- three version selection mechanisms (query/header/vendor media type),
- and deprecation headers (`Deprecation`, `Sunset`, `Link`) for v1.

