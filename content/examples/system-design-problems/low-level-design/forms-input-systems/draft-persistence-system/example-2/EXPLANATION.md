# Draft Persistence — Follow-up: Debounced Autosave

Example 2 focuses on autosave triggering:
- debounce to reduce write amplification
- flush on “pagehide” / “beforeunload”
- backpressure when storage is slow

