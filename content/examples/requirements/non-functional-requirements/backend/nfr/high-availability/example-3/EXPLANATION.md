# Focus

In the context of High Availability (high, availability), this example provides a focused implementation of the concept below.

HA systems must avoid split brain:

- two leaders accept writes
- data diverges and is hard to repair

Common mitigations:

- leader leases with expiry
- fencing tokens (only the latest leader can write)
- quorum-based elections

This example models a fencing token check.

