# Reducing flakiness without slowing the org down

In the context of Frontend Testing Strategy (frontend, testing, strategy), this example provides a focused implementation of the concept below.

Teams usually lose velocity from flakiness long before they “run out of tests”.

Practical levers:
- Make randomness reproducible (seeded RNG).
- Mock time and network where the intent is not “real integration”.
- Restrict retries to small, well-understood areas; otherwise you mask regressions.

