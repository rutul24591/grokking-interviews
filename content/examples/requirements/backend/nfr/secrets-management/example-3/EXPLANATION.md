# Focus

In the context of Secrets Management (secrets, management), this example provides a focused implementation of the concept below.

Envelope encryption uses:

- a master key in KMS/HSM
- per-record (or per-batch) data keys

You encrypt data with the data key and store the encrypted data key alongside the ciphertext.

This example sketches the data structures.

