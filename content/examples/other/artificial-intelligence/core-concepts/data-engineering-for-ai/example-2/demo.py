"""
Example 2: Dataset Versioning and Provenance Tracker

Demonstrates:
- Versioning datasets with content hashes
- Tracking data sources and processing rules
- Mapping model versions to dataset versions
- Reproducible dataset reconstruction
"""

from typing import Dict, List, Any
from dataclasses import dataclass, field
from datetime import datetime
import hashlib
import json


@dataclass
class DatasetVersion:
    version_id: str
    created_at: str
    sources: List[str]
    processing_rules: Dict[str, Any]
    quality_metrics: Dict[str, float]
    document_count: int
    token_count: int
    content_hash: str


class DatasetRegistry:
    """Tracks dataset versions and model-dataset lineage."""

    def __init__(self):
        self.versions: Dict[str, DatasetVersion] = {}
        self.model_dataset_map: Dict[str, str] = {}  # model_version → dataset_version

    def compute_content_hash(self, documents: List[str]) -> str:
        """Compute deterministic hash of dataset content."""
        combined = "".join(sorted(documents))
        return hashlib.sha256(combined.encode()).hexdigest()[:16]

    def register_version(
        self,
        documents: List[str],
        sources: List[str],
        processing_rules: Dict[str, Any],
        quality_metrics: Dict[str, float],
    ) -> str:
        """Register a new dataset version."""
        content_hash = self.compute_content_hash(documents)
        version_id = f"ds-{content_hash}"

        if version_id in self.versions:
            return version_id  # Already registered

        # Estimate token count (1.3 tokens per word)
        token_count = int(sum(len(d.split()) * 1.3 for d in documents))

        version = DatasetVersion(
            version_id=version_id,
            created_at=datetime.now().isoformat(),
            sources=sources,
            processing_rules=processing_rules,
            quality_metrics=quality_metrics,
            document_count=len(documents),
            token_count=token_count,
            content_hash=content_hash,
        )
        self.versions[version_id] = version
        return version_id

    def link_model_to_dataset(self, model_version: str, dataset_version: str) -> bool:
        """Link a model version to its training dataset."""
        if dataset_version not in self.versions:
            return False
        self.model_dataset_map[model_version] = dataset_version
        return True

    def get_model_lineage(self, model_version: str) -> Dict[str, Any]:
        """Get the full lineage of a model (which dataset trained it)."""
        dataset_version = self.model_dataset_map.get(model_version)
        if not dataset_version:
            return {"error": f"No dataset linked to model {model_version}"}

        dataset = self.versions[dataset_version]
        return {
            "model_version": model_version,
            "training_dataset": dataset_version,
            "dataset_created": dataset.created_at,
            "document_count": dataset.document_count,
            "token_count": dataset.token_count,
            "sources": dataset.sources,
            "processing_rules": dataset.processing_rules,
            "quality_metrics": dataset.quality_metrics,
        }

    def get_version_history(self) -> List[Dict[str, Any]]:
        return [
            {
                "version": v.version_id,
                "created": v.created_at,
                "documents": v.document_count,
                "tokens": v.token_count,
                "sources": len(v.sources),
            }
            for v in sorted(self.versions.values(), key=lambda x: x.created_at)
        ]


def main():
    registry = DatasetRegistry()

    # Register dataset versions
    docs_v1 = ["Document about AI", "Document about ML", "Document about NLP"]
    v1 = registry.register_version(
        documents=docs_v1,
        sources=["web-crawl-2024-01", "books-corpus"],
        processing_rules={"min_length": 100, "language": "en", "dedup": True},
        quality_metrics={"avg_readability": 0.75, "language_coverage": 0.9},
    )

    docs_v2 = docs_v1 + ["Document about deep learning", "Document about transformers"]
    v2 = registry.register_version(
        documents=docs_v2,
        sources=["web-crawl-2024-01", "books-corpus", "papers-arxiv"],
        processing_rules={"min_length": 100, "language": "en", "dedup": True, "quality_filter": 0.5},
        quality_metrics={"avg_readability": 0.82, "language_coverage": 0.95},
    )

    # Link models to datasets
    registry.link_model_to_dataset("model-v1.0", v1)
    registry.link_model_to_dataset("model-v2.0", v2)

    print("=== Dataset Versioning & Provenance ===\n")

    print("Version History:")
    for v in registry.get_version_history():
        print(f"  {v['version']}: {v['documents']} docs, {v['tokens']} tokens, {v['sources']} sources")

    print(f"\nModel Lineage (model-v2.0):")
    lineage = registry.get_model_lineage("model-v2.0")
    for key, value in lineage.items():
        print(f"  {key}: {value}")


if __name__ == "__main__":
    main()
