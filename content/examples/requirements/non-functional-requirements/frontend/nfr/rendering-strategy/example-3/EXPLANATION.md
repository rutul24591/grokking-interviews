# Edge case: caching + personalization

In the context of Rendering Strategy (rendering, strategy), this example provides a focused implementation of the concept below.

The most dangerous failure mode is leaking personalized content via shared caches.

Controls:
- strict cache headers for personalized responses (`private`, `no-store`),
- vary/caching only on safe dimensions,
- and explicit separation between shared HTML and personalized fragments.

