# Locale negotiation in practice

In the context of Internationalization Localization (internationalization, localization), this example provides a focused implementation of the concept below.

Production locale negotiation typically follows:

1. explicit user choice (cookie / account setting)
2. `Accept-Language` (q-values + region fallback like `fr-CA → fr`)
3. default locale

The key property is **determinism**: the same request should produce the same locale choice to prevent cache fragmentation and redirect loops.

