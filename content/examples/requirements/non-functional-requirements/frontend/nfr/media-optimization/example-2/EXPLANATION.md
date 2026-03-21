# Responsive images without guesswork

In the context of Media Optimization (media, optimization), this example provides a focused implementation of the concept below.

The browser chooses a `srcset` candidate based on:

- viewport width,
- device pixel ratio,
- and the `sizes` hint.

Teams often miss `sizes` and accidentally ship large assets to mobile. This example prints a simple,
cache-friendly `srcset` policy.

