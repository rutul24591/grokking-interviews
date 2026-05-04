# File Upload System — Full Implementation (Queue + Chunking Model)

Example 1 models a production file upload subsystem:

- Drag/drop intake + validation policy
- Upload queue with concurrency limits
- Chunked uploads + resumability (client state)
- Progress aggregation (per chunk → per file)
- Retry with jitter and idempotency hooks

Interview focus:
- State machine design (queued → hashing → uploading → committed/failed/canceled)
- Backpressure and fairness across many files
- Persisting resumable state safely (versioned)

