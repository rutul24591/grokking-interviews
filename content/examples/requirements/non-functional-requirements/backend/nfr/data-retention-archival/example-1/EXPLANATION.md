# What this example covers

Data retention and archival is a backend NFR because it impacts:

- compliance (GDPR/CCPA/industry rules)
- cost (hot storage vs cold storage)
- system performance (indexes, query latency)

This example implements:

- **active store** and **archive store**
- retention policy with **archive-after** and **delete-after**
- **legal holds** (exceptions that prevent deletion)

In production you’d do this with:

- partitioned tables + TTL / drop partitions,
- lifecycle policies in object storage (S3/Blob/GCS),
- and audit trails for deletion/archival actions.

