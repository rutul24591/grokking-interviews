In the context of Error Handling Recovery Strategy (error, handling, recovery, strategy), this example provides a focused implementation of the concept below.

This example focuses on one reusable building block: a **retry policy**.

Good retry behavior is:
- bounded (attempts / time budget)
- jittered (avoid synchronized retries)
- selective (only retry transient failures)

