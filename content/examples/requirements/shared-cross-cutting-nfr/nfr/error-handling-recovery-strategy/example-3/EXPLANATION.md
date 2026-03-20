This example demonstrates an advanced recovery pattern: **sagas with compensation**.

When you can’t do a distributed transaction, you:
- perform steps with durable state
- on failure, run compensating actions for completed steps

