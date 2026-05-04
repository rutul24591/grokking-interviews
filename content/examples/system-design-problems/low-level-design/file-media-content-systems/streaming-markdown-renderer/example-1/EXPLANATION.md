# Streaming Markdown Renderer — Full Implementation (Incremental Parse Model)

Example 1 models an incremental markdown renderer designed for streaming sources (LLM output, live logs):

- Token/chunk ingestion model
- Incremental block building (paragraphs, code fences)
- Safe rendering surface (sanitization hooks)
- Backpressure strategy (limit retained history)

Interview focus:
- Preventing XSS (never trust markdown → HTML directly)
- Handling code fences that span chunks

