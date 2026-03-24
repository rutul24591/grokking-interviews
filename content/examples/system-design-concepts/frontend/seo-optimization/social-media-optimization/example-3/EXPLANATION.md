# Example 3 — Advanced: safe fallbacks + multi-tenant guardrails

Social preview systems often get unsafe inputs:

- user-provided titles/descriptions that are too long
- user-provided images that could cause SSRF or privacy leaks

This example demonstrates:

- strict allowlists for OG images (no arbitrary remote URLs)
- truncation and sanitization for titles
- predictable fallbacks when content is missing

