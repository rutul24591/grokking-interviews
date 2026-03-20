In the context of Versioning Backward Compatibility (versioning, backward, compatibility), this example provides a focused implementation of the concept below.

This example demonstrates an advanced practice: **contract tests** using “golden” JSON payloads.

In production:
- each API version has a schema + a suite of golden payloads
- CI validates that new server changes don’t break existing clients

