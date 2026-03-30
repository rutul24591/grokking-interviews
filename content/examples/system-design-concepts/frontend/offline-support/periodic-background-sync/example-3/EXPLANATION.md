# Periodic Background Sync — Example 3

Periodic refresh is safest when it is cheap.

This example shows the production pattern:
- client sends `If-None-Match` with the last known `ETag`
- server returns `304 Not Modified` when nothing changed
- client avoids downloading and parsing the full payload

This matters because background refresh competes with:
- battery budget
- data budget
- browser throttling

