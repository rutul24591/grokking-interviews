# Bulk Data Import System - Example 2 Explanation

This example is tied to the article topic, not a generic placeholder. It models data movement entities (job, schema, rowError, checkpoint, exportArtifact, privacyPolicy), telemetry (invalidRowRate, checkpointAgeMs, retryCount, piiColumnCount, outputSizeMb), and operational actions (quarantine-batch, resume-from-checkpoint, redact-export, require-schema-mapping).

The code is meant to support interview discussion about invariants, failure boundaries, rollout safety, recovery, and the evidence needed to operate the design in production.
