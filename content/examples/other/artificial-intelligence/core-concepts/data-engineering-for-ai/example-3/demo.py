"""
Example 3: LLM-Assisted Labeling Pipeline

Demonstrates:
- Using LLM to generate draft labels
- Confidence-based human review routing
- Calibration of LLM labels against expert labels
- Quality tracking across iterations
"""

from typing import List, Dict, Any
from dataclasses import dataclass


@dataclass
class LabeledExample:
    id: str
    input_text: str
    llm_label: str
    llm_confidence: float
    human_label: str = ""
    needs_review: bool = True
    agreed: bool = False


class LLMAssistedLabeler:
    """LLM-assisted labeling with human review calibration."""

    def __init__(self, confidence_threshold: float = 0.85):
        self.confidence_threshold = confidence_threshold
        self.examples: List[LabeledExample] = []
        self.calibration_scores: Dict[str, float] = {}

    def generate_llm_label(self, input_text: str) -> tuple[str, float]:
        """Simulate LLM label generation (in production, this calls an LLM)."""
        # Simulated labeling based on content patterns
        if "positive" in input_text.lower() or "great" in input_text.lower():
            return "positive", 0.92
        elif "negative" in input_text.lower() or "bad" in input_text.lower():
            return "negative", 0.88
        elif "neutral" in input_text.lower() or "okay" in input_text.lower():
            return "neutral", 0.65
        else:
            return "neutral", 0.50

    def label_dataset(self, inputs: List[tuple[str, str]]) -> None:
        """Label a dataset with LLM labels."""
        for id_, text in inputs:
            label, confidence = self.generate_llm_label(text)
            needs_review = confidence < self.confidence_threshold
            self.examples.append(LabeledExample(
                id=id_,
                input_text=text,
                llm_label=label,
                llm_confidence=confidence,
                needs_review=needs_review,
            ))

    def human_review(self, example_id: str, human_label: str) -> None:
        """Apply human review to an example."""
        for ex in self.examples:
            if ex.id == example_id:
                ex.human_label = human_label
                ex.needs_review = False
                ex.agreed = (ex.llm_label == human_label)
                break

    def auto_accept_high_confidence(self) -> int:
        """Auto-accept labels above confidence threshold."""
        count = 0
        for ex in self.examples:
            if ex.needs_review and ex.llm_confidence >= self.confidence_threshold:
                ex.human_label = ex.llm_label
                ex.needs_review = False
                ex.agreed = True
                count += 1
        return count

    def get_calibration_report(self) -> Dict[str, Any]:
        """Generate calibration report comparing LLM vs human labels."""
        reviewed = [ex for ex in self.examples if not ex.needs_review and ex.human_label]
        if not reviewed:
            return {"status": "No human-reviewed examples yet"}

        agreement = sum(1 for ex in reviewed if ex.agreed)
        accuracy = agreement / len(reviewed)

        by_confidence = {}
        for bucket in ["0.5-0.7", "0.7-0.85", "0.85-0.95", "0.95-1.0"]:
            low, high = float(bucket.split("-")[0]), float(bucket.split("-")[1])
            bucket_examples = [ex for ex in reviewed if low <= ex.llm_confidence < high]
            if bucket_examples:
                bucket_accuracy = sum(1 for ex in bucket_examples if ex.agreed) / len(bucket_examples)
                by_confidence[bucket] = round(bucket_accuracy, 3)

        return {
            "total_examples": len(self.examples),
            "human_reviewed": len(reviewed),
            "auto_accepted": len(self.examples) - len([ex for ex in self.examples if ex.needs_review]) - len(reviewed),
            "still_needing_review": sum(1 for ex in self.examples if ex.needs_review),
            "llm_accuracy": round(accuracy, 3),
            "accuracy_by_confidence": by_confidence,
        }


def main():
    labeler = LLMAssistedLabeler(confidence_threshold=0.85)

    inputs = [
        ("ex-1", "This product is great and works well"),
        ("ex-2", "Terrible experience, bad quality"),
        ("ex-3", "It's okay, nothing special"),
        ("ex-4", "Absolutely love this, highly recommend"),
        ("ex-5", "Not bad but could be better"),
        ("ex-6", "Worst purchase ever, complete waste"),
        ("ex-7", "Average product, neutral feelings"),
        ("ex-8", "Exceeded my expectations, positive experience"),
    ]

    print("=== LLM-Assisted Labeling Pipeline ===\n")

    # Step 1: LLM generates labels
    labeler.label_dataset(inputs)
    print(f"Step 1: LLM labeled {len(labeler.examples)} examples")

    # Step 2: Auto-accept high confidence
    auto_count = labeler.auto_accept_high_confidence()
    print(f"Step 2: Auto-accepted {auto_count} high-confidence labels")

    # Step 3: Human review for remaining
    human_labels = {
        "ex-3": "neutral",
        "ex-5": "neutral",
        "ex-7": "neutral",
    }
    for ex_id, label in human_labels.items():
        labeler.human_review(ex_id, label)

    # Report
    report = labeler.get_calibration_report()
    print(f"\nStep 3: Human reviewed {len(human_labels)} examples")
    print(f"\n=== Calibration Report ===")
    for key, value in report.items():
        print(f"  {key}: {value}")


if __name__ == "__main__":
    main()
