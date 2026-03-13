// Move to DLQ after retries
if (attempts > 3) await dlq.add(job);
