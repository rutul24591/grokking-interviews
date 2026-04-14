# Dataset Versioning and Provenance Tracker

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`dataclasses`, `typing`, `datetime`, `hashlib`, `json`).

## What This Demonstrates

This example implements a dataset registry that version-controls training datasets using content hashes, tracks data sources and processing rules, links model versions to their training datasets, and enables full lineage reconstruction for reproducibility and compliance.

## Code Walkthrough

### Key Classes

- **`DatasetVersion`** (dataclass): Represents a versioned dataset with `version_id`, `created_at`, `sources`, `processing_rules`, `quality_metrics`, `document_count`, `token_count`, and `content_hash`.
- **`DatasetRegistry`**: The core registry class managing dataset versions and model-to-dataset lineage mapping.

### Key Methods

1. **`compute_content_hash(documents)`**: Creates a deterministic hash by sorting documents, concatenating them, and computing SHA-256. Returns the first 16 hex characters as a short identifier.
2. **`register_version()`**: Registers a new dataset version only if the content hash is unique (prevents duplicate registrations). Estimates token count using a 1.3 tokens-per-word heuristic.
3. **`link_model_to_dataset(model_version, dataset_version)`**: Creates a mapping between a trained model and its training dataset for lineage tracking.
4. **`get_model_lineage(model_version)`**: Reconstructs the full training lineage for a model, including dataset sources, processing rules, document counts, token counts, and quality metrics.

### Execution Flow

1. **`main()`** creates a `DatasetRegistry` and registers two dataset versions:
   - **v1**: 3 documents from web crawl and books corpus with basic processing rules.
   - **v2**: 5 documents (adds papers from arXiv) with an additional quality filter rule.
2. Two model versions are linked to their respective training datasets (model-v1.0 -> ds-v1, model-v2.0 -> ds-v2).
3. Version history is printed showing document counts, token counts, and source counts.
4. Model lineage for model-v2.0 is reconstructed, showing the complete provenance chain.

### Important Variables

- `content_hash`: Deterministic identifier derived from sorted document content -- identical datasets always produce the same hash.
- `model_dataset_map`: Dictionary mapping model version strings to dataset version IDs.
- Token count estimate: `words * 1.3` -- approximate token count based on empirical ratio.

## Key Takeaways

- Dataset versioning with content hashes enables exact reproduc: any model can be traced back to its exact training data.
- Processing rules (filters, language selection, dedup settings) must be versioned alongside data to ensure reproducible dataset reconstruction.
- Model-dataset lineage is critical for compliance, debugging (did a model degrade because of bad training data?), and retraining decisions.
- The content hash approach avoids storing duplicate datasets -- identical content always maps to the same version ID.
- Production systems should also track data licenses, PII flags, and retention policies alongside version metadata.
