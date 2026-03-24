# Example 3 — Range requests (partial content) for large assets

When serving large media (videos, big PDFs, etc.), supporting `Range` requests enables:

- resume downloads
- better seek behavior
- efficient buffering (clients can fetch only what they need)

This example runs an asset server endpoint that supports `Range` and a UI that requests byte ranges.

