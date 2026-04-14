"""
Example 2: Human-in-the-Loop Approval Workflow

Demonstrates:
- AI generates draft output
- Human reviews and approves/edits
- Feedback loop for continuous improvement
- Escalation for uncertain cases
"""

from typing import Dict, Any, Optional, List
from dataclasses import dataclass
from enum import Enum


class ApprovalStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    EDITED = "edited"
    REJECTED = "rejected"
    ESCALATED = "escalated"


@dataclass
class ReviewRecord:
    item_id: str
    ai_output: str
    human_decision: ApprovalStatus
    human_edit: Optional[str] = None
    confidence: float = 0.0
    review_time_seconds: float = 0.0


class HITLWorkflow:
    """Human-in-the-Loop workflow with approval gates."""

    def __init__(self, auto_approve_threshold: float = 0.95):
        self.auto_approve_threshold = auto_approve_threshold
        self.reviews: List[ReviewRecord] = []
        self.edit_distance_log: List[float] = []

    def generate_draft(self, input_data: str) -> Dict[str, Any]:
        """AI generates a draft output."""
        # Simulated AI generation
        confidence = 0.7 + (hash(input_data) % 30) / 100  # 0.70-0.99
        return {
            "content": f"Draft analysis of: {input_data[:50]}",
            "confidence": round(confidence, 3),
            "auto_approve": confidence >= self.auto_approve_threshold,
        }

    def process_item(self, item_id: str, input_data: str, human_action: ApprovalStatus, human_edit: Optional[str] = None) -> Dict:
        """Process a single item through the HITL workflow."""
        draft = self.generate_draft(input_data)

        # Auto-approve high-confidence outputs
        if draft["auto_approve"] and human_action == ApprovalStatus.PENDING:
            human_action = ApprovalStatus.APPROVED

        record = ReviewRecord(
            item_id=item_id,
            ai_output=draft["content"],
            human_decision=human_action,
            human_edit=human_edit,
            confidence=draft["confidence"],
        )
        self.reviews.append(record)

        # Track edit distance when human edits
        if human_edit:
            edit_dist = len(human_edit) / max(len(draft["content"]), 1)
            self.edit_distance_log.append(round(edit_dist, 3))

        return {
            "item_id": item_id,
            "ai_confidence": draft["confidence"],
            "auto_approve": draft["auto_approve"],
            "human_decision": human_action.value,
            "final_output": human_edit if human_edit else draft["content"],
        }

    def get_quality_metrics(self) -> Dict[str, Any]:
        """Calculate quality metrics from review history."""
        total = len(self.reviews)
        if total == 0:
            return {"total_reviews": 0}

        approved = sum(1 for r in self.reviews if r.human_decision == ApprovalStatus.APPROVED)
        edited = sum(1 for r in self.reviews if r.human_decision == ApprovalStatus.EDITED)
        rejected = sum(1 for r in self.reviews if r.human_decision == ApprovalStatus.REJECTED)

        avg_confidence = sum(r.confidence for r in self.reviews) / total
        avg_edit_distance = sum(self.edit_distance_log) / max(len(self.edit_distance_log), 1)

        return {
            "total_reviews": total,
            "approval_rate": f"{approved / total * 100:.0f}%",
            "edit_rate": f"{edited / total * 100:.0f}%",
            "rejection_rate": f"{rejected / total * 100:.0f}%",
            "avg_ai_confidence": round(avg_confidence, 3),
            "avg_edit_distance": round(avg_edit_distance, 3),
        }


def main():
    workflow = HITLWorkflow(auto_approve_threshold=0.95)

    # Simulate processing items
    items = [
        ("item-1", "Market analysis for Q3", ApprovalStatus.APPROVED),
        ("item-2", "Competitor comparison", ApprovalStatus.EDITED, "Revised competitor analysis with updated data"),
        ("item-3", "Customer feedback summary", ApprovalStatus.APPROVED),
        ("item-4", "Technical incident report", ApprovalStatus.ESCALATED),
        ("item-5", "Product roadmap draft", ApprovalStatus.REJECTED),
    ]

    print("=== HITL Workflow Demo ===\n")

    for item in items:
        item_id, input_data, action = item[0], item[1], item[2]
        edit = item[3] if len(item) > 3 else None
        result = workflow.process_item(item_id, input_data, action, edit)
        print(f"Item: {item_id}")
        print(f"  AI Confidence: {result['ai_confidence']}")
        print(f"  Auto-approve: {result['auto_approve']}")
        print(f"  Human: {result['human_decision']}")
        print()

    print(f"=== Quality Metrics ===")
    metrics = workflow.get_quality_metrics()
    for key, value in metrics.items():
        print(f"  {key}: {value}")


if __name__ == "__main__":
    main()
