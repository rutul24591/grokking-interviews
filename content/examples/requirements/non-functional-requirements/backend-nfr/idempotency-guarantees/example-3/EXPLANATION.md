# Focus

Idempotency must cover *side effects* too (emails, pub/sub events).

A common approach:

- write the business record + an outbox event in the same transaction
- publish outbox events asynchronously with de-dupe

This example sketches an outbox publisher that ensures an event is published once even if the publisher retries.

