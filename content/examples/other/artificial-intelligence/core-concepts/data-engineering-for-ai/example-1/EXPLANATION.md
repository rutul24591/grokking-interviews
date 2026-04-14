# Training Data Quality Pipeline

## How to Run

```bash
python demo.py
```

No external dependencies required. Uses only Python standard library (`dataclasses`, `typing`, `hashlib`, `json`).

## What This Demonstrates

This example implements a multi-stage data cleaning pipeline for AI training data, demonstrating text cleaning, language detection, exact deduplication via content hashing, and quality filtering with scoring. It tracks dataset statistics at each stage to measure data retention rates and output quality.

## Code Walkthrough

### Key Classes

- **`DataDocument`** (dataclass): Represents a single document with `id`, `content`, `source`, `quality_score`, and `is_duplicate` flag.
- **`DataQualityPipeline`**: The core pipeline class with four processing stages and statistics tracking.

### Pipeline Stages

1. **Cleaning** (`clean_text`): Removes excessive whitespace, filters out documents shorter than 10 words, and strips surrounding whitespace.
2. **Language Detection** (`detect_language`): Simple heuristic-based detection using common English word frequency. Documents with fewer than 2 common English words are filtered out.
3. **Deduplication** (`compute_hash`): Computes SHA-256 hash of normalized (lowercased, whitespace-normalized) content. Duplicate hashes are filtered, keeping only the first occurrence.
4. **Quality Filtering** (`score_quality`): Scores documents 0-1.0 based on length (longer = better up to 1000 words), vocabulary diversity (unique word ratio), and presence of structured elements (sentences with punctuation). Documents scoring below 0.5 are filtered out.

### Execution Flow

1. **`main()`** creates a pipeline with 6 input documents including a short spam document, a duplicate, and well-formed documents from different sources.
2. `process()` runs documents through all four stages sequentially.
3. Statistics are tracked at each stage: input count, cleaned count, deduped count, filtered count, and final output count.
4. `get_report()` produces a summary with retention rate and average quality score of output documents.

### Important Variables

- `self.stats`: Dictionary tracking document counts at each pipeline stage.
- `quality_score >= 0.5`: Minimum quality threshold for inclusion in training data.
- `sha256` hash: Deterministic content fingerprint for exact deduplication.

## Key Takeaways

- Data quality directly determines model quality -- garbage in, garbage out is the fundamental principle of ML.
- Deduplication is essential: training on duplicate content biases the model toward reproducing duplicated patterns.
- Multi-stage pipelines allow fine-grained control over data quality and enable measuring loss at each stage.
- Near-duplicate detection (e.g., MinHash + LSH) is needed in production alongside exact deduplication for documents with minor variations.
- Quality scoring heuristics (length, vocabulary diversity, structure) are a practical starting point but production systems often use classifier-based filtering.
