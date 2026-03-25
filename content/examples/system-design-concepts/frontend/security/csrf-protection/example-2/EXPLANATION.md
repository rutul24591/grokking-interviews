## Why Origin checks are effective

For same-site browser requests, `Origin` is typically present and reliable for CSRF defense.

Edge cases:
- Some legacy flows omit `Origin` (fallback to `Referer`).
- Some non-browser clients may not send either (require explicit auth or a different trust model).

