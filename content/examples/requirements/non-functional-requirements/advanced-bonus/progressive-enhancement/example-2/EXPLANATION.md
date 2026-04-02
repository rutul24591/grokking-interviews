This example focuses on a production-grade baseline for forms: **Post/Redirect/Get (PRG)** + **CSRF protection**.

Progressive enhancement is easier when the “no-JS” workflow is correct and secure:
- PRG prevents duplicate submissions on refresh.
- CSRF tokens prevent cross-site POSTs from other origins.

This is a minimal, framework-agnostic implementation of the “double submit cookie” CSRF technique.

