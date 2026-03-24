# Example 2 — Route-level font budget (load non-critical fonts later)

Fonts are large and block rendering when misconfigured. This example focuses on a practical optimization:

- preload only the **default** UI font
- load a **non-critical** font (e.g. code font) only when the user needs it

This is useful for content platforms where only a subset of sessions ever reads code blocks deeply.

