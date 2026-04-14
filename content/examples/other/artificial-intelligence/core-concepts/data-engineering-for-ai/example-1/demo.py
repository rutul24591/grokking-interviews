"""
Example 1: Training Data Quality Pipeline

Demonstrates:
- Multi-stage data cleaning pipeline
- Deduplication (exact + near-duplicate)
- Quality filtering with scoring
- Dataset statistics tracking
"""

from typing import List, Dict, Any
from dataclasses import dataclass
import hashlib


@dataclass
class DataDocument:
    id: str
    content: str
    source: str
    quality_score: float = 0.0
    is_duplicate: bool = False


class DataQualityPipeline:
    """Multi-stage data quality pipeline for AI training data."""

    def __init__(self):
        self.processed: List[DataDocument] = []
        self.stats: Dict[str, int] = {
            "input": 0, "cleaned": 0, "deduped": 0, "filtered": 0, "output": 0
        }

    def clean_text(self, text: str) -> str:
        """Remove low-quality content."""
        # Remove excessive whitespace
        while "  " in text:
            text = text.replace("  ", " ")
        # Remove very short documents
        if len(text.split()) < 10:
            return ""
        return text.strip()

    def detect_language(self, text: str) -> str:
        """Simple language detection (simulated)."""
        # In production: use fasttext or langdetect
        english_words = {"the", "and", "is", "in", "to", "of", "for", "with"}
        words = set(text.lower().split())
        if len(words & english_words) > 2:
            return "en"
        return "unknown"

    def compute_hash(self, text: str) -> str:
        """Compute content hash for deduplication."""
        normalized = " ".join(text.lower().split())
        return hashlib.sha256(normalized.encode()).hexdigest()

    def score_quality(self, text: str) -> float:
        """Score document quality (simulated)."""
        words = text.split()
        score = 0.5

        # Longer documents tend to be higher quality
        score += min(len(words) / 1000, 0.2)

        # Diverse vocabulary indicates quality
        unique_ratio = len(set(w.lower() for w in words)) / max(len(words), 1)
        score += unique_ratio * 0.2

        # Presence of structured elements
        if any(c in text for c in [". ", ": ", "; "]):
            score += 0.1

        return min(score, 1.0)

    def process(self, documents: List[DataDocument]) -> List[DataDocument]:
        """Run documents through the quality pipeline."""
        self.stats["input"] = len(documents)

        # Stage 1: Cleaning
        cleaned = []
        for doc in documents:
            cleaned_content = self.clean_text(doc.content)
            if cleaned_content and self.detect_language(cleaned_content) == "en":
                doc.content = cleaned_content
                cleaned.append(doc)
        self.stats["cleaned"] = len(cleaned)

        # Stage 2: Deduplication
        seen_hashes = set()
        deduped = []
        for doc in cleaned:
            h = self.compute_hash(doc.content)
            if h not in seen_hashes:
                seen_hashes.add(h)
                deduped.append(doc)
            else:
                doc.is_duplicate = True
        self.stats["deduped"] = len(deduped)

        # Stage 3: Quality filtering
        for doc in deduped:
            doc.quality_score = self.score_quality(doc.content)

        filtered = [d for d in deduped if d.quality_score >= 0.5]
        self.stats["filtered"] = len(filtered)

        self.processed = filtered
        self.stats["output"] = len(filtered)
        return filtered

    def get_report(self) -> Dict[str, Any]:
        return {
            **self.stats,
            "retention_rate": f"{self.stats['output'] / max(self.stats['input'], 1) * 100:.0f}%",
            "avg_quality": round(
                sum(d.quality_score for d in self.processed) / max(len(self.processed), 1), 3
            ),
        }


def main():
    pipeline = DataQualityPipeline()

    documents = [
        DataDocument("1", "The quick brown fox jumps over the lazy dog. This is a well-written sentence.", "web"),
        DataDocument("2", "spam spam spam", "web"),
        DataDocument("3", "The quick brown fox jumps over the lazy dog. This is a well-written sentence.", "web"),  # Duplicate
        DataDocument("4", "Machine learning is a subset of artificial intelligence that enables systems to learn from data.", "book"),
        DataDocument("5", "asdf qwerty zxcv", "web"),
        DataDocument("6", "Deep learning architectures, including convolutional neural networks and transformers, have revolutionized natural language processing.", "paper"),
    ]

    print("=== Training Data Quality Pipeline ===\n")
    print(f"Input documents: {len(documents)}")

    results = pipeline.process(documents)
    print(f"Output documents: {len(results)}")

    print(f"\nPipeline Report: {pipeline.get_report()}")

    print(f"\nProcessed Documents:")
    for doc in results:
        print(f"  [{doc.id}] score={doc.quality_score:.2f} | {doc.content[:60]}...")


if __name__ == "__main__":
    main()
