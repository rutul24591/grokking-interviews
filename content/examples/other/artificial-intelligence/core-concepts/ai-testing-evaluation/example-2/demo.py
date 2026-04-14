"""
Example 2: LLM-as-a-Judge Evaluation System

Demonstrates:
- Using a separate LLM to evaluate primary model outputs
- Scoring across multiple quality dimensions
- Calibration against human judgment
- Detecting evaluator bias
"""

from typing import Dict, List, Any
from dataclasses import dataclass


@dataclass
class EvaluationCriteria:
    name: str
    description: str
    weight: float
    prompt_template: str


@dataclass
class JudgeResult:
    criteria_scores: Dict[str, float]
    weighted_score: float
    judge_confidence: float
    reasoning: str


class LLMJudge:
    """Evaluates AI outputs using LLM-as-a-judge pattern."""

    CRITERIA = [
        EvaluationCriteria(
            name="correctness",
            description="Is the factual information accurate?",
            weight=0.35,
            prompt_template="Rate factual correctness 1-10: {output} given question: {input}",
        ),
        EvaluationCriteria(
            name="completeness",
            description="Does the answer cover all aspects of the question?",
            weight=0.25,
            prompt_template="Rate completeness 1-10: {output} for question: {input}",
        ),
        EvaluationCriteria(
            name="clarity",
            description="Is the response clear and well-structured?",
            weight=0.20,
            prompt_template="Rate clarity 1-10: {output}",
        ),
        EvaluationCriteria(
            name="helpfulness",
            description="Does the answer provide actionable value?",
            weight=0.20,
            prompt_template="Rate helpfulness 1-10: {output} for question: {input}",
        ),
    ]

    def __init__(self):
        self.evaluation_log: List[Dict] = []
        self.human_calibration: List[Dict] = []

    def simulate_judge_score(self, input_text: str, output: str, criteria: EvaluationCriteria) -> float:
        """Simulate LLM judge scoring (in production, this would be an actual LLM call)."""
        # Simulated scoring based on output characteristics
        base_score = 7.0

        # Longer, more detailed answers tend to score higher (LLM bias)
        length_bonus = min(len(output.split()) / 100, 1.0)

        # Answers with specific numbers/facts score higher on correctness
        has_facts = any(c.isdigit() for c in output)
        fact_bonus = 1.0 if has_facts else 0.0

        if criteria.name == "correctness":
            score = base_score + fact_bonus
        elif criteria.name == "completeness":
            score = base_score + length_bonus * 2
        elif criteria.name == "clarity":
            score = base_score + (1.0 if ". " in output else 0.0)
        else:
            score = base_score + length_bonus

        return min(max(score / 10.0, 0.0), 1.0)  # Normalize to 0-1

    def evaluate(self, input_text: str, output: str) -> JudgeResult:
        """Evaluate an output across all criteria."""
        scores = {}
        for criteria in self.CRITERIA:
            score = self.simulate_judge_score(input_text, output, criteria)
            scores[criteria.name] = round(score, 3)

        weighted = sum(
            scores[c.name] * c.weight for c in self.CRITERIA
        )

        self.evaluation_log.append({
            "input": input_text[:50],
            "output": output[:50],
            "scores": scores,
            "weighted": round(weighted, 3),
        })

        return JudgeResult(
            criteria_scores=scores,
            weighted_score=round(weighted, 3),
            judge_confidence=0.85,
            reasoning="Evaluated across 4 criteria with weighted scoring",
        )

    def calibrate_against_human(self, human_scores: List[Dict]) -> Dict[str, float]:
        """Calibrate judge scores against human evaluation."""
        self.human_calibration = human_scores
        biases = {}
        for criteria in self.CRITERIA:
            judge_vals = [e["scores"].get(criteria.name, 0) for e in self.evaluation_log]
            human_vals = [h.get(criteria.name, 0) for h in human_scores]
            if judge_vals and human_vals:
                avg_judge = sum(judge_vals) / len(judge_vals)
                avg_human = sum(human_vals) / len(human_vals)
                biases[criteria.name] = round(avg_judge - avg_human, 3)
        return biases


def main():
    judge = LLMJudge()

    test_cases = [
        ("What is OAuth?", "OAuth is an authorization framework that enables delegated access."),
        ("Analyze Q3 trends", "Q3 revenue grew 15% to $4.2B. Operating margins expanded to 28% from 24%."),
        ("Compare architectures", "Microservices offer independent scaling but add operational complexity compared to monoliths."),
    ]

    print("=== LLM-as-a-Judge Evaluation ===\n")

    for input_text, output in test_cases:
        result = judge.evaluate(input_text, output)
        print(f"Input: {input_text}")
        print(f"  Weighted Score: {result.weighted_score}")
        for criteria, score in result.criteria_scores.items():
            print(f"    {criteria}: {score}")
        print()

    # Simulate human calibration
    human_scores = [
        {"correctness": 0.8, "completeness": 0.6, "clarity": 0.85, "helpfulness": 0.75},
        {"correctness": 0.9, "completeness": 0.8, "clarity": 0.9, "helpfulness": 0.85},
    ]
    biases = judge.calibrate_against_human(human_scores)

    print("=== Judge Calibration vs Human ===")
    for criteria, bias in biases.items():
        direction = "overestimates" if bias > 0 else "underestimates"
        print(f"  {criteria}: judge {direction} by {abs(bias):.3f}")


if __name__ == "__main__":
    main()
