# PWA Example 2 — Why a manifest audit matters

In production, “PWA installable” failures are often caused by:
- missing/invalid required manifest fields
- icons that don’t meet size/format requirements
- incorrect `scope` / `start_url` leading to weird navigation after install

This script is intentionally simple and interview-friendly:
- validates required fields
- highlights common icon pitfalls
- reminds that installability also depends on HTTPS + a functioning service worker

