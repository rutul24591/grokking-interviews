# Windowing as a performance NFR

Large lists fail due to:
- DOM node count,
- layout/reflow cost,
- and main-thread work during scroll.

Virtualization keeps UI responsive by rendering only visible rows + overscan.

This example also includes `GET /api/rows` and a “Virtualized (remote)” mode to show a common production extension: windowing + range-based prefetch + page caching for server-backed datasets.
