The schema is normalized to 3NF to reduce duplication and update anomalies.
Orders reference customers; line items reference products.
Queries show how joins reconstruct the full domain view.
A denormalized reporting table speeds analytics at the cost of write complexity.
This mirrors the common OLTP vs OLAP split in backend systems.
