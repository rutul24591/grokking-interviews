## When this matters

If you evaluate permissions very frequently (e.g., per request, per UI render),
bitmasks reduce memory and CPU vs set membership checks.

Trade-off: less readable; requires careful mapping and tests.

